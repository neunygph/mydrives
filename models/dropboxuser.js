var User = function(){
    this.mdUrl = null;
    this.ctUrl = null;
    this.folders = new Folder(this.mdUrl);
    this.files = new File();
    this.isActive = this.active;
}

var Folder = function(uri){
    this.id = null,
    this.name = null,
    this.labels = null,
    this.createdDate = null,
    this.modifiedDate = null,
    this.metadata = null,
    this.parent = null,
    this.root = null,
    this.status = null,
    this.restricted = null,
    this.api = new fldAPI(uri,this.id)
}

var File = function(){
    this.id = 99,
    this.name = 'testfilename',
    this.medadata = 'testfilemd',
    this.templink = 'https//testtemp.com'
}

var fldAPI = function(mdUrl, ID) {
    this.create = mdUrl + 'nodes',
    this.get = mdUrl + 'nodes/' + ID, /*Get a folder metadata*/
    this.patch = mdUrl + 'nodes/' + ID,/*Partially update a folder metadata*/
    this.listAllFolders = 'nodes?filters=kind:FOLDER'
}
var API = {  
    Folder: {
        create: User.mdUrl + 'nodes',
        get: User.mdUrl + 'nodes/' + Folder.id, /*Get a folder metadata*/
        patch: User.mdUrl + 'nodes/' + Folder.id,/*Partially update a folder metadata*/
        listAllFolders: User.mdUrl +  'nodes?filters=kind:FOLDER'
       },
    File :  {
        upload: User.ctUrl + 'nodes',
        overwrite: User.ctUrl + 'node/' +  + '/content',
        download: User.ctUrl + 'nodes/' + File.id + '/content', /*Download a file with optional transformations*/
        getTemplink: File.templink,
        get: User.mdUrl + 'nodes/' + File.id,
        patch: User.mdUrl + 'nodes/' + File.id, /*Partially update a files metadata*/
        listAllFiles: User.mdUrl + 'nodes?filters=kind:FILE ',
        listAsset: User.mdUrl + 'nodes?filters=kind:ASSET'
    }
}


User.prototype.active = {}
User.prototype.data = {}

exports.getStatus = function(){
    return User.prototype.active;
}

exports.File = function(){
    return File = new File();
}
module.exports = User;
