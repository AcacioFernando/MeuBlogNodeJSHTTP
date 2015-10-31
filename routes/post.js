
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var commentss = mongoose.model('comment');
var post = mongoose.model('post');

router.post('/:id/:title', function (req, res, next) {
    console.log("Salvar comentários");
    id = req.params.id;
    title_sub = req.params.title;
    name = req.body.name || 'anon';
    comment = req.body.comment || 'Nothing';
    console.log(name + ' said ' + comment);
    console.log(id);

    var date = new Date();
    //specific time
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    //date
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();


    //organize time so it looks nice
    var time = month + '/' + day + '/' + year + ' at ' + hours + ':' + minutes + ':' + seconds;


    //Submitting to database
    var newComment = commentss({
        postid: id,
        title_sub: title_sub,
        name: name,
        comment: comment,
        date: time
    });
    newComment.save();

    //redirecting to homepage
    res.redirect('/post/' + id + '/' + title_sub);

});

router.get('/:id/:title', function (req, res, next) {
    console.log("Post");
    id = req.params.id;
    post.find({'_id': id}, function (err, post) {
        if (post) {
            commentss.find({'postid': id}, function (err, comment) {
                if (comment) {
                    res.render('post_view', {title: 'title', subTitle: 'title', post: post, comment: comment})
                } else {
                    res.render('post_view', {title: 'title', subTitle: 'title', post: post, comment: null})
                }
            });

        } else {
            res.render('post_view', {title: title, subTitle: subTitle, post: null, comment: null})
        }
    });

});


module.exports = router;