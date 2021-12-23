var express = require('express');
var ejs = require("ejs");
  
var app = express();
app.engine('ejs',ejs.renderFile);
app.use(express.static('public'));


var data = {
    'Taro':'taro@yamada',
    'Hanako':'hanako@flower',
    'Sachiko':'sachico@happy',
    'Ichiro':'ichiro@baseball',
};


app.get('/',(req, res) => {
    var msg = 'This is Index Page!<br>' 
        + '※データを表示します。';
    res.render('index.ejs', 
        {
            title: 'Index', 
            content: msg, 
            data:data,
        });
});


var server = app.listen(3000,() => {
    console.log('Server is running!');
})


