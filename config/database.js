// config/database.js
require('dotenv').config();

module.exports = {
  production: {
    use_env_variable: 'JAWSDB_URL',
    dialect: 'mysql',
    dialectOptions: {
      localInfile: true,
      flags: ['+LOCAL_FILES']
    }
  }
};