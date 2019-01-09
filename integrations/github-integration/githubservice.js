const newGitHubService = (userCredential, repositoryName, branchName, newCommitMessage) => {
    const axios = require('axios')
    const atob = require('atob')
    const btoa = require('btoa')
    const credential = userCredential
    const repository = repositoryName
    const branch = branchName
    const commitMessage = newCommitMessage
    const authToken = btoa(userCredential.username + ':' + userCredential.password)
    axios.defaults.headers.common = { 'Authorization': 'Basic ' + authToken }

    const getBranchHeadAsync = async () => {
        const token = btoa(userCredential.username + ':' + userCredential.password)
        axios.defaults.headers.common = { 'Authorization': 'Basic ' + token }
        try {
            let response = await axios.get('https://api.github.com/repos/' + credential.username + '/' + repositoryName + '/git/refs/heads/' + branchName)
            return response.data
        }
        catch (error) {
            throw error
        }
    }

    const getLastCommitAsync = async (headUrl) => {
        const token = btoa(userCredential.username + ':' + userCredential.password)
        axios.defaults.headers.common = { 'Authorization': 'Basic ' + token }
        try {
            let response = await axios.get(headUrl)
            return response.data
        }
        catch (error) {
            throw error
        }
    }
    
    const createNewFileAsync = async (blob) => {
        try {
            const token = btoa(userCredential.username + ':' + userCredential.password)
            axios.defaults.headers.common = { 'Authorization': 'Basic ' + token }
            let response = await axios.post('https://api.github.com/repos/' + credential.username + '/' + repository + '/git/blobs', {
                content: JSON.stringify(blob),
                encoding: "utf-8|base64"
            })
            return response.data
        }
        catch (error) {
            throw error
        }
    }

    const getPreviousTreeAsync = async (treeURL) => {
        const token = btoa(userCredential.username + ':' + userCredential.password)
        axios.defaults.headers.common = { 'Authorization': 'Basic ' + token }
        try {
            let response = await axios.get(treeURL)
            return response.data
        }
        catch (error) {
            throw error
        }
    }

    const createTreeAsync = async (baseTreeSHA, filePath, blobSHA) => {
        const token = btoa(userCredential.username + ':' + userCredential.password)
        axios.defaults.headers.common = { 'Authorization': 'Basic ' + token }
        try {
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
            throw error
        }
    }

    const commitChangeAsync = async (commitMessage, lastCommitSHA, treeSHA) => {
        const token = btoa(userCredential.username + ':' + userCredential.password)
        axios.defaults.headers.common = { 'Authorization': 'Basic ' + token }
        try {
            let response = await axios.post('https://api.github.com/repos/' + credential.username + '/' + repository + '/git/commits', {
                message: commitMessage,
                parents: [lastCommitSHA],
                tree: treeSHA
              })
            return response.data
        }
        catch (error) {
            throw error
        }
    }

    const updateHeadAsync = async (commitSHA) => {
        try {
            await axios.patch('https://api.github.com/repos/' + credential.username + '/' + repository + '/git/refs/heads/' + branchName, {
                sha: commitSHA,
                force: true
              })
        }
        catch (error) {
            throw error
        }
    }

    const publishFile = async (filePath, fileContent) => {
        try{
            let branchHead = await getBranchHeadAsync()
            let lastCommit = await getLastCommitAsync(branchHead.object.url)
            let newBlob = await createNewFileAsync(fileContent)
            let previousTree = await getPreviousTreeAsync(lastCommit.tree.url)
            let newTree = await createTreeAsync(previousTree.sha, filePath, newBlob.sha)
            let commit = await commitChangeAsync('Test first automatizated', lastCommit.sha, newTree.sha)
            await updateHeadAsync(commit.sha)
        }
        catch (error) {
            throw error
        }
        
    }

    return {
        publishFile
    }
}

module.exports.newGitHubService = newGitHubService