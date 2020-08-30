// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");
const crypto = require("crypto");
const { composeWithMongoose } = require('graphql-compose-mongoose');
const commonHelper = require('../helpers/commonHelper');

var ObjectId = mongoose.Schema.Types.ObjectId;
var uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false);
//create schemaOptions
var schemaOptions = {
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
    }
  }
  , toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
    }
  }
};

/**
 * User schema
 */
const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    trim: true
  },
  country_code: String,
  phone: String,
  otpcode: Number,
  zipcode: String,
  device_id: String,
  fb_id: String,
  twitter_id: String,
  email: {
    type: String,
  },
  password: {
    type: String
  },
  salt: {
    type: String,
  },
  profile_picture: String,
  timezone: String,
  currency: String,
  verify_code: String,
  phone_verify: Number,
  last_verified: Date,
  created_at: Date,
  updated_at: Date,
  last_login: Date,
  fcm: String,
  /*location schema*/
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    }
  },
  /* For reset password */
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  totalGames: {
    type: Number,
    default: 0,
  },
  totalWonGames: {
    type: Number,
    default: 0
  },
  maxBId: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalSpend: {
    type: Number,
    default: 0
  },
  isFavUser: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: 0,
  }
}, schemaOptions);

// on every save, add the date
userSchema.pre('save', function (next) {
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

userSchema.post('save', async function (user, next) {
  user.token = user && user.get('device_id') ? await commonHelper.jwtgen(user, { issuer: user.get('device_id') }) : '';
  next();
});

userSchema.plugin(uniqueValidator);
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);
const UserTC = composeWithMongoose(User)

module.exports = {
  User,
  UserTC
}