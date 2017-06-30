const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const knex = require('knex')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


const encodeUrl = require('./shortener')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)

process.env.DOMAIN = 'http://localhost:3000/api'
// const jet_fuel = `${process.env.DOMAIN}/api`

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

addUrl = (urlArray) => {
  const keys = Object.keys(urlArray)
  return keys.map(url => {
  return Object.assign({}, urlArray[url], {urlAddOn: process.env.DOMAIN})
  })
}

app.get('/api/v1/folders/:id/urls', (request, response) => {
  database('urls').where('folder_id', request.params.id).select()
    .then((urls) => {
      if(urls.length){
        // console.log(Object.keys(urls))
        // console.log(addUrl(urls), 'before json')
        response.status(200).send(addUrl(urls))
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

// const incrementUrl = (data) => {
//   console.log(data)
//   // const { id } = data[0].id
//   // app.get('/api/')
// }


app.post('/api/v1/urls/:id', (req, res) => {
  const { id } = req.params
  database('urls').where('id', id).increment('popularity', 1)
  .then((data) => console.log(data))
  .catch((error) => console.log(error))
})


const redirectUrl = (req, res) => {
  console.log('here? redirectme', req);
  const { short_url } = req.params
  return database('urls').where('shortened_url', short_url).select()
    .then((data) => {
      database('')
      if(data.length){
        return response.redirect(301, `${data[0].original_url}`)
      } else {
        return response.status(404).json({
          error: 'Page not found'
        })
      }
    })
}

app.get('/api/:short_url', (request, response) =>{
  // const { short_url } = request.params
  redirectUrl(request, response)
  // increasePopularity(request, response)
  // return database('urls').where('shortened_url', '=', short_url).select()
  // // .then(() => database('urls').where('shortened_url', short_url).increment('popularity', 1))
  //   .then((data) => {
  //     if(data.length){
  //       console.log('im here', data)
  //       // incrementUrl(data)
  //       return response.redirect(301, `${data[0].original_url}`)
  //     } else {
  //       return response.status(404).json({
  //         error: 'Page not found'
  //       })
  //     }
  //   })
    .catch((error) =>{
      response.status(500).json({error})
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
  let modifiedUrl

  if(!url.original_url.includes('http') && !url.original_url.includes('www.')){
    modifiedUrl = 'http://www.'.concat(url.original_url)
    // console.log(modifiedUrl)
  } else if (!url.original_url.includes('http')) {
    modifiedUrl = 'http://'.concat(url.original_url)
    // console.log(modifiedUrl)
  } else {
    modifiedUrl = url.original_url
  }

  return database('urls').insert({original_url: modifiedUrl,
                                  folder_id: folderId,
                                  title: url.title,
                                  popularity: 0}, 'id')
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
            response.status(500).json({error})
          })
      } else {
        createUrl(data, match.id)
          .then((urlId) => {
            createShortUrl(urlId)
              .then((shortened_url) => {
                response.status(201).json({ url: `${jet.fuel}${shortened_url}` })
              })
              .catch((error) => {
                response.status(500).json({ error })
              })
            })
          }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.use(express.static('public'))

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app;
