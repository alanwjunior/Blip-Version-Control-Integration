const start = async () => {
    const fs =  require('fs');
    const blipApi = require('./integrations/blip-integration/blipservice')
    
    const blipService = blipApi.BlipService('XXXXXXXXXXXXXXXXXXXX')
    
    // let flow = await blipService.getPublishedFlowAsync('XXXXXXXXXXX')
    // const gitHubApi = require('./integrations/github-integration/githubservice')
    // const gitHubService = gitHubApi.gitHubService({
    //     username: 'xxxxxx',
    //     password: 'yyyyyy'
    // }, 'xxxxxxxxx', 'xxxxxxxx')
    
    // gitHubService.publishFile('xxxxxxxxxxxx', '{ text: just a text file }',' first commit automatizated')

    let newFlow = JSON.parse(fs.readFileSync('flow.json', 'utf8'))

    await blipService.updateSavedFlow(newFlow, 'XXXXXXXXXX')
}

start()

