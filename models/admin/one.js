//var db = require('../db')
var crypto = require("crypto"),
    domain = 'preview.mydrives.cloud',
    client_id = '',
    client_secret = '';
    
if(process.env.node_env != "PRODUCTION"){
    domain = 'nodeproj-neunygph.c9users.io'
    client_id = '',
    client_secret = '';
}

//declare this way to create new Client object on inherited page
var Client = function(){
    this.domain = domain;
    this.ID = client_id;
    this.secret = client_secret;
    this.auth = authDetail;
}

var authDetail = {
    host_:'login.live.com',
    api:'api.onedrive.com',
    authpath:'/oauth20_authorize.srf',
    tokenpath:'/oauth20_token.srf',
    ClientID: client_id,
    SKey: client_secret,
    access_token:null,
    refresh_token:null,
    logOutUri:'https://login.live.com/oauth20_logout.srf?client_id='+ client_id + '&redirect_uri=https://' + domain +'/one/auth',
    logInUri:'https://login.live.com/oauth20_authorize.srf?client_id=' + client_id + '&scope=onedrive.readwrite%20offline_access&response_type=code&redirect_uri=https://' + domain + '/one/auth'
}

Client.prototype.active = {}
Client.prototype.data = {}

module.exports = Client;
