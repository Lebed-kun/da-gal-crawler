const express = require('express');
const axios = require('axios');

const router = express.Router();

if (process.env.NODE_ENV == 'production') {
    router.get('/', (request, response) => {
        response.sendFile('./static/index.html');
    })
} 


router.post('/api/upload', (request, response) => {
    try {
        const link = request.body.link;
    
        axios.get(link)
            .then(res => {
                console.log(res.data)
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