var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;

// expressインスタンス生成
const app = express();
module.exports = app;

// テンプレートエンジンの設定
app.set("views", "./views");
app.set("view engine", "ejs");
 
// ミドルウエアの設定
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ルーティング設定
app.get('/', function (req, res) {
  res.send('hello world')
})

app.get("/shops", (function (req, res) {
  const router = express.Router();
  res.send('hello')
  router.get("/search", function (req, res) {
    var Url = "mongodb://localhost:27017/shoptest";
    var MAX_ITEMS_PER_PAGE = 0;
    var query = req.query.q;
    var page =req.query.pg ? parseInt(req.query.pg) : 1;
 
    // 検索クエリがない場合、初期表示
    if (!query) {
      return res.render("../search/index.ejs");
    }
 
    // 検索クエリがある場合、データベースを検索して結果リストを表示
    MongoClient.connect(Url, function (err, client){
        const db = client.db("shoptest");
        if (err) {
            throw err;
        } 

      return Promise.all([
        // 検索総ヒット数
        db.collection("shops").find({
          name: new RegExp(`.*${query}.*`)
        }).count(),
        // 現在ページに表示する内容
        db.collection("shops").find({
          name: new RegExp(`.*${query}.*`)
        }).skip((page - 1) * MAX_ITEMS_PER_PAGE).limit(MAX_ITEMS_PER_PAGE).toArray()
      ]);
    }).then((results) => {
      // ビューへ渡すデータを整形
      var data = {
        count: results[0],
        list: results[1],
        pagination: {
          max: Math.ceil(results[0] / MAX_ITEMS_PER_PAGE),
          current: page,
          isFirst: page === 1,
          isLast: page === Math.ceil(results[0] / MAX_ITEMS_PER_PAGE)
        },
        query: query
      };
      // ビューを表示
      return res.render("../search/result-list.ejs", data);
    }).catch((reason) => {
      // エラー処理
      console.log(reason);
    });
 
  return router;
})}));
 
// サーバー起動
var server = app.listen(3000,() => {
    console.log("Server is running!");
})


