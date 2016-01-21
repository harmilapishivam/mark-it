var dbModels = require('../model/db-models');
var userModel = dbModels.getDbSchema(dbModels.User, 'userModel', 'user.account');
var session = require('express-session');


exports.saveUser = function(user, callback) {

    if (!user) callback(null, user);

    userModel.findOne({
        'Strategy.Info.Id': user.Id
    }, function(err, response) {
        if (err) callback(err, null);
        if (!response) {
            var dbUser = new userModel();
            dbUser.Strategy = {
                Name: user.provider,
                Info: {
                    Id: user.Id,
                    DisplayName: user.DisplayName,
                    Email: user.Email,
                    ProfilePicUrl: user.ProfilePicUrl
                }
            };
            dbUser.save(function(err, dbResponse) {
                if (err)
                    callback(err, dbResponse);
                callback(null, dbResponse);
            });
        } else {
            callback(err, response);
        }
    });
}

exports.getUser = function(id, callback) {

    if (!id) callback(null, user);

    userModel.findOne({
        '_id': id
    }, function(err, response) {
        if (err) callback(err, null);
        callback(null, response);
    });
}
