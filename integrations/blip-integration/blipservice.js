const newBlipService = (blipUserToken) => {
    const axios = require('axios')
    const guid = require('./../../utils/guid-generator/guid')
    const userToken = blipUserToken
    const atob = require('atob')
    const btoa = require('btoa')

    const createAxiosInstance = (endPoint, token) => {
        let axiosInstance = axios.create({
            baseURL: endPoint
        })
        axiosInstance.defaults.headers.common = { 'Authorization': + token, 'Content-Type': 'application/json' }
        
        return axiosInstance
    }
    
    const createBlipAuthorizationTokenAsync = async (botShortName) => {
        try {
            const botAccessKey = await getBotAccessKeyAsync(botShortName)
            let authorizationKey = botShortName + ':' + botAccessKey
            let encodedAuthKey = btoa(authorizationKey)
            return encodedAuthKey
        }
        catch (error) {
            throw error
        }
    }
    
    const getBotAccessKeyAsync = async (botShortName) => {
        try {
            axios.defaults.headers.common = { 'Authorization': 'Token ' + userToken }
            let response = await axios.get('https://api.blip.ai/applications/' + botShortName)
            return atob(response.data.accessKey)
        }
        catch (error) {
            throw error
        }
    }
    
    const getPublishedFlowAsync = async (botShortName) => {
        try {
            const botAuthKey = await createBlipAuthorizationTokenAsync(botShortName)
        
            axios.defaults.headers.common = { 'Authorization': 'Key ' + botAuthKey, 'Content-Type': 'application/json' }

            let response = await axios.post('https://msging.net/' + 'commands', {
                id: guid.newGuid(),
                method: 'get',
                uri: '/buckets/blip_portal:builder_published_flow'
            })

            return response.data.resource
        }
        catch (error) {
            throw error
        }
        
    }

    const updateSavedFlowAsync = async (updatedFlow, botShortName) => {
        try {
            const botAuthKey = await createBlipAuthorizationTokenAsync(botShortName)
            axios.defaults.headers.common = { 'Authorization': 'Key ' + botAuthKey, 'Content-Type': 'application/json' }
            let response = await axios.post('https://msging.net/commands', {
                id: guid.newGuid(),
                method: 'set',
                resource: updatedFlow,
                type: 'application/json',
                uri: '/buckets/blip_portal%3Abuilder_working_flow'
            })
            if (response.status != 200)
                throw 'Error on updating flow'
            return response.data
        }
        catch (error) {
            throw error
        }   
    }

    const saveFlowOnGitHubAsync = async (botShortName, githubInfos) => {
        try {
            const gitHubAPI = require('./../github-integration/githubservice')
            const gitHubService = gitHubAPI.gitHubService(githubInfos.userCredential, githubInfos.repositoryName, githubInfos.branchName, githubInfos.newCommitMessage)
            let botFlow = await getPublishedFlowAsync(botShortName)
            await gitHubService.publishFile(botShortName + '.json', botFlow)
        }
        catch (error) {
            throw error
        }
    }

    const deployUsingGithubAsync = async (sourceBotShortName, destinyBotShortName, githubInfos) => {
        try {
            await saveFlowOnGitHubAsync(sourceBotShortName, githubInfos)
            await saveFlowOnGitHubAsync(destinyBotShortName, githubInfos)
            let sourceFlow = await getPublishedFlowAsync(sourceBotShortName)
            await updateSavedFlowAsync(sourceFlow, destinyBotShortName)
        }
        catch (error) {
            throw error
        }
    }

    return {
        getPublishedFlowAsync: getPublishedFlowAsync,
        updateSavedFlowAsync: updateSavedFlowAsync,
        deployUsingGithubAsync: deployUsingGithubAsync,
        saveFlowOnGitHubAsync: saveFlowOnGitHubAsync,
        userToken: userToken
    }

}

module.exports.newBlipService = newBlipService