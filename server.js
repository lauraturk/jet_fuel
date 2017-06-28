const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
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
      response.status(500).json({error})
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
      response.status(500).json({error})
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
      response.status(500).json({error})
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
      response.status(500).json({error})
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
      response.status(500).json({error})
    })
})

app.post('/api/v1/folders', (request, response) => {
  
})





app.use(express.static('public'))

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
