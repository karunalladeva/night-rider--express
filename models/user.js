var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true, 
            max: 50 
        },
        password: { 
            type: String 
        },
        slat: { 
            type: String 
        },
        email: {
            type: String,
            validate: {
                isAsync: true,
                validator: function (data, cb) {
                    setTimeout(function () {
                        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        var msg = data + ' is not a valid email!';
                        cb(emailRegex.test(String(data).toLowerCase()), msg);
                    }, 5);
                },
                message: 'Email is not valid'
            }
        },
        status: { type: Boolean, default: false },
    }
);

/**
 * Virtual for this author instance URL.
 */
UserSchema
    .virtual('id')
    .get(function () {
        return this._id
    });

// Export model.
module.exports = mongoose.model('User', UserSchema);