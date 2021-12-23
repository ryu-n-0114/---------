var express = require('express');
var ECT = require('ect');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

var app = express();
var ectRenderer = ECT({watch: true, root: __dirname + '/views', ext: '.ect'});

var Url = 'mongodb://localhost:27017/Decdata';

app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');
app.use('/static', express.static('public'));

app.get('/', function (req, res) {
    MongoClient.connect(Url, function (err, client) {
        const db = client.db("Decdata")
        if (err) {
            throw err;
        }   

        var testCollection = db.collection("data_import");

        testCollection.find({}).sort({created: -1}).limit(200).toArray(function (err, docs) {
            client.close();
            res.render('index', {docs: docs});
        }); 
    }); 
}); 

var server = app.listen(3000,() => {
    console.log("Server is running!");
})










/*const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const assert = require('assert') /*引数が渡せているかの確認 */

//mongoへの接続
/*MongoClient.connect('mongodb://localhost:27017/myDB', (err, db) => {
    assert.equal(null, err)
    console.log("Connected successfully to server")
    insertDocuments(db, () => {
        db.close()
    })
})


//データの挿入
const insertDocuments = (db, callback) => {
    const documents = [ 
        {date:'7/20', temp:30, hum:58, sen:'正常'},
        {date:'7/21', temp:29, hum:62, sen:'正常'},
        {date:'7/22', temp:28, hum:65, sen:'正常'},
        {date:'7/23', temp:34, hum:69, sen:'正常'},
        {date:'7/24', temp:31, hum:66, sen:'正常'}
    ];

    // myDBデータベースのdocumentsコレクションに対して
    // ドキュメントを追加
    db.collection('documents').insertMany(documents, (err, result) => {
        // insert結果の確認
        assert.equal(err, null)
        assert.equal(5, result.result.n)
        assert.equal(5, result.ops.length)

        console.log("Inserted 5 documents into the collection")
        callback(result)
    })
}*/

