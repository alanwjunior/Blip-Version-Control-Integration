const blipApi = require('./integrations/blip-integration/blipservice')
const githubApi = require('./integrations/github-integration/githubservice')

module.exports = {
    newBlipService: blipApi.newBlipService,
    newGitHubService: githubApi.newGitHubService
}