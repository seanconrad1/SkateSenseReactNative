var _Environments = {
    development: {BASE_URL: '142.93.6.224'},
    // development: {BASE_URL: 'localhost:3000', API_KEY: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.g0U5SAOLozk3dz0mNUrvBSR-0CSewJ5eParRWg_abVk'},

}

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)

    // ...now return the correct environment
    return _Environments['development']
}

let Environment = getEnvironment()
module.exports = Environment
