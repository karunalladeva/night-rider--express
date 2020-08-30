// grab the things we need
const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose');

//create schemaOptions
var schemaOptions = {
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
      }
    }
    ,toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
      }
    }
};

/**
 * User schema
 */
const OtpSchema = mongoose.Schema({
    country_code: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    otpcode: Number,
    device_id: { 
        type: String, 
        required: false 
    },
    verify_code: String,
    phone_verify: Number,
    last_verified: Date,
    created_at: Date,
    updated_at: Date,
    status: String,
    isUser: {
        type: Boolean,
        default: true,
        required: true
    }
}, schemaOptions);

const Otp = mongoose.model('Otp',OtpSchema);
const OtpTC = composeWithMongoose(Otp)

module.exports = { 
    Otp,
    OtpTC
}