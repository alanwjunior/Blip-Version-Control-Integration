const BlipService = (blipUserToken) => {
    const axios = require('axios')

    const userToken = blipUserToken

    const createAxiosInstance = (endPoint, token) => {
        let axiosInstance = axios.create({
            baseURL: endPoint
        })
        axiosInstance.defaults.headers.common = { 'Authorization': + token, 'Content-Type': 'application/json' }
        
        return axiosInstance
    }
    
    const createBlipAuthorizationToken = async (botShortName) => {
        const botAccessKey = await getBotAccessKey(botShortName)
        let authorizationKey = botShortName + ':' + botAccessKey
        let encodedAuthKey = btoa(authorizationKey)
        return encodedAuthKey
    }
    
    const getBotAccessKey = async (botShortName) => {
        try {
            axios.defaults.headers.common = { 'Authorization': 'Token ' + userToken }
            let response = await axios.get('https://api.blip.ai/applications/' + botShortName)
            return atob(response.data.accessKey)
        }
        catch(error){
            console.log(error.message)
            throw error
        }
    }
    
    const getPublishedFlow = async (botShortName) => {
        const botAuthKey = await createBlipAuthorizationToken(botShortName)
        const guid = require('./../../utils/guid-generator/guid')
        axios.defaults.headers.common = { 'Authorization': 'Key ' + botAuthKey, 'Content-Type': 'application/json' }
        return axios.post('https://msging.net/' + 'commands', {
            id: guid.newGuid(),
            method: 'get',
            uri: '/buckets/blip_portal:builder_published_flow'
        })
    }

    return {
        getPublishedFlow: getPublishedFlow,
        userToken: userToken
    }

}

module.exports.BlipService = BlipService