var _Environments = {
    development: {BASE_URL: '142.93.6.224', API_KEY: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.TIADUXTXQwKAAgk1QpPx7k5Y8LHmAQnJo6GDRvug6AI'},
}

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)

    // ...now return the correct environment
    return _Environments['development']
}

let Environment = getEnvironment()
module.exports = Environment
