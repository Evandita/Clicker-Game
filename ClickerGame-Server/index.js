require('dotenv').config();
const express = require("express");
const cors = require('cors');
const accountRepo = require("./repositories/repository.account");
const itemRepo = require("./repositories/repository.item");
const earnRepo = require("./repositories/repository.earning")

const port = process.env.PORT;
const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));

// Endpoint

app.post('/createAccount', accountRepo.createAccount);
app.get('/readAccount/:id', accountRepo.readAccount);
app.put('/updateAccount', accountRepo.updateAccount);
app.delete('/deleteAccount', accountRepo.deleteAccount);
app.post('/logIn', accountRepo.logIn);

app.post('/createItem', itemRepo.createItem);
app.get('/readItem/:id', itemRepo.readItem);
app.put('/updateItem', itemRepo.updateItem);
app.delete('/deleteItem', itemRepo.deleteItem);

app.put('/buyItem', earnRepo.buyItem);
app.put('/sellItem', earnRepo.sellItem);
app.put('/click', earnRepo.click);
app.get('/getEarning/:id', earnRepo.getEarning);

app.listen(port, () => {
    console.log("Server is running and listening on port ", port);
});

