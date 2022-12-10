import axios from "axios"

function getAPI(path: string):string {
    const prefix = 'http://localhost:3000' // read global config 
    return `${prefix}${path}`
}

const sendReq = (reqObj: { url: string; method: string; data: string }) => {
    return axios({
        url: getAPI(reqObj.url),
        method: reqObj.method || 'post',
        data: reqObj.data
    });
}

export {
    getAPI,
    sendReq
}
