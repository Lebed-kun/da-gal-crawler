const express = require('express');
const axios = require('axios');
const JSZip = require('jszip');

const config = require('./config.js');
const utils = require('./utils.js');

const router = express.Router();

if (process.env.NODE_ENV == 'production') {
    router.get('/', (request, response) => {
        response.sendFile('./static/index.html');
    })
} 

// Done!
// Prepare data for images crawling
router.post('/api/download', (request, response, next) => {
    const link = request.body.link;
    const collectionData = utils.getCollData(link);
    const limit = request.body.limit;
    if (!collectionData) {
        response.status(400).send('Invalid url format!');
        return;
    }
    if (!(limit > 0 && limit <= 500)) {
        response.status(400).send('Limit should be greater than 0 and at most 500!');
        return;
    }
        
    request.body.link = collectionData;
    next();
})

// Get access token
router.post('/api/download', (request, response, next) => {
    axios.get(`${config.DA_AUTH_URL}?grant_type=${config.GRANT_TYPE}&client_id=${config.CLIENT_ID}&client_secret=${config.CLIENT_SECRET}`)
        .then(res => {
            request.body.accessToken = res.data.access_token;
            next();
        })
        .catch(err => {
            console.log(err);
            response.status(500).send(err.message);
        })
})

// Find folder UUID
router.post('/api/download', (request, response, next) => {
    const accessToken = request.body.accessToken;
    const method = request.body.link.type;
    const username = request.body.link.username; 
    const folderName = request.body.link.slugName;

    let getUUIDPromise = function f(options) {
        let { baseUrl, method, accessToken, username, folderName, offset } = options;
        offset = offset || 0;

        let promise = axios.get(`${baseUrl}/${method}/folders?access_token=${accessToken}&username=${username}&offset=${offset}`);
        promise = promise.then(res => {
                                const results = res.data.results;
                                for (let i = 0; i < results.length; i++) {
                                    if (folderName === utils.slugify(results[i].name)) {
                                        return results[i].folderid;
                                    }
                                }

                                if (res.data.next_offset) {
                                    options.offset = res.data.next_offset;
                                    
                                    return f(options);
                                } else {
                                    return null;
                                }
                        });

        return promise;
    }

    getUUIDPromise({
        baseUrl : config.BASE_API_URL,
        method : method,
        accessToken : accessToken,
        username : username,
        folderName : folderName
    }).then(uuid => {
        if (uuid) {
            request.body.folderId = uuid;
            next();
        } else {
            response.status(404).send('Cannot find folder with this name!');
        }
    }).catch(err => {
        console.log(err);
        response.status(500).send();
    })
})

// Fetch urls of images
router.post('/api/download', (request, response, next) => {
    const accessToken = request.body.accessToken;
    const method = request.body.link.type;
    const folderId = request.body.folderId;
    const username = request.body.link.username; 
    const limit = request.body.limit;

    const links = [];

    let getImgUrlsPromise = function f(options) {
        let { baseUrl, method, accessToken, folderId, username, offset, limit, links } = options;
        offset = offset || 0;

        let promise = axios.get(`${baseUrl}/${method}/${folderId}?access_token=${accessToken}&username=${username}&offset=${offset}`);
        promise = promise.then(res => {
            const results = res.data.results;
            const nextOffset = res.data.next_offset;

            for (let i = 0; i < results.length && i < limit; i++) {
                links.push(results[i].content.src);
            }

            if (res.data.next_offset && links.length < limit) {
                options.offset = res.data.next_offset;
                                    
                return f(options);
            } else {
                return links;
            }
        })

        return promise;
    }

    getImgUrlsPromise({
        baseUrl : config.BASE_API_URL,
        method : method,
        accessToken : accessToken,
        folderId : folderId,
        username : username,
        limit : limit,
        links : links
    }).then(links => {
        request.body.imgUrls = links;
        next();
    }).catch(err => {
        console.log(err);
        response.status(500).send();
    })
})

// Download images from urls
router.post('/api/download', (request, response, next) => {
    const imgUrls = request.body.links;
    const zip = new JSZip();

    const getImagePromise = function f(options) {
        let { urls, id } = options;
        id = id || 0;

        let promise = axios.get(urls[id], {
            responseType : 'arraybuffer'
        });
        promise = promise.then(res => Buffer.from(res.data, 'base64'));
    }
}) 

router.post('/api/download', (request, response) => {
    response.send(request.body);
})

module.exports = router;