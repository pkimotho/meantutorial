const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const authentification = require('./routes/authentification.route')(router);

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(config.uri, {
    useCreateIndex: true,
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log(`Failed to connect to database. ${err}`);
    } else {
        console.log(`Successfully connected to database: ${config.db}`);
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/authentification', authentification);
app.use(express.static(__dirname + '/client/dist/client'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});