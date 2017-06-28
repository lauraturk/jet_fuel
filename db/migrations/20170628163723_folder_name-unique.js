
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('folders', (table) => {
      table.string('folder_name').unique().alter()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('folders', (table) => {
      table.dropUnique('folder_name')
    })
  ])
};
