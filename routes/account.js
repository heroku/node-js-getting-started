var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

router.get('/', (req, res, next) => {
    // 登録したら一覧に戻る
    res.redirect('/account/list');
});

router.get('/new', (req, res, next) => {
    res.render('account');
});

router.post('/save', async(req, res, next) => {
    // 登録内容をフォームから引っこ抜く
    const name = req.body.name;
    const phone = req.body.phone;
    const fax = req.body.fax;
    const accountUUID = req.body.accountUUID;

    // 取引先を新規登録する
    const client = await pool.connect();
    const insertData = {
        text: 'insert into salesforce.account (name, phone, fax, accountuuid__c) values ($1, $2, $3, $4)',
        values: [name, phone, fax, accountUUID],
    }
    const result = await client.query(insertData);
    client.release();

    // 登録したら一覧に戻る
    res.redirect('/account/list');
});

router.get('/list', async(req, res, next) => {
    const client = await pool.connect();
    const result = await client.query('select * from salesforce.account order by id DESC');
    const results = { 'results': (result) ? result.rows : null};
    client.release();

    res.render('accountList', results);
});

module.exports = router;

