"use strict";
var User = (function () {
    // get ID():number{
    //     return this.id;
    // }
    // set ID(newid:number){
    //     this.id = newid;
    // }
    function User(person) {
        this.person = person;
        this.name = person.firstname + " " + person.lastname;
    }
    User.prototype.ID = function (id) {
        if (id == null)
            return this.id;
        this.id = id;
    };
    return User;
}());
exports.user = User;
