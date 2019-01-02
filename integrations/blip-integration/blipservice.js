
const createAxiosInstance = () => {

};

const createBlipAuthorizationToken = () => {

};

const getBotAccessKey = (botShortName) => {

};

const getPublishedFlow = () => {
    let axios = require('axios')
    const guid = require('./../../utils/guid-generator/guid')
    axios.defaults.headers.common = { 'Authorization': 'Key ' + encodedAuthKey, 'Content-Type': 'application/json' }
    axios.post('https://msging.net/' + 'commands', {
        id: guid.newGuid(),
        method: 'get',
        uri: '/buckets/blip_portal:builder_published_flow'
    })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error.message))
};