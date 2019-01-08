const gitHubService = (userCredential, repositoryName, branchName, newCommitMessage) => {
    const credential = userCredential
    const repository = repositoryName
    const branch = branchName
    const commitMessage = newCommitMessage

    const axios = require('axios')
    const atob = require('atob')
    const btoa = require('btoa')
    const authToken = btoa(userCredential.username + ':' + userCredential.password)
    axios.defaults.headers.common = { 'Authorization': 'Basic ' + authToken }

    const getBranchHead = async () => {
        try {
            let response = await axios.get('https://api.github.com/repos/' + credential.username + '/' + repositoryName + '/git/refs/heads/' + branchName)
            return response.data
        }
        catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const getLastCommit = async (headUrl) => {
        try {
            let response = await axios.get(headUrl)
            return response.data
        }
        catch (error) {
            console.log(error.message)
            throw error
        }
    }
    
    const createNewFile = async (blob) => {
        try {
            let response = await axios.post('https://api.github.com/repos/alanwjunior/githubintegrationtest/git/blobs', {
                content: blob,
                encoding: "utf-8|base64"
            })
            return response.data
        }
        catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const getPreviousTree = async (treeURL) => {
        try {
            let response = await axios.get(treeURL)
            return response.data
        }
        catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const createTree = async (baseTreeSHA, filePath, blobSHA) => {
        try {
            console.log('createTree')
            let response = await axios.post('https://api.github.com/repos/' + credential.username + '/' + repository + '/git/trees', {
                base_tree: baseTreeSHA,
                tree: [
                  {
                    path: filePath,
                    mode: "100644",
                    type: "blob",
                    sha: blobSHA
                  }
                ]
            })
            return response.data
        } 
        catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const commitChange = async (commitMessage, lastCommitSHA, treeSHA) => {
        try {
            let response = await axios.post('https://api.github.com/repos/' + credential.username + '/' + repository + '/git/commits', {
                message: commitMessage,
                parents: [lastCommitSHA],
                tree: treeSHA
              })
            return response.data
        }
        catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const updateHead = async (commitSHA) => {
        try {
            await axios.patch('https://api.github.com/repos/' + credential.username + '/' + repository + '/git/refs/heads/' + branchName, {
                sha: commitSHA,
                force: true
              })
        }
        catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const publishFile = async (filePath, fileContent) => {
        let branchHead = await getBranchHead()
        let lastCommit = await getLastCommit(branchHead.object.url)
        let newBlob = await createNewFile(fileContent)
        let previousTree = await getPreviousTree(lastCommit.tree.url)
        let newTree = await createTree(previousTree.sha, 'testeGitIntegration.json', newBlob.sha)
        let commit = await commitChange('Test first automatizated', lastCommit.sha, newTree.sha)
        await updateHead(commit.sha)
        console.log('process finished')
    }

    return {
        publishFile
    }
}

module.exports.gitHubService = gitHubService