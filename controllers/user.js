
const { User, UserTC } = require('../models/user');
const { Otp, OtpTC } = require('../models/otp');
const { fileTC } = require('../helpers/imageTC');

//image upload
const  { GraphQLUpload } = require('apollo-upload-server');
UserTC.schemaComposer.add(GraphQLUpload)

//helpers
const commonHelper = require('../helpers/commonHelper');
const { pubsub, withFilter } = require('../pubsub')
const moment = require("moment-timezone");
const fs = require('fs');
var md5 = require('md5');

const env = process.env

UserTC.addFields({
    token: 'String',
    type: 'String',
    msg: 'String,'
})

OtpTC.addFields({
    token: 'String',
    type: 'String',
    msg: 'String,'
})

/**
 * Sent Otp
 */
UserTC.addResolver({
    name: 'sent_otp',
    type: OtpTC,
    args: { country_code: 'String', phone: 'String',isUser: 'Boolean!' },
    resolve: async ({ source, args, context, info }) => {
        if(!args.country_code && !args.phone)
            throw new Error('Forbidden!');

        let checkUser=await Otp.findOne({phone:args.phone,isUser:args.isUser}),
            otp= Math.floor(1000 + Math.random() * 9000);
        
        if(checkUser){
            let verify_code=checkUser.verify_code,
	            last_verified=moment(checkUser.last_verified),
                current_time=moment(),
                difference = current_time.diff(last_verified, 'minutes'); // find minutes difference from now and last verifed
            if(difference<=15)
            {
                otp=verify_code;
                var smsMessage=otp+" is your "+env.APP_NAME+ " OTP to login";
                commonHelper.sendSms("+"+args.country_code+""+args.phone,smsMessage);
                checkUser.msg = "Otp sent."
                return checkUser;
            } else {
                var smsMessage=otp+" is your "+env.APP_NAME+ " OTP to login";
                commonHelper.sendSms("+"+args.country_code+""+args.phone,smsMessage);
                Otp.findById(checkUser._id, function (err, userDetails) {
                    userDetails.verify_code=otp;
                    userDetails.last_verified=current_time;
                    userDetails.save();
                    userDetails.msg = "Otp sent."
                    return userDetails;
                });
            }
        } else {
            let smsMessage=otp+" is your "+env.APP_NAME+ " OTP to login";
            commonHelper.sendSms("+"+args.country_code+""+args.phone,smsMessage);
            // create a new user called newUser
            let newUser = await new Otp({
                verify_code: otp,
                last_verified: moment(),
                phone: args.phone,
                country_code: args.country_code,
                isUser: args.isUser,
            });
            newUser.save();
            newUser.msg = "Otp sent."
            return newUser;
        }
    }
})

/**
 * Verify Otp
 */
UserTC.addResolver({
    name: 'verify_otp',
    type: OtpTC,
    args: { country_code: 'String!', phone: 'String!', verify_code: 'String!', fcm: 'String!', isUser: 'Boolean!', deviceid: 'String!' },
    resolve: async ({ source, args, context, info }) => {
        if(!args.country_code && !args.phone && !args.verify_code)
            throw new Error('Forbidden!');

            let checkUser = await Otp.findOne({phone:args.phone, country_code:args.country_code, verify_code:args.verify_code, isUser: args.isUser});
            if(checkUser) {
                args.phone_verify=1;
                let user = await Otp.findOneAndUpdate({ "_id": checkUser._id }, { "$set": args});                
                let UserData = await User.findOne({phone:args.phone, country_code:args.country_code, isUser: args.isUser});
                user.token = UserData && UserData.get("id") ? await commonHelper.jwtgen(UserData,{issuer: args.deviceid}) : '';
                user.type = UserData && UserData.get("id") ? "oldUser": "newUser";
                user._id = UserData && UserData.get("id") ? UserData.get("id") : 0;
                user.msg = "User verified."
                return user;
            }
            else {
                throw new Error('Incorrect code')
            }
    }
})

/**
 * Forgot Password
 */
UserTC.addResolver({
    name: 'forgot_password',
    type: UserTC,
    args: { country_code: 'String', phone: 'String', email: 'String', isUser: 'Boolean!', deviceid: 'String!' },
    resolve: async ({ source, args, context, info }) => {
        if(!args.isUser && !args.deviceid)
            throw new Error('Forbidden!');
        pubsub.publish('aliveUpdate',{
            _id : "5f09b6a636f5050f64d92fc2",
            isOnline: true,
            location: ["0","0"]
        })
        return {msg: "If email is right, you got an email."}
    }
})

/**
 * Login
 */
UserTC.addResolver({
    name: 'login',
    type: UserTC,
    args: {email: 'String', mobile: 'String', password: 'String', fcm: 'String!', deviceid: 'String!'},
    resolve: async ({ source, args, context, info }) => {
        if((!args.email || !args.mobile) && !args.password)
            throw new Error('Forbidden!');

        const payload = { email: args.email , password: md5(args.password) }
        const current_time=moment();
        const userDetails = await User.findOne(payload)
        if(userDetails){
            userDetails.last_verified=current_time;
            await userDetails.save();
            userDetails.token = await commonHelper.jwtgen(userDetails,{issuer: args.deviceid})
            userDetails.msg = "Logged in successfully."
            return userDetails;
        } else {
            throw new Error('User not exists!')
        }
    }
})

/**
 * Create User
 */
UserTC.wrapResolverResolve('createOne', next => async rp => {
    // extend resolve params with hook
    rp.beforeRecordMutate = async (doc, resolveParams) => { 
        var checkUser=await User.findOne({ email: doc.email ,isUser: doc.isUser});
        if(checkUser)
            throw new Error('User already exists!')

        doc.password = md5(doc.password)
        doc.msg = "User created successfullty."
        return doc;
    };
    return next(rp);
});

/**
 * Profile upload
 */
UserTC.addResolver({
    name: 'profileUpload',
    type: fileTC,
    args: { file: `Upload!`, id: 'MongoID!'},
    resolve: async ({ __, args }) => {
        const userDetails = await User.findOne({_id:args.id})
        if(userDetails){
            return args.file.then( async file => {
                const {createReadStream, filename, mimetype} = file
                const fileStream = await createReadStream()
                await fileStream.pipe(fs.createWriteStream(`./public/uploads/profile/${filename}`));
                await User.findOneAndUpdate({ _id: args.id }, { "$set": { 'profile_picture': filename } }, { new: true });
                return file;
            });
        } else {
            throw new Error('User not found!');
        }
    }
})

module.exports = {
    User,
    UserTC
}