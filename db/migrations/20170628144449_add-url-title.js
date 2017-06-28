
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('urls', (table) =>{
      table.string('title');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('urls', (table) =>{
      table.dropColumn('title')
    })
  ])
};
