var _Environments = {
    development: {BASE_URL: '142.93.6.224', API_KEY: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.TIADUXTXQwKAAgk1QpPx7k5Y8LHmAQnJo6GDRvug6AI'},
    // development: {BASE_URL: 'localhost:3000', API_KEY: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNX0.i3ce1vrr43FJ1ox7M0lftvHk_nfGKbxtM-jZ_h8z1Ww'},

}

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)

    // ...now return the correct environment
    return _Environments['development']
}

let Environment = getEnvironment()
module.exports = Environment
