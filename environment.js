const _Environments = {
  development: { BASE_URL: 'skatesensebe.herokuapp.com' },
  //   development: { BASE_URL: 'localhost:3000' },
};

function getEnvironment() {
  // Insert logic here to get the current platform (e.g. staging, production, etc)

  // ...now return the correct environment
  return _Environments.development;
}

const Environment = getEnvironment();
module.exports = Environment;
