"use strict";
var express = require('express')
, query = require('querystring')
, router = express.Router()
, https = require("https")
, Promise = require('bluebird')
, template = require('../../views/Instagram/index.marko')
, Instagram = require('../../models/admin/instagram.js')
, User = require('../../models/instagramuser.js')
, crypto = require("crypto")
, async = require('async')

var instagram = new Instagram();
var user = new User();
var folder = user.folders;
var file = user.files;

//instagram page
router.get('/', function (req, res, next){
    if(req.cookies.iatk != undefined){
        next();
    }else res.marko(template,{ title: 'Instagram'});
}, function(req, res) {
    async.parallel([
        listMedia(res, req.cookies.iatk),
        getUserInfo(req.cookies.iatk,function(status,result){
            if(status == 200){
                var s = JSON.parse(result);
            }
        })
    ])
});
//get folders by id
router.get('/k/:id', function(req, res,next) {
    if(req.params.id != null || req.params.id != 'undefined'){
        if(req.cookies.iatk != undefined){
            instagram.auth.access_token = req.cookies.iatk;
            next();
        }else res.redirect('/instagram');
    }
},function(req, res) {
    var jsonO = new Promise(function(resolve, reject){
        listMedia(instagram.auth.access_token, function(status,Obj){
            if(status === 200) {
              //  var s = JSON.parse(Obj);
                resolve(JSON.parse(Obj));
            }else res.redirect('/instagram');
        },reject);
    }).catch(er => {
        console.log(er);
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Instagram', items: jsonO })
});

// first authentication process
router.get('/auth', function (req, res) {
    if(req.hostname.trim() != instagram.domain.trim()) {
        console.log('403: Forbidden request');
        res.sendStatus(403).end();
    }
    if(res.statusCode == 200 && typeof(req.query.code) != "undefined"){
        getToken(req.query.code, instagram.auth.host_, instagram.auth.tokenpath, instagram.auth.ClientID, 
        instagram.auth.SKey, instagram.domain, function(status,data){
            if(status === 200){
                fetchAuth(data);
                 if(instagram.auth.access_token != null) {
                    setCookies(res,instagram.auth.access_token);
                    res.redirect('/auth');
                 }
            }
        });
    }
    else {console.log(res.statusCode + ' : no code found.'); res.redirect('/');}
});

router.get('/logout', function(req, res) {
    clearCookies(res);res.redirect('/instagram');
})

router.get('/login', function(req, res){
    if(req.hostname.trim() === instagram.domain.trim()) {
      res.send(instagram.auth.logInUri);
    }
})

function setCookies(resp, token){
    var options = {maxAge : 24*60*60*1000, secure: true, httpOnly:true, domain: instagram.domain.trim()};
    resp.cookie('iatk' , token , options);
    resp.cookie('instagram',1, { maxAge: 24*60*60*1000, secure:true, domain: instagram.domain.trim()});
}

function clearCookies(res){
    var options = {maxAge : 1, secure: true, httpOnly:true, domain: instagram.domain.trim()};
    res.cookie('iatk' ,1,options);
    res.cookie('instagram',1,options);
}


function fetchAuth(data){
    if(data == null) return;
    var jres = JSON.parse(data);
    instagram.auth.access_token = jres.access_token != null ? jres.access_token : null;
};

function listMedia(res,token){
     var medias = new Promise(function(resolve, reject){
        getRecentMedia(token, function(status,Obj){
            if(status === 200) {
               // var s = JSON.parse(Obj)
                resolve(JSON.parse(Obj));
            }else res.redirect('/instagram');
        },reject);
    }).catch(err => {
        console.log(err)
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Instagram', items: medias});
}

function getUserInfo(token,success){
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Cache-Control': 'private, max-age=259,200',
        'Connection':'keep-alive'
    };

    //GET option
    var option = {
        host : 'api.instagram.com',
        path : '/v1/users/self/?access_token=' + token,
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
            success(response.statusCode,responseString); 
            responseString = '';
        });
    });req.end();
}

function getRecentMedia(token, success){
    var secret = '/users/self/media/recent|access_token=' + token;
    var sig = crypto.createHmac('sha256',instagram.auth.SKey).update(secret).digest("hex");
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Cache-Control': 'private, max-age=259,200',
        'Connection':'keep-alive'
    };

    var option = {
        host : 'api.instagram.com',
        path : '/v1/users/self/media/recent/?access_token=' + token + '&sig=' + sig,
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
            success(response.statusCode,responseString);
            responseString = '';
            
        });
    });req.end();
}

function getToken(code, host, path,cID, cSKey, domain, success) {
    var data = 'grant_type=authorization_code&code='+ code +'&client_id=' + cID + '&client_secret=' + cSKey +  '&redirect_uri=https://' + domain + '/instagram/auth';
    
    var header = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'no-cache',
        'Connection':'keep-alive'
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
            success(response.statusCode,responseString);
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
