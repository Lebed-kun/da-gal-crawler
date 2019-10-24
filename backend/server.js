const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const router = require('./routes.js');

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(router);
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}!`);
})