//var db = require('../db')
var crypto = require("crypto"), 
domain = 'preview.mydrives.cloud',
client_id = '',
client_secret = '';
    
if(process.env.node_env != "PRODUCTION"){domain = 'nodeproj-neunygph.c9users.io';}

// =  this way to create new Client object on inherited page
var Client = function(){
    this.domain = domain;
    this.ID = client_id,
    this.pass = client_secret,
    this.auth = authDetail;
}
var authDetail = {
    host_:'api.amazon.com',
    path:'/auth/o2/token',
    authUrl:'https://api.amazon.com/auth/o2/token',
    ClientID: client_id,
    SKey: client_secret,
    access_token:null,
    refresh_token:null,
    logInUri: 'https://www.amazon.com/ap/oa?client_id=' + client_id + '&scope=clouddrive%3Aread_all%20clouddrive%3Awrite&response_type=code&redirect_uri=https://' + domain + '/amazon/auth'
}

Client.prototype.active = {}
Client.prototype.data = {}

module.exports = Client;
