
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('urls').del()
    .then(() => knex('folders').del())
    .then(() =>{
      return Promise.all([
        knex('folders').insert({
          folder_name: 'default'
        }, 'id')
        .then(folder =>{
          return knex('urls').insert({
            original_url: 'www.idontknowwhattodowithmylife.com',
            shortened_url: 'www.idk.com',
            folder_id: folder[0],
            title: 'I Dont Know What to do with my life',
            popularity: 0
          })
        })
        .then(() => console.log('Seeding Complete'))
        .catch((error) => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch( error => console.log(`Error seeding data: ${error}`))
};
