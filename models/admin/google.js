var crypto = require("crypto"),
    domain = 'preview.mydrives.cloud',
    client_id = '',
    client_secret = '',
    api_key = '',
    service_key = '',
    secret = crypto.createHash('md5').update('I love su shi').digest("hex")
    
if(process.env.node_env != "PRODUCTION"){domain = 'nodeproj-neunygph.c9users.io';}

//declare this way to create new Client object on inherited page
var Client = function(){
    this.domain = domain;
    this.ID = client_id;
    this.secret = client_secret;
    this.api_key = api_key;
    this.auth = authDetail;
}

var authDetail = {
    host_:'www.googleapis.com',
    accountUri:'accounts.google.com',
    tokenpath:'/oauth2/v4/token',
    ClientID: client_id,
    SKey: client_secret,
    access_token:null,
    refresh_token:null,
    logOutUri: 'https://accounts.google.com/o/oauth2/revoke?token=',
    logInUri:'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + client_id + '&scope=https://www.googleapis.com/auth/drive.readonly&response_type=code&redirect_uri=https://' + domain + '/google/auth&access_type=offline'
    //switch /auth/drive.readonly to /auth/drive for read and write access
    //logInUri:'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + client_id + '&scope=https://www.googleapis.com/auth/drive&response_type=code&prompt=consent&redirect_uri=https://' + domain + '/google/auth&access_type=offline'
}

Client.prototype.active = {}
Client.prototype.data = {}

module.exports = Client;
