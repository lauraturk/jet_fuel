module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/jet_fuel',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seed/dev'
    }
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/jetfuel_test',
    useNullAsDefault: true,
    migrations: {
      directory: __dirname +'/db/migrations'
    },
    seeds: {
      directory: __dirname +'/db/seeds/test'
    }
 },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
