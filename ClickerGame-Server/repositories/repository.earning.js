require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,

    ssl: {
        require: true,
    },
});

pool.connect().then(() => {
    console.log("Connected to PostgreSQL database");
});

async function buyItem(req, res) {
    const {accountId, itemId} = req.body;

    try {

        const accountMoney = await pool.query(
            'SELECT * FROM account WHERE account_id = $1',
            [accountId]
        )

        if (accountMoney.rowCount === 0) {
            return res.status(400).json({
                error: "Account not found"
            })
        }

        const money = accountMoney.rows[0].account_money;

        const itemPrice = await pool.query(
            'SELECT item_price FROM item WHERE item_id = $1',
            [itemId]
        )

        const price = itemPrice.rows[0].item_price;


        if (price > money) {
            return res.status(300).json({
                error: "Money not enough"
            })
        }

        const result = await pool.query(
            'UPDATE earning SET item_count = item_count + 1 WHERE account_id = $1 AND item_id = $2 RETURNING *',
            [accountId, itemId]
        )

        const result2 = await pool.query(
            'UPDATE account SET account_money = account_money - $1 WHERE account_id = $2 RETURNING *',
            [price, accountId]
        )

        res.status(200).json({
            updatedEarning: result.rows[0],
            updatedAccount: result2.rows[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err,
        })
    }
}

async function sellItem(req, res) {
    const {accountId,itemId} = req.body;

    try {

        const itemCount = await pool.query(
            'SELECT * FROM earning WHERE account_id = $1 AND item_id = $2',
            [accountId, itemId]
        )

        const count = itemCount.rows[0].item_count;

        if (count < 1) {
            return res.status(300).json({
                error: "Not enough item to sell"
            })
        }

        const itemPrice = await pool.query(
            'SELECT * FROM item WHERE item_id = $1',
            [itemId]
        )

        const price = itemPrice.rows[0].item_price;

        const result = await pool.query(
            'UPDATE account SET account_money = account_money + $1 WHERE account_id = $2 RETURNING *',
            [price, accountId]
        )

        const result2 = await pool.query(
            'UPDATE earning SET item_count = item_count - 1 WHERE account_id = $1 AND item_id = $2 RETURNING *',
            [accountId, itemId]
        )

        res.status(200).json({
            updatedAccount: result.rows[0],
            updatedEarning: result2.rows[0]
        })

    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

async function click(req, res) {
    const {accountId} = req.body;

    try {

        const click = await pool.query(
            'SELECT SUM(item.item_earn * earning.item_count) AS click FROM item INNER JOIN earning ON item.item_id = earning.item_id WHERE earning.account_id = $1',
            [accountId]
        )

        const result = await pool.query(
            'UPDATE account SET account_money = account_money + $1 WHERE account_id = $2 RETURNING *',
            [click.rows[0].click, accountId]
        )

        res.status(200).json({
            earnPerClick: click.rows[0],
            accountUpdated: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

async function getEarning(req, res) {
    const accountId = req.params.id;

    try {

        const click = await pool.query(
            'SELECT SUM(item.item_earn * earning.item_count) AS click FROM item INNER JOIN earning ON item.item_id = earning.item_id WHERE earning.account_id = $1',
            [accountId]
        )

        res.status(200).json(click.rows[0]);

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    buyItem,
    sellItem,
    click,
    getEarning
}