"use strict";
var express = require('express')
, query = require('querystring')
, router = express.Router()
, Promise = require('bluebird')
, https = require("https")
, template = require('../../views/Amazon/index.marko')
, amazon = require('../../models/admin/amazon.js')
, User = require('../../models/amazonuser.js')
, ttemp = require('../../views/Amazon/template.marko')
, markoWidgets = require('marko-widgets')
, wtemp = require('../../views/Amazon/wtemp.marko')

var amzn = new amazon();
var user = new User();
var folder = user.folders;
var file = user.files;
var path = {};

router.get('/', function (req, res, next){
    path = getPath(req,'','');
    if(req.cookies.atk != undefined){
        next();
    }
    else if(req.cookies.atk == undefined && req.cookies.rftk != undefined && req.cookies.muri != undefined){//get refresh token
        getToken("", amzn.auth.host_, amzn.auth.path, amzn.auth.ClientID, amzn.auth.SKey, "", req.cookies.rftk, function(status,rfdata) {
            if(status == 200) {
                fetchAuth(rfdata);
                setCookies(res, req.cookies.muri, amzn.auth.access_token, amzn.auth.refresh_token);
                showRoot(res,amzn.auth.access_token, req.cookies.muri, path);
            }else res.redirect('/amazon');
        });
    }else res.marko(template, { title:'amazon' });
}, function(req, res) {
    showRoot(res, req.cookies.atk, req.cookies.muri, path);
});

router.get('/k/:id', function(req, res,next) {
    path = getPath(req,'',req.cookies.currentname);
    if(req.params.id != null || req.params.id != 'undefined'){
        if(req.cookies.atk != undefined){
            amzn.auth.access_token = req.cookies.atk;
            next();
        }
        else if(req.cookies.atk == undefined && req.cookies.rftk != undefined && req.cookies.muri != undefined){//get refresh token
            getToken("", amzn.auth.host_, amzn.auth.path, amzn.auth.ClientID, amzn.auth.SKey, "", req.cookies.rftk, function(status,rfdata) {
                if(status == 200) {
                    fetchAuth(rfdata);
                    setCookies(res, req.cookies.muri, amzn.auth.access_token, amzn.auth.refresh_token);
                    next();
                }else res.redirect('/amazon');
            });
        }else res.marko(template, { title:'amazon' });
    }
},function(req, res) {
    var jsonO = new Promise(function(resolve, reject){
        getChildren(amzn.auth.access_token, req.cookies.muri, req.params.id, "", function(status,Obj){
            if(status == 200) {
               // var s = JSON.parse(Obj);
                resolve(JSON.parse(Obj));
            }else res.redirect('/amazon');
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Amazon Cloud Drive', path: path, items: jsonO});
});

router.get('/auth', function (req, res,next) {
    if(req.hostname.trim() != amzn.domain.trim()) {
        console.log('403: Forbidden request');
        res.sendStatus(403).end();
    }
    if(res.statusCode == 200 && typeof(req.query.code) != "undefined"){
        getToken(req.query.code, amzn.auth.host_, amzn.auth.path, amzn.auth.ClientID, 
        amzn.auth.SKey, amzn.domain, amzn.auth.refresh_token, function(status,data){
            if(status == 200){
                fetchAuth(data);
                 if(amzn.auth.access_token != null) {
                    next();
                 }
            }
        });
    }
    else {console.log(res.statusCode + ' : no code found.'); res.redirect('/');}
},function(req, res) {
    getEndPoints(amzn.auth.access_token, function(status,ep){
        if(status == 200){
            fetchEndpoint(ep);
            if(user.active){
                setCookies(res, user.mdUrl, amzn.auth.access_token, amzn.auth.refresh_token);
                 res.redirect('/auth');
            }
            else{
                console.log('User is not active on Amazon Cloud Drive');
            }
        }
    });
});

router.get('/logout', function(req, res) {
    clearCookies(res);res.redirect('/amazon');
})

router.get('/login', function(req, res){
    if(req.hostname.trim() === amzn.domain.trim()) {
      res.send(amzn.auth.logInUri);
    }
})

function showRoot(res,token,mUrl,path){
    var jsonO = getFoldersPromise(token, mUrl,"%20AND%20isRoot:true").then(fldObj =>{
        fetchFolder(fldObj);
        return getChildrenPromise(token, mUrl, folder.id, "").then(JSON.parse);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Amazon Cloud Drive', path: path, items: jsonO});
}
function getPath(req,prevname,currentname){
    if(req === undefined) return;
    var refererUrl = req.headers['referer'] !== undefined ? req.headers['referer'] : "";
    return { prev:{id:refererUrl.length > 0 ? refererUrl.split(req.headers.host)[1] : refererUrl ,name:prevname },base:req.baseUrl,url:req.url,originalUrl:{ id:req.originalUrl,name:currentname } };
}
function setCookies(resp, mdUrl, atoken, rftoken){
    var options = {maxAge : 55*60*1000, secure: true, httpOnly:true, domain: amzn.domain.trim()};
    resp.cookie('atk' , atoken , options);
    resp.cookie('muri', mdUrl, {maxAge : 24*60*60*1000, secure: true, httpOnly:true, domain: amzn.domain.trim()});
    resp.cookie('rftk', rftoken, {maxAge : 24*60*60*1000, secure: true, httpOnly:true, domain: amzn.domain.trim()});
    resp.cookie('amazon',1,{maxAge: 24*60*60*1000,secure:true,domain: amzn.domain.trim()});
}

function clearCookies(res){
    var options = {maxAge : 1, secure: true, httpOnly:true, domain: amzn.domain.trim()};
    res.cookie('atk' ,1,options);
    res.cookie('muri',1, options)
    res.cookie('curi',1,options)
    res.cookie('rftk',1, options);
    res.cookie('amazon',1,options);
}

function fetchEndpoint(data){
    var jres = JSON.parse(data);
    user.active = jres.customerExists;
    user.mdUrl = jres.metadataUrl;
    user.ctUrl = jres.contentUrl;
}

function fetchAuth(data){
    if(data == null) return;
    var jres = JSON.parse(data);
    amzn.auth.access_token = jres.access_token != null ? jres.access_token : null;
    amzn.auth.refresh_token = jres.refresh_token != null ? jres.refresh_token : null;
};

function fetchFolder(data) {
    if(data == null) return;
    var jres = JSON.parse(data);
    folder.id = jres.data[0].id != null ? jres.data[0].id : null;
    folder.name = jres.data[0].name != null ? jres.data[0].name : null;
    folder.labels = jres.data[0].labels != null ? jres.data[0].labels : null;
    folder.createdDate = jres.data[0].createdDate != null ? jres.data[0].createdDate : null;
    folder.modifiedDate = jres.data[0].modifiedDate != null ? jres.data[0].modifiedDate : null;
    folder.metadata = jres.data[0].metadata != null ? jres.data[0].metadata : null;
    folder.parent = jres.data[0].parent != null ? jres.data[0].parent : null;
    folder.root = jres.data[0].root != null ? jres.data[0].root : null;
    folder.status = jres.data[0].status != null ? jres.data[0].status : null;
    folder.restricted = jres.data[0].restricted != null ? jres.data[0].restricted : null;
}

function getEndPoints(token,success){
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Connection':'keep-alive',
        'Cache-Control': 'private, max-age=259,200'
    };

    //GET option
    var option = {
        host : 'drive.amazonaws.com',
        path : '/drive/v1/account/endpoint',
        method: 'GET',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    var req = https.request(option,function(response){
        response.setEncoding('utf-8');
        var responseString = ''
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString += data;});
        response.on('end', function () {
            success(response.statusCode,responseString)
            responseString = '';
        });
    });req.end();
}

function getChildren(token, endpoint,id, filters, success){
    var host_ = endpoint.substring(8, endpoint.lastIndexOf('.com')) + '.com';
    var subpath = endpoint.substring(endpoint.lastIndexOf('.') + 4);
    var filter = '%20AND%20status:AVAILABLE' + filters;
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Connection':'keep-alive',
        'Cache-Control': 'private, max-age=259,200'
    };

    //GET option
    var option = {
        host : host_,
        path : subpath + 'nodes/' + id + '/children?tempLink=true&sort=%5B%22contentProperties.contentType%20ASC%22%2C%20%22createdDate%20DESC%22%5D',
        method: 'GET',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    
    var req = https.request(option,function(response){
        response.setEncoding('utf-8');
        var responseString = '';
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString += data;});
        response.on('end', function () {
            success(response.statusCode,responseString)
            responseString = '';
        });
    });req.end();
}
function getFoldersPromise(token, endpoint,filters){
    return new Promise((resolve, reject) => {
        getFolders(token, endpoint,filters,function(status, obj){
            if (status === 200) {
                resolve(obj);
            } else {
                reject(new Error('something went wrong'));
            }
        })
    });
}
function getChildrenPromise(token, endpoint,id, filters){
    return new Promise((resolve, reject) => {
        getChildren(token, endpoint, id,filters,function(status, obj){
            if (status === 200) {
                resolve(obj);
            } else {
                reject(new Error('something went wrong'));
            }
        })
    });
}
function getFolders(token, endpoint,filters, success){
    var host_ = endpoint.substring(8, endpoint.lastIndexOf('.com')) + '.com';
    var subpath = endpoint.substring(endpoint.lastIndexOf('.') + 4);
    var filter = '%20AND%20status:AVAILABLE' + filters;
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Connection':'keep-alive',
        'Cache-Control': 'private, max-age=259,200'
    };

    //GET option
    var option = {
        host : host_,
        path : subpath + 'nodes?filters=kind:FOLDER' + filter,
        method: 'GET',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    var req = https.request(option,function(response){
        response.setEncoding('utf-8');
        var responseString = '';
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString += data;});
        response.on('end', function () {
            success(response.statusCode,responseString)
            responseString = '';
        });
    });req.end();
}


function getToken(code, host, path,cID, cSKey, domain, rftoken, success) {
    var data = '';
    if(rftoken != null) data = 'grant_type=refresh_token&refresh_token='+ rftoken +'&client_id=' + cID + '&client_secret=' + cSKey;
    else data = 'grant_type=authorization_code&code='+ code +'&client_id=' + cID + '&client_secret=' + cSKey +  '&redirect_uri=https://' + domain + '/amazon/auth';
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Connection':'keep-alive',
        'Cache-Control': 'no-cache'
    };

    //POST option
    var option = {
        host : host,
        path : path,
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };

    var reqPost = https.request(option,function(response){
        response.setEncoding('utf-8');
        var responseString = '';
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString += data;});
        response.on('end', function () {
            success(response.statusCode,responseString)
            responseString = '';
        });
    });reqPost.write(data);reqPost.end();
}

function searchFiles(){};

function upLoad(){};

function downLoad(){};

function createSharedLink(){};

function getSharedFiles(){};

function moveFile(){};

function copyFile(){};

function updateFile(){};

function deleteFiles(){};

function createFolder(){};
module.exports = router
