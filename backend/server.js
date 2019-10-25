const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const router = require('./routes.js');

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(router);
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}!`);
})