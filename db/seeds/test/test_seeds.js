
exports.seed = (knex, Promise) => {

  return knex('urls').del()
    .then(() => knex('folders').del())
    .then(() =>{
      return Promise.all([
        knex('folders').insert({
          folder_name: 'social media'
        }, 'id')
        .then(folder =>{
          return Promise.all([
            knex('urls').insert({
              original_url: 'http://www.facebook.com',
              shortened_url: 'Ab',
              folder_id: folder[0],
              title: 'Facebook'
            }),
            knex('urls').insert({
              original_url: 'http://www.twitter.com',
              shortened_url: 'AA',
              folder_id: folder[0],
              title: 'Twitter'
            }),
            knex('urls').insert({
              original_url: 'http://www.linkedin.com',
              shortened_url: 'bA',
              folder_id: folder[0],
              title: 'LinkedIn'
            })
          ])
        }),
        knex('folders').insert({
          folder_name: 'email'
        }, 'id')
        .then(folder =>{
          return knex('urls').insert({
            original_url: 'http://www.gmail.com',
            shortened_url: 'Bd',
            folder_id: folder[0],
            title: 'Gmail',
          })
        })
        .then(() => console.log('Seeding Complete'))
        .catch((error) => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch( error => console.log(`Error seeding data: ${error}`))
};
