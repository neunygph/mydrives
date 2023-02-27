"use strict";
var express = require('express')
, query = require('querystring')
, router = express.Router()
, Promise = require('bluebird')
, https = require("https")
, template = require('../../views/Facebook/index.marko')
, Facebook = require('../../models/admin/facebook.js')
, User = require('../../models/facebookuser.js')
, crypto = require("crypto")

var facebook = new Facebook();
var user = new User();
var folder = user.folders;
var file = user.files;

//facebook page
router.get('/', function (req, res, next){
    if(req.cookies.fatk != undefined && req.cookies.md_fbid != undefined){
        next();
    }else res.marko(template,{ title: 'Facebook'});
}, function(req, res) {
    showProfile(res, req.cookies.fatk, req.cookies.md_fbid);
});
//get folders by id
router.get('/k/:id', function(req, res,next) {
    if(req.params.id != null || req.params.id != 'undefined'){
        if(req.cookies.fatk != undefined && req.cookies.md_fbid != undefined){
            facebook.auth.access_token = req.cookies.fatk;
            next();
        }else res.marko(template,{ title: 'Facebook'});
    }
},function(req, res) {
    var jsonO = new Promise(function(resolve, reject){
        getAlbumProperties(facebook.auth.access_token, req.params.id, function(status,data){
            if(status === 200) {
               // var s = JSON.parse(data);
                resolve(JSON.parse(data));
            }
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Facebook', items: jsonO })
});

// first authentication process
router.get('/auth', function (req, res) {
    if(req.hostname.trim() != facebook.domain.trim() && req.query.state != 9582) {
        console.log('403: Forbidden request');
        res.sendStatus(403).end();
    }
    if(res.statusCode === 200 && typeof(req.query.code) != "undefined"){
        Promise.all([
            new Promise(function(resolve, reject){
                getToken(req.query.code, facebook.auth.ClientID, facebook.auth.SKey, facebook.domain, function(status,data){
                    if(status === 200){
                        fetchAuth(data);
                         if(facebook.auth.access_token != null) {
                            resolve(facebook.auth.access_token);
                         }
                    }
                });
            }),
             new Promise(function(resolve,reject){
                getAppToken(facebook.auth.ClientID, facebook.auth.SKey, function(status,data){
                    if(status === 200){
                        var appVal = data.split("access_token=");
                        facebook.auth.app_token = appVal[1];
                        resolve(facebook.auth.app_token);
                    }
                });
            })
        ]).then(token => {
            inspectToken(token[0], token[1],function(status,data){
                if(status === 200){
                    var val = JSON.parse(data);
                    if(val.data.is_valid === true && val.data.app_id == facebook.auth.ClientID){
                        //facebook.auth.user_id = val.data.user_id;
                        setCookies(res,token[0],val.data.user_id);
                        res.redirect('/auth');
                    }
                }
            });
        })
    }
    else {console.log(res.statusCode + ' : no code found.'); res.redirect('/');}
});

router.get('/logout', (req, res) => {
    if(req.cookies.fatk != undefined && req.cookies.md_fbid != undefined){
        deletePermissions(req.cookies.fatk,"", (status)=>{
            if(status === 200){
                clearCookies(res);
                res.redirect('/');
            }
            else console.log('Failed to log out of Facebook');
        });
    }
})

router.get('/login', (req, res) => {
    if(req.hostname.trim() === facebook.domain.trim()) {
      res.send(facebook.auth.logInUri);
    }
});

function showProfile(res,token, userid){
    var jsonO = new Promise(function(resolve, reject){
        getProfile(token, function(status,data){
            if(status === 200){
                var profile = JSON.parse(data);
                if(profile.id == userid){
                    resolve(profile);
                }
            }
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Facebook', items: jsonO});
}

function setCookies(resp, token, user_id){
    var options = {maxAge : 24*60*60*1000, secure: true, httpOnly:true, domain: facebook.domain.trim()};
    resp.cookie('fatk' , token , options);
    resp.cookie('facebook',1, { maxAge: 24*60*60*1000, secure:true, domain: facebook.domain.trim()});
    resp.cookie('md_fbid', user_id, options);
}

function clearCookies(res){
    var options = {maxAge : 1, secure: true, httpOnly:true, domain: facebook.domain.trim()};
    res.cookie('fatk' ,1,options);
    res.cookie('facebook',1,options);
    res.cookie('md_fbid',1,options);
}


function fetchAuth(data){
    if(data == null) return;
    var jres = JSON.parse(data);
    facebook.auth.access_token = jres.access_token != null ? jres.access_token : null;
};

function getAlbumProperties(token,id, success) {
    var secret = crypto.createHmac('sha256',facebook.auth.SKey).update(token).digest("hex");
    var data = id + '?debug=all&return_ssl_resources=true&fields=photos.limit(100){id,created_time,updated_time,images},edit_link,count&access_token=' + token + '&appsecret_proof=' + secret;
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'private, max-age=259,200',
        'Connection':'keep-alive'
    };

    //POST option
    var option = {
        host : 'graph.facebook.com',
        path : '/v2.8/' + data,
        method: 'GET',
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
            success(response.statusCode,responseString);
            responseString = '';
        });
    }); reqPost.write(data); reqPost.end();
}

function getProfile(token, success) {
    var secret = crypto.createHmac('sha256',facebook.auth.SKey).update(token).digest("hex");token + '&appsecret_proof=' + secret;
    var data = 'debug=all&return_ssl_resources=true&fields=id,name,albums{id,name,photo_count,video_count,created_time,picture},videos{id,description,created_time,embed_html,picture}&access_token=' + token + '&appsecret_proof=' + secret;
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'private, max-age=259,200',
        'Connection':'keep-alive'
    };

    //POST option
    var option = {
        host : 'graph.facebook.com',
        path : '/v2.8/me?' + data,
        method: 'GET',
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
            success(response.statusCode,responseString);
            responseString = '';
        });
    }); reqPost.write(data); reqPost.end();
}

function getToken(code, cID, cSKey, domain, success) {
    var data = 'client_id=' + cID + '&redirect_uri=https://' + domain + '/facebook/auth&client_secret=' + cSKey +  '&code='+ code;
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'no-cache',
        'Connection':'keep-alive'
    };

    //POST option
    var option = {
        host : 'graph.facebook.com',
        path : '/v2.8/oauth/access_token?' + data,
        method: 'GET',
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
            success(response.statusCode,responseString);
            responseString = '';
        });
    }); reqPost.write(data); reqPost.end();
}

function getAppToken(cID, cSKey, success) {
    var data = 'client_id=' + cID + '&client_secret=' + cSKey +  '&grant_type=client_credentials';
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'no-cache',
        'Connection':'keep-alive'
    };

    //POST option
    var option = {
        host : 'graph.facebook.com',
        path : '/oauth/access_token?' + data,
        method: 'GET',
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
            success(response.statusCode,responseString);
            responseString = '';
        });
    }); reqPost.write(data); reqPost.end();
}

function inspectToken(token, apptoken, success) {
    var data = 'input_token=' + token + '&access_token=' + apptoken;
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'no-cache',
        'Connection':'keep-alive'
    };

    //POST option
    var option = {
        host : 'graph.facebook.com',
        path : '/debug_token?' + data,
        method: 'GET',
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
            success(response.statusCode,responseString);
            responseString = '';
        });
    }); reqPost.write(data); reqPost.end();
}

function checkPermissions(token, success) {
    var secret = crypto.createHmac('sha256',facebook.auth.SKey).update(token).digest("hex");
    var data = 'access_token=' + token + '&appsecret_proof=' + secret;
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'no-cache',
        'Connection':'keep-alive'
    };

    //POST option
    var option = {
        host : 'graph.facebook.com',
        path : '/me/permissions?' + data,
        method: 'GET',
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
            success(response.statusCode,responseString);
            responseString = '';
        });
    }); reqPost.write(data); reqPost.end();
}

function deletePermissions(token, permissionName, success) {
    var secret = crypto.createHmac('sha256',facebook.auth.SKey).update(token).digest("hex");
    var data = 'access_token=' + token + '&appsecret_proof=' + secret;
    var path = permissionName.length > 0 ? '/' + permissionName : "";
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'no-cache'
    };

    //POST option
    var option = {
        host : 'graph.facebook.com',
        path : '/me/permissions' + path,
        method: 'DELETE',
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
            success(response.statusCode);
            responseString = '';
        });
    }); reqPost.write(data); reqPost.end();
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
