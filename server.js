const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const knex = require('knex')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const host = process.env.DOMAIN || 'http://localhost:3000/api'

const encodeUrl = require('./shortener')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)

app.use(express.static('public'))

app.locals.title = 'Jet Fuel'

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then((folders) => {
      if(folders.length){
        response.status(200).json(folders)
      } else {
        response.status(404).json({
          error: 'No Folders Found'
        })
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Internal Error retrieving folders.'
      })
    })
})

app.get('/api/v1/folders/:id', (request, response) => {
  database('folders').where('id', request.params.id).select()
    .then((folders) => {
      if(folders.length){
        response.status(200).json(folders)
      } else {
        response.status(404).json({
          error: 'No Folders Found'
        })
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: "Internal error retrieving specific folder by ID. The ID should be a numerical value."
      })
    })
})

app.get('/api/v1/folders/:id/urls', (request, response) => {
  database('urls').where('folder_id', request.params.id).select()
    .then((urls) => {
      if(urls.length){
        response.status(200).json(urls)
      } else {
        response.status(404).json({
          error: 'No Urls Found'
        })
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Internal error retrieving urls by folder ID. The ID should be a numerical value'
      })
    })
})

app.get('/api/v1/urls', (request, response) => {
  database('urls').select()
    .then((urls) => {
      if(urls.length){
        response.status(200).json(urls)
      } else {
        response.status(404).json({
          error: 'No Urls Found'
        })
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Internal error retrieving all urls.'
      })
    })
})

app.get('/api/v1/urls/:id', (request, response) => {
  database('urls').where('id', request.params.id).select()
    .then((urls) => {
      if(urls.length){
        response.status(200).json(urls[0])
      } else {
        response.status(404).json({
          error: 'No Urls Found'
        })
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'Internal error retrieving url by a specific ID. IDs should be a numerical value'
      })
    })
})

app.post('/api/v1/urls/:id', (req, res) => {
  const { id } = req.params
  database('urls').where('id', id).increment('popularity', 1)
  .then((data) => console.log(data))
  .catch((error) => console.log(error))
})


const redirectUrl = (req, res) => {
  const { short_url } = req.params
  return database('urls').where('shortened_url', short_url).select()
    .then((data) => {
      if(data.length){
        return res.redirect(301, `${data[0].original_url}`)
      } else {
        return res.status(404).json({
          error: 'Page not found'
        })
      }
    })
}

app.put('/api/v1/urls/popularity', (request, response) => {
  console.log(request.body, 'request')
  // let updatePopularity = parseInt(req.body.popularity) + 1
  // database('urls').where('short_link', req.body.short_link).update('popularity', 1)
  //   .then( thing => {
  //     res.status(201).json({ response: 'click_count successfully incremented' })
  //   })
  //   .catch( error => {
  //     res.status(500).json({
  //   error: 'Internal error increasing the url's popularity.'
  // });
  //   })
})

app.get('/:short_url', (request, response) =>{
  database('urls').where('shortened_url', request.params.short_url).select()
    .then((data) => {
      if(data.length){
        return response.redirect(301, `${data[0].original_url}`)
      } else {
        return response.status(404).json({
          error: 'Page not found'
        })
      }
    })
    .catch((error) =>{
      response.status(500).json({
        error: 'Internal Error redirecting to original url. The page may not exist or the short url may be invalid.'
      })
    })
})

const addFoldersAndUrls = (data, response) => {
  return database('folders').insert({folder_name: data.folder_name}, 'id')
  .then((folderId) => {
    return createUrl(data, folderId[0])
      .then((urlId) => {
        createShortUrl(urlId)
        .then((urls) =>{
          response.status(201).json(urls)
        })
      })
  })
}

const createUrl = (url, folderId) =>{
  return database('urls').insert({
    original_url: url.original_url,
    folder_id: folderId,
    title: url.title,
    popularity: 0
  }, 'id')
}

const createShortUrl = (id) => {
  const integerId = id[0]
  const shortenedUrl = encodeUrl(id)
  return database('urls').where('id', '=', integerId).update({shortened_url: `${shortenedUrl}`}, 'shortened_url')
}

app.post('/api/v1/folders', (request, response) => {
  const data = request.body;

  for(let requiredParameter of ['folder_name', 'title', 'original_url']){
    if(!data[requiredParameter]){
      return response.status(422).json({
        error: `Expected format requires a Folder Name, a URL Title, and a URL.
        You are missing a ${requiredParameter} property`
      })
    }
  }

  database('folders').select()
    .then((folders) => {
      let match = folders.find((folder) =>{
        return folder.folder_name === data.folder_name;
      })
      if (!match) {
        addFoldersAndUrls(data, response)
          .then((urlData) => {
            response.status(201).json(urlData)
          })
          .catch((error) =>{
            response.status(500).json({
              error: 'There was an error with creating a new folder and adding a new url. Please try again.'
            })
          })
      } else {
        createUrl(data, match.id)
          .then((urlId) => {
            createShortUrl(urlId)
              .then((shortened_url) => {
                response.status(201).json({ short_url: `${shortened_url}`})
              })
              .catch((error) => {
                response.status(500).json({
                   error: 'There was an internal error creating a new short-url.'
                 })
              })
            })
          }
    })
    .catch(error => {
      response.status(500).json({
        error: 'There was an internal error retrieving the folders database. '
      })
    })
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app;
