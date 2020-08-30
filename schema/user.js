const { 
    User, 
    UserTC
} = require('../controllers/user');

const UserQuery = {
    login: UserTC.getResolver('login'),
    sentOtp: UserTC.getResolver('sent_otp'),
    verifyOtp: UserTC.getResolver('verify_otp'),
    forgotPassword: UserTC.getResolver('forgot_password'),
    userById: UserTC.getResolver('findById'),
    userMany: UserTC.getResolver('findMany'),
    userCount: UserTC.getResolver('count'),
    userPagination: UserTC.getResolver('pagination'),
};

const UserMutation = {
    register: UserTC.getResolver('createOne'),
    userUpdateOne: UserTC.getResolver('updateOne'),
    userRemoveById: UserTC.getResolver('removeById'),
    userRemoveMany: UserTC.getResolver('removeMany'),
    profileUpload: UserTC.getResolver('profileUpload')
};

module.exports = { UserQuery, UserMutation };