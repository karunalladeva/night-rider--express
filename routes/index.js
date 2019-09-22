var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home')

/* GET home page. */
router.get('/', homeController.getHome);

module.exports = router;
