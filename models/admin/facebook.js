//var db = require('../db')
var domain = 'preview.mydrives.cloud',
    client_id = '',
    client_secret = ''

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
    host_:'graph.facebook.com',
    api:'api.onedrive.com',
    authpath:'',
    tokenpath:'',
    ClientID: client_id,
    SKey: client_secret,
    access_token:null,
    app_token:null,
    user_id:null,
    logOutUri:'https://graph.facebook.com/{user-id}/permissions/{permission-name}',
    logInUri:'https://www.facebook.com/v2.8/dialog/oauth?client_id=' + client_id + '&state=9582&scope=user_photos,user_videos,user_posts&response_type=code&redirect_uri=https://' + domain + '/facebook/auth'
    //Revoking Login call graph api//DELETE /{user-id}/permissions
    //Revoking Permissions : DELETE /{user-id}/permissions/{permission-name}
    //retrieve a list of granted permissions:GET /{user-id}/permissions
}

Client.prototype.active = {}
Client.prototype.data = {}

module.exports = Client;
