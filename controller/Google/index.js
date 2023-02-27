"use strict";
var express = require('express')
, query = require('querystring')
, router = express.Router()
, Promise = require('bluebird')
, https = require("https")
, template = require('../../views/Google/index.marko')
, GoogleDrive = require('../../models/admin/google.js')
, User = require('../../models/oneuser.js');

var google = new GoogleDrive();
var user = new User();
var folder = user.folder;
var path = {}

router.get('/', function (req, res, next){
    path = getPath(req);
    if(req.cookies.gatk != undefined){
        next();
    }
    else if(req.cookies.gatk == undefined && req.cookies.grftk != undefined){//get refresh token
        getToken("", google.auth.host_, google.auth.tokenpath, google.auth.ClientID, google.auth.SKey, "", req.cookies.grftk, function(status,rfdata) {
            if(status == 200) {
                fetchAuth(rfdata);
                setCookies(res, google.auth.access_token, google.auth.refresh_token != null ? google.auth.refresh_token : req.cookies.grftk);
                showRoot(res,google.auth.access_token,path);
            }
            else if(status == 400) {
                clearCookies(res);
                console.log('404 error');
                res.redirect('/google');
            }
        });
    }else res.marko(template,{ title: 'Google Drive'});
}, function(req, res) {
    showRoot(res, req.cookies.gatk, path);
});
//get folders by id
router.get('/k/:id', function(req, res,next) {
    path = getPath(req);
    if(req.params.id != null || req.params.id != 'undefined'){
        if(req.cookies.gatk != undefined){
            google.auth.access_token = req.cookies.gatk;
            next();
        }
        else if(req.cookies.gatk == undefined && req.cookies.grftk != undefined){//get refresh token
            getToken("", google.auth.host_, google.auth.tokenpath, google.auth.ClientID, google.auth.SKey, "", req.cookies.grftk, function(status,rfdata) {
                if(status == 200) {
                    fetchAuth(rfdata);
                    setCookies(res, google.auth.access_token, google.auth.refresh_token != null ? google.auth.refresh_token : req.cookies.grftk);
                    next();
                }else res.redirect('/google');
            });
        }else res.marko(template,{ title: 'Google Drive'});
    }
},function(req, res) {
    var jsonO = new Promise(function(resolve, reject){
        getChildren(google.auth.access_token, req.params.id, "", function(status,Obj){
            if(status == 200) {
                //var s = JSON.parse(Obj);
                resolve(JSON.parse(Obj));
            }else res.redirect('/google');
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Google Drive', path:path, items: jsonO })
});

// first authentication process
router.get('/auth', function (req, res) {
    if(req.hostname.trim() != google.domain.trim()) {
        console.log('403: Forbidden request');
        res.sendStatus(403).end();
    }
    if(res.statusCode == 200 && typeof(req.query.code) != "undefined"){
        getToken(req.query.code, google.auth.host_, google.auth.tokenpath, google.auth.ClientID, 
        google.auth.SKey, google.domain, "", function(status,data){
            if(status == 200){
                fetchAuth(data);
                 if(google.auth.access_token.length > 0) {
                    setCookies(res, google.auth.access_token, google.auth.refresh_token != null ? google.auth.refresh_token : req.cookies.grftk);
                    res.redirect('/auth');
                 }
            }else res.send('Error :' + data);
        });
    }
    else if(req.query.lc != "undefined") res.redirect('/one');
    else {console.log(res.statusCode + ' : no code found.'); res.redirect('/');}
});


router.get('/logout', function(req, res) {
    var token = "";
    if(req.cookies.gatk != undefined) token = req.cookies.gatk
    else if(req.cookies.grftk != undefined) token = req.cookies.grftk
    if(token.length > 0){
        clearCookies(res);
        logOut(token,function(status){
              if(status == 200) res.redirect('/google');
        });
    }
})

router.get('/login', function(req, res){
    if(req.hostname.trim() === google.domain.trim()) {
      res.send(google.auth.logInUri);
    }
})

function showRoot(res,token){
    var jsonO = new Promise(function(resolve, reject){
        getChildren(token,"root", "", function(status,Obj){
            if(status == 200) {
               // var s = JSON.parse(Obj);
                resolve(JSON.parse(Obj));
            }
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Google Drive', path:path, items: jsonO});
}
function getPath(req,prevname,currentname){
    if(req === undefined) return;
    var refererUrl = req.headers['referer'] !== undefined ? req.headers['referer'] : "";
    return { prev:{id:refererUrl.length > 0 ? refererUrl.split(req.headers.host)[1] : refererUrl ,name:prevname },base:req.baseUrl,url:req.url,originalUrl:{ id:req.originalUrl,name:currentname } };
}
function setCookies(res, atoken, rftoken){
    var options = {maxAge : 58*60*1000, secure: true, httpOnly:true, domain: google.domain.trim()};
    if(atoken != undefined) res.cookie('gatk' , atoken , options);
    if(rftoken != undefined) res.cookie('grftk', rftoken, {maxAge : 3*24*60*60*1000, secure: true, httpOnly:true, domain: google.domain.trim()});
    res.cookie('google',1,{maxAge: 58*60*1000,secure:true,domain: google.domain.trim()});
}

function clearCookies(res){
    var options = {maxAge : 1, secure: true, httpOnly:true, domain: google.domain.trim()};
    res.cookie('gatk',1, options);
    res.cookie('grftk',1, options);
    res.cookie('google',1,options);
}

function fetchUserInfo(data){
    var jres = JSON.parse(data);
    user.active = jres.status.state;
}

function fetchAuth(data){
    if(data == null) return;
    var jres = JSON.parse(data);
    google.auth.access_token = jres.access_token != undefined ? jres.access_token : null;
    google.auth.refresh_token = jres.refresh_token != undefined ? jres.refresh_token : null;
};

function fetchFolder(data) {
    if(data == null) return;
    var jres = JSON.parse(data);
    folder.id = jres.id;
    user.active = jres.status.state;
}

function getChildren(token, id, filters, success){
   // var data = "orderBy=folder%2CcreatedTime+desc&pageSize=100&q='" + id + "'+in+parents+and+trashed+!%3D+true+and+(mimeType+contains+'folder'+or+mimeType+contains+'image'+or+mimeType+contains+'video'+or+mimeType+contains+'audio')&fields=files(contentHints%2CcreatedTime%2CfileExtension%2CiconLink%2Cid%2CimageMediaMetadata(height%2Cwidth)%2Ckind%2CmimeType%2CmodifiedTime%2Cname%2Cparents%2Cproperties%2Cshared%2Csize%2CthumbnailLink%2CvideoMediaMetadata(height%2Cwidth)%2CwebContentLink%2CwebViewLink)%2Ckind%2CnextPageToken";
    var data = "orderBy=folder%2CcreatedTime+desc&pageSize=100&q='" + id + "'+in+parents+and+trashed+!%3D+true&fields=files(contentHints%2CcreatedTime%2CfileExtension%2CiconLink%2Cid%2CimageMediaMetadata(height%2Cwidth)%2Ckind%2CmimeType%2CmodifiedTime%2Cname%2Cparents%2Cproperties%2Cshared%2Csize%2CthumbnailLink%2CvideoMediaMetadata(height%2Cwidth)%2CwebContentLink%2CwebViewLink)%2Ckind%2CnextPageToken";
    var path = '/drive/v3/files?'
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Connection':'keep-alive',
        'Cache-Control': 'private, max-age=259,200'
    };
    
    //GET option
    var option = {
        host : google.auth.host_,
        path : path + data,
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
        response.on('data', function (rdata) {responseString += rdata;});
        response.on('end', function () {
            success(response.statusCode,responseString)
            responseString = '';
        });
    });req.end();
}


function getToken(code, host, path,cID, cSKey, domain, rftoken, success) {
    var data = '';
    if(rftoken.length > 0) data = query.stringify({grant_type:'refresh_token',refresh_token:rftoken,client_id:cID,client_secret:cSKey});
    else data = query.stringify({grant_type:'authorization_code',code:code,client_id:cID,client_secret:cSKey,redirect_uri:'https://' + domain + '/google/auth'});
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
        response.on('error', function(e) {
            console.log(response.statusCode);
        });
        response.on('data', function (rdata) {responseString += rdata;});
        response.on('end', function () {
            success(response.statusCode,responseString)
            responseString = '';
        });
    });reqPost.write(data);reqPost.end();
}

function logOut(token,callback) {
    var log = false;
    var header = {'Cache-Control': 'no-cache'},
    option = {
        host : google.auth.accountUri,
        path : '/o/oauth2/revoke?token=' + token,
        method: 'GET',
        port:null,
        agent:false,
        gzip:true,
        header:header
    };
    var reqPost = https.request(option,function(response){
        var responseString = '';
        response.on('error', function(e) {
            console.log(response.statusCode);
        });
        response.on('data', function (rdata) {responseString += rdata;});
        response.on('end', function () {
            callback(response.statusCode)
        });
    });reqPost.end();

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
