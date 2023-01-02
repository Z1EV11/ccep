import axios from "axios"

import { config } from "../../config"

function getAPI(path: string):string {
    const env = config.env;
    let domain= ''
    if(env == 'dev') {
        domain = config.dev.prefix;
    } else if(env == 'prod ') {
        domain = config.prod.beDomain;
    }
    return `${domain}${path}`
}

const sendReq = (reqObj: { url: string; method: string; data: object }) => {
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
