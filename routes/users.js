var express = require('express');
var router = express.Router();
var userController = require('../controllers/user')

/* GET users listing. */
router.get('/:email', userController.getUser);

/* POST users data */
router.post('/', userController.addUser);

module.exports = router;
