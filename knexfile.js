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
    connection: 'postgres://localhost/jetfuel_test',
    useNullAsDefault: true,
    migrations: {
      directory: __dirname +'/db/migrations'
    },
    seeds: {
      directory: __dirname +'/db/seeds/test'
    }
 }

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
