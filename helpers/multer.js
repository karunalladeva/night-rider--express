const multer  = require('multer');
const moment = require("moment");
const fs = require("fs");

let dir="upload/";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (['rc','insurence','licence'].includes(file.fieldname)) {
            dir = 'public/uploads/documents/'
        }else if(file.fieldname === "profile_picture"){
            dir =  'public/uploads/profile/'
        }else{
            dir =  'public/uploads/'
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + moment(new Date()))
    },
    fileFilter: function (req, file, cb) {
        if (! ['.png','.jpeg'].includes(path.extname(file.originalname))) {
            return cb(new Error('Only pdfs are allowed'))
        }
        cb(null, true)
    }
  })
   
  module.exports = multer({ storage: storage })