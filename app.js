app.js

var express = require('express');
var bodyParser = require('body-parser');

// express の実態 Application を生成
var app = express();
app.set('port', process.env.PORT || 3000);

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// テンプレートエンジンを EJS に設定
app.set('views', './views');
app.set('view engine', 'ejs');

// 静的ファイルは無条件に公開
app.use('/public', express.static('public'));

// ルーティング設定
app.use('/', require('./routes/account.js'));
app.use('/account', require('./routes/account.js'));

// アプリケーション開始ログ
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
