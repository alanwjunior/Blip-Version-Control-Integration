# Blip-Version-Control-Integration
This package allows you to deploy your chatbot from BLiP platform to github, allowing you to make the version control.

## Install
```
npm i blip-version-control-integration
```

## Usage
Import the package to your project and use the available methods

### Blip Integration
#### getPublishedFlowAsync(botShortName)
This method return the bot flow's json file. Pass as argument the bot unique name.

#### updateSavedFlowAsync(updatedFlow, botShortName)
This methods update the bot's flow. Pass the flow to update at first argument and on the second the bot unique name.

#### deployUsingGithubAsync
