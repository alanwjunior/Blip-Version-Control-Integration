global.atob = require('atob')
global.btoa = require('btoa')

const blipApi = require('./integrations/blip-integration/blipservice')

const blipService = blipApi.BlipService('RUQxbE5JVHN4Y2tkOC9FZnBmOCsxZVg2RjNnSHNnRUVSa0RKRXljVTlBZytqQ1NEc2ZtM3VnTFpxUVFmeWVYM0o0T3ppNFhlWmZ1cXVQam9UaVJWT3c9PQ==')

blipService.getPublishedFlow('clubeitacolomy')
    .then(response => console.log(response.data))
    .catch(error => console.log(error.message))
    
console.log('teste')
