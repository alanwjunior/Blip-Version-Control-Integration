# Blip-Version-Control-Integration
This package allows you to deploy your chatbot from BLiP platform to github and others version control tools.

## Install
```
npm i blip-version-control-integration
```

## Usage
Import the package to your project and use the available methods.

### Blip Integration
Initialize your service passing the blip user token:
```
import blipControlVersion from 'blip-version-control-integration'
const blipIntegrationService = blipControlVersion.newBlipService(userToken)
```
#### - getPublishedFlowAsync(botShortName)
This method returns the bot's published flow as a json. Pass the bot unique name as argument.

#### - updateSavedFlowAsync(updatedFlow, botShortName)
This methods updates the bot's flow directly on BLiP. Pass the flow as json at first argument and on the second the bot unique name.

#### - deployUsingGithubAsync(sourceBotShortName, destinyBotShortName, githubInfos)
This method allows you to make the full deploy process of two bots. It takes the source bot's flow, saves on github. After it does the same with the destiny bot's flow. 
In the end it updates the destiny bot's flow with the source bot's flow.
Obs.: this method takes the bot's published flow.

### GitHub Integration
Initialize your service passing four arguments:
- userCredential: json object in format:
```
{
        userCredential: {
            username: GITHUB USERNAME,
            password: YOUR PASSWORD
        },
        repositoryName: REPOSITORY NAME,
        branchName: BRANCH NAME,
        newCommitMessage: COMMIT MESSAGE
}
```
- repositoryName: the github's repository name
- branchName: the repository's branch name
- newCommitMessage: the commit message

Usage:
```
import blipControlVersion from 'blip-version-control-integration'
const gitHubIntegrationService = blipControlVersion.newGitHubService(userCredential, repositoryName, branchName, newCommitMessage)
```

Example:
```
const gitHubInfo = {
        userCredential: {
            username: GITHUB USERNAME,
            password: YOUR PASSWORD
        },
        repositoryName: REPOSITORY NAME,
        branchName: BRANCH NAME,
        newCommitMessage: COMMIT MESSAGE
}
gitHubIntegrationService.githubApi(gitHubInfo, 'Blip-Version-Control-Integration', 'master', 'Testing message')
```
#### - publishFile(filePath, fileContent)
This methods make the complete process of committing and merging a file on a github repository. Pass the file path as the first argument and the file content (ex: a simple blob or json) as the second argument.

