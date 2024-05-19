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

async function createItem(req,res) {
    const {name, price, earn} = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO item (item_name, item_price, item_earn) VALUES ($1, $2, $3) RETURNING *',
            [name, price, earn]
        );

        const newItem = result.rows[0];

        const result2 = await pool.query(
            'INSERT INTO earning (account_id, item_id, item_count) SELECT account.account_id, item.item_id, 0 FROM account, item WHERE item.item_id = $1 RETURNING *',
            [newItem.item_id]
        )
        
        res.status(200).json({
            newItem: newItem,
            newEarning: result2.rows
        })

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

async function readItem(req, res) {
    const id = req.params.id;

    try {
        const result = await pool.query(
            'SELECT item.item_id, item.item_name, item.item_price, item.item_earn, earning.item_count FROM item INNER JOIN earning on item.item_id = earning.item_id WHERE earning.account_id = $1 ORDER BY item.item_price ASC',
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Item not found"
            })
        }
        
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

async function updateItem(req, res) {
    const {id, newName, newPrice, newEarn} = req.body;

    try {

        const result = await pool.query(
            'UPDATE item SET item_name = $1, item_price = $2, item_earn = $3 WHERE item_id = $4 RETURNING *',
            [newName, newPrice, newEarn, id]
        )

        if (result.rowCount === 0) {
            return res.status(400).json({
                error: "Item not found"
            })
        }

        res.status(200).json(result.rows[0])

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

async function deleteItem(req, res) {
    const {id} = req.body;

    try {

        const result = await pool.query(
            'DELETE FROM item WHERE item_id = $1 RETURNING *',
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Item not found"
            })
        }

        const result2 = await pool.query(
            'DELETE FROM earning WHERE item_id = $1 RETURNING *',
            [id]
        )

        res.status(200).json({
            deletedItem: result.rows[0],
            deletedEarning: result2.rows
        });

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    createItem,
    readItem,
    updateItem,
    deleteItem
};