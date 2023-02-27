//var db = require('../db')
var crypto = require("crypto"),
    domain = 'preview.mydrives.cloud',
    client_id = '',
    client_secret = '';
    
if(process.env.node_env != "PRODUCTION"){domain = 'nodeproj-neunygph.c9users.io'}

//declare this way to create new Client object on inherited page
var Client = function(){
    this.domain = domain;
    this.ID = client_id;
    this.secret = client_secret;
    this.auth = authDetail;
}

var authDetail = {
    host_:'api.instagram.com',
    api:'api.instagram.com',
    authpath:'/oauth/authorize/',
    tokenpath:'/oauth/access_token',
    ClientID: client_id,
    SKey: client_secret,
    access_token:null,
    refresh_token:null,
    logInUri:'https://api.instagram.com/oauth/authorize/?client_id=' + client_id + '&redirect_uri=https://' + domain + '/instagram/auth&response_type=code&scope=basic+public_content'
    //  +comments+likes+follower_list
}

Client.prototype.active = {}
Client.prototype.data = {}

module.exports = Client;
