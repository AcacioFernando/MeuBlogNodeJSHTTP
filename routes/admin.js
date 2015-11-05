/**
 * Created by Acácio Oliveira on 27/10/2015.
 */


//Prerequisites
var date = new Date();
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var post = mongoose.model('post');
var formidable = require('formidable');
var fs = require('fs');
var db = require('../db');

var sess;

router.get('/', function (req, res, next) {
    console.log('Entrou no admim');
    console.log(req.session.logged);
    if (req.session.logged == true) {
        res.redirect('/admin/novoPost')
    } else {
        console.log("admin_login");
        res.render('admin_login');
    }
});

router.get('/admin_login', function (req, res, next) {
    console.log("admin_login");
    res.render('admin_login');
});

router.post('/', function (req, res, next) {
    sess = req.session;

    var password1 = req.body.password;
    var password2 = req.body.passwordconfirm;
    console.log('passed');
    console.log(password1);
    console.log(password2);

    if (password1 == 123) {
        console.log('password1 é password');
        if (password1 == password2) {
            console.log('password1 é password2');
            req.session.logged = true;
            res.redirect('/admin/novoPost')
        } else {
            req.session.logged = false;
            error = 'Passwords não confere';
            console.log(error);
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

    var error = null;
    //specific time
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    //date
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();
    var time = month + '/' + day + '/' + year + " at " + formatAMPM(date);
    var fstream;
    var form = new formidable.IncomingForm();
    form.type = 'multipart';

    try {
        form.parse(req, function (err, fields, files) {

            console.log(200, {'content-type': 'text/plain'});
            console.log('received upload:\n\n');
            var title_post = fields.title.split(' ').join('-');
            var image = files.imgPost
                , image_upload_path_old = image.path
                , image_upload_path_new = '/images/img_posts/'
                , image_upload_name = image.name.split(' ').join('-')
                , image_name = image_upload_path_new + title_post + image_upload_name
                , image_upload_path_name = './public' + image_upload_path_new + title_post + image_upload_name
                ;

            console.log(image_name);
            post.create({
                title: fields.title,
                title_sub: fields.title.split(' ').join('-'),
                content: fields.body,
                category: fields.categoria,
                sub_title: fields.subtitle,
                date: time,
                img: image_name,
                gostei: Number(0),
                nao_gostei: Number(0)
            }, function (err, user) {
                if (err) {
                    error = err;
                    //redirecting to homepage
                    res.redirect('/erro');
                }
                if (user) {
                    console.log("Sem errro ");
                    // Testa se o diretório upload existe na pasta atual
                    if (fs.existsSync(image_upload_path_new)) {
                        fs.rename(
                            image_upload_path_old,
                            image_upload_path_name,
                            function (err) {
                                if (err) {
                                    error = err;
                                    res.redirect('/erro');
                                }
                                console.log("Upload Finished of " + image_name);
                                error = null;
                                // res.redirect('/novoPost');
                            });
                    } // Se não cria o diretório upload
                    else {
                        fs.mkdir(image_upload_path_new, function (err) {
                            if (err) {
                                error = err;
                                //   res.redirect('/erro');
                            }
                            fs.rename(
                                image_upload_path_old,
                                image_upload_path_name,
                                function (err) {
                                    console.log("Upload Finished of " + image_name);
                                    error = null;
                                    //  res.redirect('/admin/novoPost');         //where to go next
                                });
                        });
                    }

                }
            });


        });
    } catch (err) {
        res.redirect('/erro');
    }

    console.log(error);
    if (error == null) {

        res.redirect('/admin/novoPost');
    } else {
        res.redirect('/erro');
    }
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
    console.log(title1);
    post.findOne({"title": title1, "date": time}, function (err, post) {
        console.log('Achei' + __dirname);
        console.log(post);
        if (post) {

/*
            try {
                var files = fs.readdirSync(__dirname + '/public/images/img_posts/');
                console.log(files);
            }
            catch (e) {
                console.log("Falhou");
                return;
            }
            if (files.length > 0)
                for (var i = 0; i < files.length; i++) {
                    var filePath = __dirname + '/' + files[i];
                    console.log(filePath);
                    if (fs.statSync(filePath).isFile()) {
                        fs.unlinkSync(filePath);
                    }
                }
            fs.rmdirSync(dirPath);


            // fs.unlink(__dirname +'/public/'+ post.img);

            /*  (function next(err, result) {
             if (err) return console.error("error in next()", err);
             if (list_file_to_delete.length === 0) return;
             var filename = list_of_files.splice(0,1)[0];
             console.log(filename);
             fs.unlink(filename, next);
             }());

             exports.deletePhoto = function (req, res) {
             Photos.remove({_id: req.params.id}, function(err, photo) {
             if(err) {
             return res.send({status: "200", response: "fail"});
             }
             fs.unlink(photo.path, function() {
             res.send ({
             status: "200",
             responseType: "string",
             response: "success"
             });
             });
             });
             };

             */

            post.remove();
            console.log('removed');
            res.redirect('/admin/deletePost');
        } else {
            console.log('Error');
            res.redirect('/')
        }
    });

});

router.get('/logout', function (req, res) {
    req.session.logged = false;
    console.log(req.session);
    console.log('logged-out')
    res.redirect('/');
});
module.exports = router;

