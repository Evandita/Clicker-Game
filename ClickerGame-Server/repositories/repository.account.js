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

async function createAccount(req,res) {
    const {username, password} = req.body;

    try {
        const result = await pool.query (
            'INSERT INTO account (account_username, account_password, account_money) VALUES ($1, $2, 0) RETURNING *',
            [username, password]
        );

        const newAccount = result.rows[0];

        const result2 = await pool.query (
            'INSERT INTO earning (account_id, item_id, item_count) SELECT account.account_id, item.item_id, 0 FROM account, item WHERE account.account_id = $1 RETURNING *',
            [newAccount.account_id]
        )
        
        res.status(200).json({
            newAccount: newAccount,
            newEarning: result2.rows});
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

async function readAccount(req, res) {
    const id = req.params.id;

    try {
        const result = await pool.query (
          'SELECT * FROM account WHERE account_id = $1',
          [id]  
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Account not found"
            });
        }

        const account = result.rows;
        res.status(200).json(account);
    } catch (err) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}

async function updateAccount(req, res) {
    const {newUsername, newPassword, id} = req.body;

    try {
        const result = await pool.query(
            'UPDATE account SET account_username = $1, account_password = $2 WHERE account_id = $3 RETURNING *',
            [newUsername, newPassword, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Account not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

async function deleteAccount(req, res) {
    const {id} = req.body;

    try {
        const result = await pool.query(
            'DELETE FROM account WHERE account_id = $1 RETURNING *',
            [id]
        )

        if (result.rowCount === 0) {
            res.status(400).json({
                error: "Account not fonud"
            })
        }

        const result2 = await pool.query(
            'DELETE FROM earning WHERE account_id = $1 RETURNING *',
            [id]
        )

        res.status(200).json({
            deletedAccuont: result.rows[0],
            deletedEarning: result2.rows
        });

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

async function logIn(req, res) {
    const {username, password} = req.body;

    try {
        const result = await pool.query (
          'SELECT * FROM account WHERE account_username = $1 AND account_password = $2',
          [username, password]  
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Account not found"
            });
        }

        const account = result.rows;
        res.status(200).json(account);
    } catch (err) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}

module.exports = {
    createAccount,
    readAccount,
    updateAccount,
    deleteAccount,
    logIn
};