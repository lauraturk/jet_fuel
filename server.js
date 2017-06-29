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

const createUrl = (url, folderId) =>{
  return database('urls').insert({original_url: url.original_url, folder_id: folderId, title: url.title}, 'id')
}

app.post('/api/v1/folders', (request, response) => {
  const data = request.body;

  for(let requiredParameter of ['folder_name', 'title', 'original_url']){
    if(!data[requiredParameter]){
      return response.status(422).json({
        error: `Expected format requires a Folder Name, a URL Title, and a URL. You are missing a ${requiredParameter} property`
      })
    } else if (data.folder_name.includes(" ")) {
      return response.status(422).json({
        error: `Expected format requires a Folder Name, a URL Title, and a URL. The Folder Name attribute must be one word, without spaces. `
      })
    }
  }

  ///// code to check if multiple similarly named folders.
  // database('folders').where('folder_name', data.folder_name).select()
  //   .then((folder_name) => {
  //     return response.status(409).json({
  //       error: `The Folder called ${folder_name} already exists. Please try a different folder name.`
  //     })
  //   })

  database('folders').insert({folder_name: data.folder_name}, 'id')
    .then((folderId) => {
      createUrl(data, folderId[0])
        .then((urlId) => {
          response.status(201).json({id: urlId[0]})
        })
        .catch((error) => {
          response.status(500).json({ error })
        })
      response.status(201).json({id: folderId[0]})
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})


//app.get('/:shortened_url', (request, response) =>{
  //database('urls').where('shortened_url' request.params.shortened_url).select()
    //.then((short_url) =>{
      //response.goto(original_url)
      // window.location.href = 'your link'
      //res.redirect(309, 'your/404/path.html');
    //})
    //.catch((error) =>{
      //response.status(500).json({error})
    //})
  //})
//})


app.use(express.static('public'))

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
