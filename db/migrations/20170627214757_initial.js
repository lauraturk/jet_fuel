
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('folders', (table) => {
      table.increments('id').primary()
      table.string('folder_name')

      table.timestamps(true, true)
    }),

    knex.schema.createTable('urls', (table) => {
      table.increments('id').primary()
      table.string('original_url')
      table.string('shortened_url')
      table.integer('folder_id').unsigned()
      table.foreign('folder_id').references('folders.id')

      table.timestamps(true, true)
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('urls'),
    knex.schema.dropTable('folders')
  ]);
};
