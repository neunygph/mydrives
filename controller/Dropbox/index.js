"use strict";
var express = require('express')
, query = require('querystring')
, router = express.Router()
, Promise = require('bluebird')
, https = require("https")
, template = require('../../views/Dropbox/index.marko')
, Dropbox = require('../../models/admin/dropbox.js')
, User = require('../../models/dropboxuser.js')
, async = require('async')
// , bodyParser = require('body-parser')
// , rawParser = bodyParser.raw({ type: 'application/octet-stream' })


var dropbox = new Dropbox();
var user = new User();
var folder = user.folders;
var file = user.files;

//dropbox page
router.get('/', function (req, res, next){
    if(req.cookies.datk != undefined){
        next();
    }else res.marko(template, {title:'dropbox'});
}, function(req, res) {
    async.parallel([
        listChildren(res, req.cookies.datk, ""),
        getSpaceUsage(req.cookies.datk,function(status,result){
            if(status == 200){
                var s = JSON.parse(result);
            }
        })
    ])
});
//get folders by id
router.get('/k/:id', function(req, res,next) {
    if(req.params.id != null || req.params.id != 'undefined'){
        if(req.cookies.datk != undefined){
            dropbox.auth.access_token = req.cookies.datk;
            next();
        }else res.marko(template, {title:'dropbox'});
    }
},function(req, res) {
    listChildren(res, dropbox.auth.access_token, req.params.id,"")
});

router.get('/view/:rev', function(req, res,next) {
    if(req.params.rev != null || req.params.rev != 'undefined'){
        if(req.cookies.datk != undefined){
            dropbox.auth.access_token = req.cookies.datk;
            next();
        }else res.marko(template, {title:'dropbox'});
    }
},function(req, res) {
    var tempLink = new Promise((resolve, reject) => {
        getPreview(dropbox.auth.access_token, req.params.rev,function(status, link){
            if (status === 200) {resolve(link)}
            else {reject(new Error('something went wrong'))}
        })
    }).then(vd =>{
        res.send(vd);
    });
});

router.get('/p/:path', function(req, res,next) {
    if(req.params.path != null || req.params.path != 'undefined'){
        if(req.cookies.datk != undefined){
            dropbox.auth.access_token = req.cookies.datk;
            next();
        }else res.marko(template, {title:'dropbox'});
    }
},function(req, res) {
    var tempLink = new Promise((resolve, reject) => {
        getTempLink(dropbox.auth.access_token, req.params.path,function(status, link){
            if (status === 200) {resolve(link)}
            else {reject(new Error('something went wrong'))}
        })
    }).then(tlink =>{
        res.send(tlink);
    });
});

router.get('/download/:rev', function(req, res,next) {
    if(req.params.rev != null || req.params.rev != 'undefined'){
        if(req.cookies.datk != undefined){
            dropbox.auth.access_token = req.cookies.datk;
            next();
        }else res.marko(template, {title:'dropbox'});
    }
},function(req, res) {
    var downloadedfile = new Promise((resolve, reject) => {
        downLoad(dropbox.auth.access_token, req.params.rev,function(status, file){
            if (status === 200) {resolve(file)}
            else {reject(new Error('something went wrong'))}
        })
    }).catch(err => {
        console.log(err)
    }).then(dldfile =>{
        res.send(dldfile);
    })
});

router.get('/create/:path', function(req, res,next) {
    if(req.params.path != null || req.params.path != 'undefined'){
        if(req.cookies.datk != undefined){
            dropbox.auth.access_token = req.cookies.datk;
            next();
        }else res.marko(template, {title:'dropbox'});
    }
},function(req, res) {
    var foldermeta = new Promise((resolve, reject) => {
        createFolder(dropbox.auth.access_token, req.params.rev,function(status, file){
            if (status === 200) {resolve(file)}
            else {reject(new Error('something went wrong'))}
        })
    }).catch(err => {console.log(err)}).then(meta =>{
        console.log(meta);
        
    })
});

// first authentication process
router.get('/auth', function (req, res,next) {
    if(req.hostname.trim() != dropbox.domain.trim() && req.query.state != 9582) {
        console.log('403: Forbidden request');
        res.sendStatus(403).end();
    }
    if(res.statusCode == 200 && typeof(req.query.code) != "undefined"){
        getToken(req.query.code, dropbox.auth.host_, dropbox.auth.path, dropbox.auth.ClientID, 
        dropbox.auth.SKey, dropbox.domain, function(status,data){
            if(status == 200){
                fetchAuth(data);
                 if(dropbox.auth.access_token.length > 0) {
                    setCookies(res, dropbox.auth.access_token);
                    res.redirect('/auth');
                 }
            }
            else if(status == 401) {
                console.log('invalid or expired token')
                res.redirect('/dropbox');
            }
            else res.send('Error :' + data);
        });
    }
    else {console.log(res.statusCode + ' : no code found.'); res.redirect('/');}
});


router.get('/logout', function(req, res) {
    logOff(req.cookies.datk,function(status){
        if(status == 200){
            clearCookies(res);res.redirect('/dropbox');
        }
    })
})

router.get('/login', function(req, res){
    if(req.hostname.trim() === dropbox.domain.trim()) {
      res.send(dropbox.auth.logInUri);
    }
})

function listChildren(res,token,path){
    console.log('showRoot start : ' + new Date().toISOString())
    var entries = new Promise(function(resolve, reject){
        getChildren(token,path, "", function(status,Obj){
            if(status === 200) {
                //var s = JSON.parse(Obj)
                resolve(JSON.parse(Obj));
            }else res.redirect('/dropbox');
        },reject);
    });
    var thumbs = entries.then(function(children){
        var rex = children.entries.filter(function(val){
            return (val.media_info != undefined && val.media_info.metadata[".tag"] === "photo")
        });
        return Promise.all(rex.map(function(val){
            return new Promise(function(resolve,reject) {
                getThumbnail(token, val.rev, "w640h480",function(status,result){
                    if (status === 200) { 
                        resolve(JSON.parse(JSON.stringify({rev:val.rev , base64:result.toString('base64')})));
                    } 
                    else { reject(status)}
                });
           });
        }));
    }).catch(err => {
        console.log(err)
    });
    res.set('Cache-Control','private, max-age=1800');
    res.marko(template, { title: 'Dropbox', items: entries, thumb:thumbs});
}

function setCookies(resp, token){
    var options = {maxAge : 24*60*60*1000, secure: true, httpOnly:true, domain: dropbox.domain.trim()};
    resp.cookie('datk' , token , options);
    resp.cookie('dropbox',1,{maxAge: 24*60*60*1000,secure:true,domain: dropbox.domain.trim()});
}

function clearCookies(res){
    var options = {maxAge : 1, secure: true, httpOnly:true, domain: dropbox.domain.trim()};
    res.cookie('datk' ,1,options);
    res.cookie('dropbox',1,options);
}

function getPath(req,prevname,currentname){
    if(req === undefined) return;
    var refererUrl = req.headers['referer'] !== undefined ? req.headers['referer'] : "";
    return { prev:{id:refererUrl.length > 0 ? refererUrl.split(req.headers.host)[1] : refererUrl ,name:prevname },base:req.baseUrl,url:req.url,originalUrl:{ id:req.originalUrl,name:currentname } };
}

function fetchAuth(data){
    if(data == null) return;
    var jres = JSON.parse(data);
    dropbox.auth.access_token = jres.access_token != null ? jres.access_token : null;
};

function getThumbnailPromise(token, rev, size){
    return new Promise((resolve, reject) => {
        getThumbnail(token, rev, size,function(status, obj){
            if (status === 200) {
                resolve(obj.toString('base64'));
            } else {
                reject(new Error('something went wrong'));
            }
        })
    });
}
function getChildrenPromise(token, path, filters){
    return new Promise((resolve, reject) => {
        getChildren(token, path, filters,function(status, obj){
            if (status === 200) {
                resolve(obj);
            } else {
                reject(new Error('something went wrong'));
            }
        })
    });
}
function getChildren(token, path, filters, success){
    var data = JSON.stringify({path: path.length > 0 ? "/" + path : "" ,include_media_info:true});
    var header = {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Cache-Control': 'private, max-age=259,200',
        'Connection':'keep-alive'
    };

    var option = {
        host : dropbox.auth.api,
        path : '/2/files/list_folder',
        method: 'POST',
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
    }); req.write(data); req.end();
}

function getTempLink(token, path, success){
    var data = JSON.stringify({path: "/" + path});
    var header = {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept':'application/json',
        'Authorization': 'Bearer ' + token,
        'Cache-Control': 'private, max-age=259,200',
        'Connection':'keep-alive'
    };

    var option = {
        host : 'api.dropboxapi.com',
        path : '/2/files/get_temporary_link',
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    
    var req = https.request(option,function(response){
        response.setEncoding('utf-8');
        var responseString = '';
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString += data});
        response.on('end', function () {
            success(response.statusCode,responseString);
        });
    }); req.write(data);req.end();
}

function getPreview(token, rev, success){
    var data = JSON.stringify({path:"rev:" + rev});
    var header = {
        'Authorization': 'Bearer ' + token,
        'Accept':'application/pdf',
        'Dropbox-API-Arg':data,
        'Cache-Control': 'private, max-age=259,200',
        //'If-None-Match':'',
        'Connection':'keep-alive'
    };

    var option = {
        host : 'content.dropboxapi.com',
        path : '/2/files/get_preview',
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    
    var req = https.request(option,function(response){
        var responseString = [];
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString.push(data)});
        response.on('end', function () {
            var body = Buffer.concat(responseString);
            success(response.statusCode,JSON.stringify({etag:response.headers.etag,metadata:response.headers["dropbox-api-result"]}),body.toString('base64'));
        });
    }); req.end();
}
function getThumbnail(token, rev, size, success){
    var data = JSON.stringify({path:"rev:" + rev , size:size});
    var header = {
        'Authorization': 'Bearer ' + token,
        'Accept':'application/octet-stream',
        'Dropbox-API-Arg':data,
        'Cache-Control': 'private, max-age=259,200',
        //'If-None-Match':'',
        'Connection':'keep-alive'
    };

    var option = {
        host : 'content.dropboxapi.com',
        path : '/2/files/get_thumbnail',
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    
    var req = https.request(option,function(response){
        var responseString = [];
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString.push(data)});
        response.on('end', function () {
            var body = Buffer.concat(responseString);
            success(response.statusCode,body);
        });
    }); req.end();
}

function downLoad(token, rev, success){
    var data = JSON.stringify({path:"rev:" + rev});
    var header = {
        'Authorization': 'Bearer ' + token,
        'Accept':'application/octet-stream',
        'Dropbox-API-Arg':data,
        //'If-None-Match':'',
        'Connection':'keep-alive'
    };

    var option = {
        host : 'content.dropboxapi.com',
        path : '/2/files/download',
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    
    var req = https.request(option,function(response){
        var responseString = [];
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString.push(data)});
        response.on('end', function () {
            var body = Buffer.concat(responseString);
            success(response.statusCode,body);
        });
    }); req.end();
}

function createFolder(token, path, success){
    var data = JSON.stringify({path:"/" + path, autorename:true});
    var header = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json;charset=utf-8',
        'Accept':'application/json',
        'Cache-Control': 'no-cache'
    };

    var option = {
        host : 'api.dropboxapi.com',
        path : '/2/files/create_folder',
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };
    
    var req = https.request(option,function(response){
        var responseString = '';
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString += data});
        response.on('end', function () {
            success(response.statusCode, responseString);
        });
    }); req.write(data); req.end();
}

function getToken(code, host, path,cID, cSKey, domain, success) {
    var data = 'grant_type=authorization_code&code='+ code +'&client_id=' + cID + '&client_secret=' + cSKey +  '&redirect_uri=https://' + domain + '/dropbox/auth';
    
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
            success(response.statusCode,responseString)
            responseString = '';
        });
    });reqPost.write(data);reqPost.end();
}

function getSpaceUsage(token, success) {
    var header = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Cache-Control': 'no-cache',
        'Connection':'keep-alive'
    };

    //POST option
    var option = {
        host : 'api.dropboxapi.com',
        path : '/2/users/get_space_usage',
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };

    var req = https.request(option,function(response){
        response.setEncoding('utf-8');
        var responseString = ''
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('data', function (data) {responseString += data});
        response.on('end', function () {
            success(response.statusCode,responseString)
        });
    });req.write("null");req.end();
}

function logOff(token, success) {
    var header = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + token
    };

    //POST option
    var option = {
        host : 'api.dropboxapi.com',
        path : '/2/auth/token/revoke',
        method: 'POST',
        port:null,
        agent:false,
        gzip:true,
        headers: header
    };

    var reqPost = https.request(option,function(response){
        response.on('error', function(e) {console.log(response.statusCode);});
        response.on('end', function () {
            success(response.statusCode)
        });
    });reqPost.end();
}

function searchFiles(){};

function upLoad(){};


function createSharedLink(){};

function getSharedFiles(){};

function moveFile(){};

function copyFile(){};

function updateFile(){};

function deleteFiles(){};

module.exports = router
