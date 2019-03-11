var _Environments = {
    // development: {BASE_URL: '142.93.6.224'},
    development: {BASE_URL: 'localhost:3000'},

}

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)

    // ...now return the correct environment
    return _Environments['development']
}

let Environment = getEnvironment()
module.exports = Environment
