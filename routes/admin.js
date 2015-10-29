/**
 * Created by Acácio Oliveira on 27/10/2015.
 */


//Prerequisites
var date = new Date();
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../db');
var post = mongoose.model('post');
var formidable = require('formidable');
var fs = require('fs');

router.get('/', function (req, res, next) {
    console.log("admin_login");
    res.render('admin_login');
});

router.get('/admin_login', function (req, res, next) {
    console.log("admin_login");
    res.render('admin_login');
});

router.post('/', function (req, res, next) {

    var password1 = req.body.password;
    var password2 = req.body.passwordconfirm;
    console.log('passed');
    console.log(password1);
    console.log(password2);

    if (password1 == 123) {
        console.log('password1 é password')
        if (password1 == password2) {
            console.log('password1 é password2')
            //  req.session.admin = 'true';
            res.redirect('/admin/novoPost')
        } else {

            error = 'Passwords não confere';
            console.log(error)
            res.redirect('/admin')
        }
    } else {
        error = 'Wrong Password';
        console.log(error)
        res.redirect('/admin');
    }

});

router.get('/novoPost', function (req, res, next) {
    console.log("novoPost");

    post.find(function (err, posts) {
        if (err) {
            return console.error(err);
        } else if (posts) {
            res.render('admin', {title: 'title', subTitle: 'title', posts: posts});
        } else {
            res.render('admin', {title: 'title', subTitle: 'title', posts: null})
        }
    });
});


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


router.post('/novoPost', function (req, res, next) {

    console.log("salvarPost");

    //specific time
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    //date
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();

    //organize time so it looks nice
    var time = month + '/' + day + '/' + year + " at " + formatAMPM(date);
    var title = req.body.title;
    var title_sub = title.split(' ').join('-');

    var body = req.body.body;

    /*
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var img = files.imgPost;
        console.log(img);
        fs.readFile(img.path, function (err, data) {
            post.create({
                title: title,
                title_sub: title_sub,
                content: body,
                date: time,
                img: data
            }, function (err, user) {
                if (err) {
                    error = err;
                    //redirecting to homepage
                    res.redirect('/');
                }
                if (user) {
                    error = null;
                    res.redirect('/#dashboard');
                }
            });

        });
    });

  */  //Submitting to database
    var newPost = post({
        title: title,
        title_sub: title_sub,
        content: body,
        date: time
    });
    newPost.save();

    //redirecting to homepage
    res.redirect('/');



});

//deleting posts functions
router.get('/deletePost', function (req, res, next) {
    console.log("admin_delete");

    post.find(function (err, posts) {
        if (err) {
            return console.error(err);
        } else if (posts) {
            res.render('admin_delete', {title: "title", subTitle: "title", posts: posts});
        } else {
            res.render('admin_delete', {title: "title", subTitle: "title", posts: null})
        }
    });
});

router.post('/deletePost', function (req, res, next) {
    console.log("deltarPost");
    var title1 = req.body.title;
    var time = req.body.time;
    console.log(title);
    post.findOne({"title": title1, "date": time}, function (err, match) {
        console.log(match);
        if (match) {
            match.remove()
            console.log('removed');
            res.redirect('/deletePost');
        } else {
            console.log('Error');
            res.redirect('/')
        }
    });

});

module.exports = router;


exports.admin_edit = function (req, res) {

    post.findOne({_id: req.params.id}, function (err, post) {
        if (post) {
            res.render('admin_edit', {title: title, subTitle: subTitle, post: post})
        } else {
            res.redirect('/admin')
        }
    });
};
exports.admin_edit_post_handler = function (req, res) {
    body = req.body.body;
    title1 = req.body.title;

    post.findOne({title: title1}, function (err, post) {
        post.content = body;
        post.save();
        console.log('edited post complete');
        res.redirect('/');
    })
}

//admin check functions
exports.admin_check_post_handler = function (req, res) {
    var password1 = req.body.password;
    var password2 = req.body.passwordconfirm;
    console.log('passed');
    console.log(password1);
    console.log(password2);
    if (password1 == 123) {
        console.log('password1 is password');
        if (password1 == password2) {
            console.log('password1 is password2');
            //  req.session.admin = 'true';
            res.redirect('/admin/new')
        } else {

            error = 'Passwords do not match';
            console.log(error);
            res.redirect('/admin')
        }
    } else {
        error = 'Wrong Password';
        console.log(error);
        res.redirect('/admin');
    }
};

