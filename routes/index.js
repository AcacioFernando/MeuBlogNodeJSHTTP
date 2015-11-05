var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../db');
var comments = mongoose.model('comment');
var post = mongoose.model('post');
var db = require('../db');
var comments = mongoose.model('comment');

/* GET home page. */
router.get('/', function (req, res) {
    console.log("Index");
    var query = post.find().limit(5);
    query.exec(function (err, posts) {
        if (err) {
            return console.error(err);
        } else if (posts.length != []) {
            var tamanho = posts.length;
            res.render('index', {title: 'Express', subTitle: 'Express', posts: posts, tamanho: tamanho});
        } else {
            res.render('index', {title: 'Express', subTitle: 'Express', posts: null, tamanho: 0})
        }
    });

});

router.get('/categorias/:categoria', function (req, res) {
    console.log('Categoria');
    var categoria = req.params.categoria;
    console.log(categoria);
    post.find({
            category: categoria
        },
        function (err, posts) {
            console.log(posts);
            if (err) {
                return console.error(err);
            } else if (posts.length != []) {
                var tamanho = posts.length;
                console.log(tamanho);
                res.render('index', {title: 'Express', subTitle: 'Express', posts: posts, tamanho: tamanho});
            } else {
                res.render('index', {title: 'Express', subTitle: 'Express', posts: null, tamanho: 0})
            }
        });

});

router.post('/buscar', function (req, res) {
    console.log("buscar");
    var srch = req.body.srch_term;
    console.log(new RegExp(srch));
    post.find({
            content: new RegExp(srch)
        },
        function (err, posts) {
            if (err) {
                console.log(posts);
                return console.error(err);
            } else if (posts.length != []) {
                var tamanho = posts.length;
                res.render('index', {title: 'Express', subTitle: 'Express', posts: posts, tamanho: tamanho});
            } else {
                console.log(posts);
                res.render('index', {title: 'Express', subTitle: 'Express', posts: null, tamanho: 0})
            }
        });
});
router.post('/gostei/:id/:title', function (req, res) {
    var id = req.params.id;
    console.log(id);
    post.findOne({_id: id}, function(err, post){
        console.log(post);
        if(!err) {
            var number_gostei = post.gostei + 1;
            post.gostei = number_gostei;
            post.save();
            console.log('Gostei ' + post.title + ' atualizado para ' + number_gostei);
            res.redirect('/');
        }else{
            console.log('Erro ao cadastrar o gostei ' + post.title);
            res.redirect('/');
        }
    });



    /*
    var query = post.find().limit(5);
    query.exec(function (err, posts) {
        if (err) {
            return console.error(err);
        } else if (posts.length != []) {
            var tamanho = posts.length;
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
    */
});

router.post('/nao_gostei/:id/:title', function (req, res) {
    var id = req.params.id;
    console.log(id);
    post.findOne({_id: id}, function(err, post){
        console.log(post);
        if(!err) {
            var number_gostei = post.nao_gostei + 1;
            post.nao_gostei = number_gostei;
            post.save();
            console.log('Não gostei ' + post.title + ' atualizado para ' + number_gostei);
            res.redirect('/');
        }else{
            console.log('Erro ao cadastrar o não gostei ' + post.title);
            res.redirect('/');
        }
    });
   /* var query = post.find().limit(5);
    query.exec(function (err, posts) {
        if (err) {
            return console.error(err);
        } else if (posts.length != []) {
            var tamanho = posts.length;
            res.render('index', {title: 'Express', subTitle: 'Express', posts: posts, tamanho: tamanho});
        } else {
            res.render('index', {title: 'Express', subTitle: 'Express', posts: null, tamanho: 0})
        }
    });*/
});

router.get('/number_page/:index', function (req, res) {
    console.log("number_page");
    var index = req.params.index;
    console.log(index);
    var prox_post = 5 * index;
    console.log(prox_post);
    var tamanho = post.find().length;
    console.log(tamanho);
    var query = post.find().skip(prox_post).limit(5);
    query.exec(function (err, posts) {
        if (err) {
            console.log(posts);
            return console.error(err);
        } else if (posts.length != []) {
            res.render('index', {title: 'Express', subTitle: 'Express', posts: posts, tamanho: tamanho});
        } else {
            console.log(posts);
            res.render('index', {title: 'Express', subTitle: 'Express', posts: null, tamanho: 0})
        }
    });
});

module.exports = router;
