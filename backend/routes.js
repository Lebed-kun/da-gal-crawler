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


router.post('/api/upload', (request, response) => {
    try {
        const link = request.body.link;
        const username = utils.getUsername(link);
        
        axios.get(`https://www.deviantart.com/oauth2/authorize?response_type=code&client_id=${config.clientId}&redirect_uri=${config.redirectUri}`)
            .then(res => {
                console.log(res.code);
                response.status(200).send();
            })
            .catch(err => {
                console.log(err);
                response.status(502).send();
            }) 
    } catch (err) {
        response.status(500).send();
    }
})

module.exports = router;