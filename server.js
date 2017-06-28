const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Jet Fuel'

app.locals.folders = [{
  folder: 'cool links',
  id: '1'
}]

app.locals.urls = [{
  title: 'title here',
  id: '1',
  folder_id: '1',
  original_url: 'poop.com',
  shortened_url: 'p.com'
},
{
  title: 'title here',
  id: '2',
  folder_id: '1',
  original_url: 'poop.com',
  shortened_url: 'p.com'
}]

app.get('/api/v1/folders', (request, response) => {
  // const folders = response.body
  response.send(app.locals.folders)
})

app.get('/api/v1/urls/:folder_id', (request, response) => {
  // const folders = response.body
  response.send(app.locals.urls)
})

app.get('/api/v1/urls/:id', (request, response) => {
  const { id } =request.params
  const url = app.locals.urls[id]

  if(!url) {
    return response.sendStatus(404)
  }

  response.status(200).json({ id, url })
})

app.get('/api/v1/folders/:id', (request, response) => {
  const { id } = request.params
  const folder = app.locals.folders[id]

  if(!folder) {
    return response.sendStatus(404)
  }
  response.status(200).json({ id, folder })
})

app.post('/api/v1/folders', (request, response) => {
  const { folder, title, url } = request.body
  const id = Date.now()

  if(!folder) {
    return response.status(422).send({
      error: 'No Folder Selected'
    })
  }

  app.locals.folders[id] = folder
  response.status(201).json({ id, folder, title, url })

})

app.use(express.static('public'))

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
