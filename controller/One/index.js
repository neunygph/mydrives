"use strict";
var express = require('express')
, query = require('querystring')
, router = express.Router()
, Promise = require('bluebird')
, https = require("https")
, template = require('../../views/OneDrive/index.marko')
, onedrive = require('../../models/admin/one.js')
, User = require('../../models/oneuser.js');

var one = new onedrive();
var user = new User();
var folder = user.folder;
var file = user.files;

router.get('/', function (req, res, next){
    if(req.cookies.oatk != undefined){
        next();
    }
    else if(req.cookies.oatk == undefined && req.cookies.orftk != undefined){//get refresh token
        getToken("", one.auth.host_, one.auth.tokenpath, one.auth.ClientID, one.auth.SKey, "", req.cookies.orftk, function(status,rfdata) {
            if(status == 200) {
                fetchAuth(rfdata);
                setCookies(res, one.auth.access_token, one.auth.refresh_token);
                showRoot(res,one.auth.access_token);
            }else res.redirect('/one');
        });
    }else res.marko(template,{ title: 'One Drive'});
}, function(req, res) {
    showRoot(res, req.cookies.oatk);
});
//get folders by id
router.get('/k/:id', function(req, res,next) {
    if(req.params.id != null || req.params.id != 'undefined'){
        if(req.cookies.oatk != undefined){
            one.auth.access_token = req.cookies.oatk;
            next();
        }
        else if(req.cookies.oatk == undefined && req.cookies.orftk != undefined){//get refresh token
            getToken("", one.auth.host_, one.auth.tokenpath, one.auth.ClientID, one.auth.SKey, "", req.cookies.orftk, function(status,rfdata) {
                if(status == 200) {
                    fetchAuth(rfdata);
                    setCookies(res, one.auth.access_token, one.auth.refresh_token);
                    next();
                }else res.redirect('/one');
            });
        }else res.marko(template,{ title: 'One Drive'});
    }
},function(req, res) {
    var jsonO = new Promise(function(resolve, reject){
        getChildren(one.auth.access_token, req.params.id, "", function(status,Obj){
            if(status == 200) {
                var s = JSON.parse(Obj);
                resolve(JSON.parse(Obj));
            }else res.redirect('/one');
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'One Drive', items: jsonO })
});

// first authentication process
router.get('/auth', function (req, res) {
    if(req.hostname.trim() != one.domain.trim()) {
        console.log('403: Forbidden request');
        res.sendStatus(403).end();
    }
    if(res.statusCode == 200 && typeof(req.query.code) != "undefined"){
        getToken(req.query.code, one.auth.host_, one.auth.tokenpath, one.auth.ClientID, 
        one.auth.SKey, one.domain, "", function(status,data){
            if(status == 200){
                fetchAuth(data);
                 if(one.auth.access_token.length > 0) {
                    setCookies(res, one.auth.access_token, one.auth.refresh_token);
                    res.redirect('/auth');
                 }
            }else res.send('Error :' + data);
        });
    }
    else if(req.query.lc != "undefined") res.redirect('/one');
    else {console.log(res.statusCode + ' : no code found.'); res.redirect('/');}
});

router.get('/logout', function(req, res) {
    clearCookies(res);res.redirect(one.auth.logOutUri);
})

router.get('/login', function(req, res){
    if(req.hostname.trim() === one.domain.trim()) {
      res.send(one.auth.logInUri);
    }
})

function showRoot(res,token){
    var jsonO = new Promise(function(resolve, reject){
        getChildren(token,"", "", function(status,Obj){
            if(status == 200) {
                //var s = JSON.parse(Obj);
                resolve(JSON.parse(Obj));
            }else res.marko(template,{ title: 'One Drive'});
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'One Drive', items: jsonO});
}

function setCookies(resp, atoken, rftoken){
    var options = {maxAge : 55*60*1000, secure: true, httpOnly:true, domain: one.domain.trim()};
    resp.cookie('oatk' , atoken , options);
    resp.cookie('orftk', rftoken, {maxAge : 24*60*60*1000, secure: true, httpOnly:true, domain: one.domain.trim()});
    resp.cookie('one',1,{maxAge: 24*60*60*1000,secure:true,domain: one.domain.trim()});
}

function clearCookies(res){
    var options = {maxAge : 1, secure: true, httpOnly:true, domain: one.domain.trim()};
    res.cookie('oatk',1, options);
    res.cookie('orftk',1, options);
    res.cookie('one',1,options);
}

function fetchUserInfo(data){
    var jres = JSON.parse(data);
    user.active = jres.status.state;
}

function fetchAuth(data){
    if(data == null) return;
    var jres = JSON.parse(data);
    one.auth.access_token = jres.access_token;
    one.auth.refresh_token = jres.refresh_token;
    one.auth.user_id = jres.user_id;
    
};

function getDefaultDrive(token,success){
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Connection':'keep-alive',
        'Cache-Control': 'private, max-age=259,200'
    };

    //GET option
    var option = {
        host : one.auth.api,
        path : '/v1.0/drive',
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

function getChildren(token, id, filters, success){
    var thumbnails = "thumbnails(select=c400x400)";//"thumbnails(filter=id eq '0')"
    var filter = filters.length > 0 ? filters : query.stringify({select:"@content.downloadUrl,id,name,webUrl,webDavUrl,folder,file,image,photo,audio,video,createdDateTime,lastModifiedDateTime",orderby:"lastModifiedDateTime desc",expand:thumbnails});
    //var filter = filters.length > 0 ? filters : query.stringify({select:"l@content.downloadUrl,id,name,webUrl,webDavUrl,folder,file,image,photo,audio,video,createdDateTime,lastModifiedDateTime",orderby:"lastModifiedDateTime desc",filter:"audio ne null or video ne null or image ne null or folder ne null",expand:thumbnails});
    var path = id.length > 0 ? '/v1.0/drive/items/' + id + '/children?' : '/v1.0/drive/root/children?';
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Connection':'keep-alive',
        'Cache-Control': 'private, max-age=259,200'
    };
    
    //GET option
    var option = {
        host : one.auth.api,
        path : path + filter,
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
    if(rftoken.length > 0) data = query.stringify({grant_type:'refresh_token',refresh_token:rftoken,client_id:cID,client_secret:cSKey,redirect_uri:'https://' + domain + '/one/auth'});
    else data = query.stringify({grant_type:'authorization_code',code:code,client_id:cID,client_secret:cSKey,redirect_uri:'https://' + domain + '/one/auth'});
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
