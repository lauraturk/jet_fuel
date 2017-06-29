
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('folders', (table) => {
      table.dropUnique('folder_name')
    }),
    knex.schema.alterTable('urls', (table) => {
      table.integer('popularity')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('folders', (table) => {
      table.string('folder_name').unique().alter()
    }),
    knex.schema.alterTable('urls', (table) => {
      table.dropColumn('popularity')
    })
  ])
};
