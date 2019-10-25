const express = require('express');
const axios = require('axios');

const config = require('./config.js');
const utils = require('./utils.js');

const router = express.Router();

if (process.env.NODE_ENV == 'production') {
    router.get('/', (request, response) => {
        response.sendFile('./static/index.html');
    })
} 

// Prepare data for images crawling
router.post('/api/download', (request, response, next) => {
    const link = request.body.link;
    const collectionData = utils.getCollData(link);
    if (!collectionData) {
        response.status(400).send('Invalid url format!')
        return;
    }
        
    request.body.link = collectionData;
    next();
})

router.post('/api/download', (request, response) => {
    response.send(request.body.link);
})

module.exports = router;