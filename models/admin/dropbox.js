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
    host_:'api.dropboxapi.com',
    api:'api.dropboxapi.com',
    authpath:'/oauth2/authorize',
    path:'/oauth2/token',
    ClientID: client_id,
    SKey: client_secret,
    access_token:null,
    logOutUri:'https://api.dropboxapi.com/2/auth/token/revoke',
    logInUri:'https://www.dropbox.com/oauth2/authorize?client_id=' + client_id + '&response_type=code&require_role=personal&state=9582&redirect_uri=https://' + domain + '/dropbox/auth'
}

Client.prototype.active = {}
Client.prototype.data = {}

module.exports = Client;
