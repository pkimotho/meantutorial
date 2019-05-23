const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(config.uri, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log(`Failed to connect to database. ${err}`);
    } else {
        console.log(config.secret);
        console.log(`Successfully connected to database: ${config.db}`);
    }
});

app.use(express.static(__dirname + '/client/dist/client'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});