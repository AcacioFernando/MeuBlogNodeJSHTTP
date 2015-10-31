//Pre requisitos 
var mongoose = require('mongoose');
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;



var db_url = process.env.MONGOHQ_URL || "mongodb://127.0.0.1:27017/node2blog",
    db = mongoose.connect(db_url);

//  Schema MongoDB para os posts

var postSchema = new Schema({
    id: ObjectId,
    title: { type: String },
    title_sub: { type: String },
    content: { type: String },
    date: { type: String },
    img: {type : Buffer }
});

//  Schema para os comentários
var commentSchema = new Schema({
    id: ObjectId,
    postid: { type: String },
    title_sub: { type: String },
    name: { type: String },
    comment: { type: String },
    date: { type: String }
});


var post = db.model('post', postSchema);
var comment = db.model('comment', commentSchema);










