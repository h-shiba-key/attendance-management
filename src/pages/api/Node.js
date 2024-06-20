import mysql from "mysql";

//MySQLパッケージをロードする
const mysql = require('mysql');

//MySQLデータベースに接続するための接続情報を設定する
const connection=mysql.createConnection({
    host:'localhost', //データベースのホスト名
    user:'employee', //データベースのユーザー名 、'ユーザー名'
    password:'test1234', //データベースのパスワード、'パスワード'
    database: 'workly'//使用するデータベース名、'データベース名'
})

const user = {};

connection.connect((err)=>{
  if(err)throw err;
  console.log('データベースに接続しました。');
});

connection.connect();
const query = connection.query(
  'INSERT INTO users SET ?',user,
  'SELECT * FROM users',
  'UPDATE users SET ? WHERE ?',[newData, condition],
  'DELETE FROM users WHERE ?',condition,
  (err, results) => {
  if (err) throw err;
  console.log('データが挿入されました。');
  console.log('データの取得結果：', results);
  console.log('データが更新されました。');
  console.log('データが削除されました。');
});

// サーバーを指定のポートで起動します
const PORT = process.env.PORT || 3306;
server.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});