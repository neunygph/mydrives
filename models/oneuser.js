var User = function(){
    this.folder = new Folder();
    this.file = new File();
    this.isActive = this.active;
}

var Folder = function(uri){
    this.id = null,
    this.name = null,
    this.eTag = null,
    this.cTag = null,   
    this.createdBy = null,
    this.createdDateTime = null,
    this.lastModifiedBy = null,
    this.lastModifiedDateTime = null,
    this.size = null,
    this.webUrl = null,
    this.parentReference = null,
    this.folder
}

var File = function(){
    this.id = null,
    this.name = null,
    this.eTag = null,
    this.cTag = null,   
    this.createdBy = null,
    this.createdDateTime = null,
    this.lastModifiedBy = null,
    this.lastModifiedDateTime = null,
    this.size = null,
    this.webUrl = null,
    this.parentReference = null,
    this.folder
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
