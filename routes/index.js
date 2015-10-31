var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var post = mongoose.model('post');


/* GET home page. */
router.get('/', function (req, res, next) {

    post.find(function (err, posts) {
        if (err) {
            return console.error(err);
        } else if (posts) {
            res.render('index', {title: 'Express', subTitle: 'Express', posts: posts});
        } else {
            res.render('index', {title: 'Express', subTitle: 'Express', posts: null})
        }
    });

});


module.exports = router;
