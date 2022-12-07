function getAPI(env: String, path: String):String {
    if(env == "dev")
        path = `http://localhost:3000${path}`
    else if(env == "prod")
        path = `http://localhost:3000${path}`
    return path
}

export {
    getAPI
}
