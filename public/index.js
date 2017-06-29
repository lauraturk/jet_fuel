// on change store the value of folder form
// send value to server as folder for url
$(document).ready(() =>{
  fetch('/api/v1/folders', {
    method: 'GET',
  })
    .then((data) => data.json())
    .then((folders) => {
      console.log(folders)
      foldersArray = folders
      folders.forEach((folder) => {
        $('#folders').append(`<option value = ${folder.folder_name}>${folder.folder_name}</option>`)
      })
    })
    .catch(error => console.log(error))
})

const getAllUrls = () =>{
  fetch('/api/v1/urls', {
    method: 'GET',
  })
    .then((data) => data.json())
    .then((urls) => {
      console.log(urls)
    })
    .catch(error => console.log(error))
}

const getUrlsByFolder = (folderId) =>{
    fetch(`/api/v1/folders/${folderId}/urls`, {
    method: 'GET',
    })
    .then((data) => data.json())
    .then((urls) => {
      urlsArray = urls
    })
    .catch(error => console.log(error))
}

const addUrls = (folder, url, urlTitle) =>{
  fetch('/api/v1/folders/', {
    method: 'POST',
    header: {"content-type":"application/json"},
    body: {
      "folder_name": `${folder}`,
      "original_url": `${url}`,
      "title": `${urlTitle}`
    }
  })
    .then((response) => console.log(response))
    .catch(error => console.log(error))
}

let foldersArray
let urlsArray
const folderForm = $('#folder-form')
const folderSelect = $('#folder-select')
const dataSubmit = $('#submit-url')
const folderSorter = $('#folder-sort')

folderForm
.on('change', (e) => {
  e.preventDefault()
  console.log(folderSelect.val())

  let matchFolder = foldersArray.find((folder) =>{
    return folder.folder_name === folderSelect.val()
  })
  getUrlsByFolder(matchFolder.id)

  console.log(matchFolder)

  $('.folder-title').replaceWith(`<div class = "folder-title"><h2>${e.target.value}</h2></div>`)
  $('.folder-title').append(`<ul class = 'url-list'></ul>`)
  $('.folder-content').addClass('active')

  console.log(urlsArray)
  // urlList(e.target.value)
})
.on('submit', (e) => {
  e.preventDefault();
})

dataSubmit.click(()=>{
  let folder = folderSelect.val()
  let url = $('#url').val()
  let title = $('#title').val()

  addUrls(folder, url, title)
})

const removeUrls = () =>{
  $('.url-list').empty()
}

const sortUrls = (objProperty) => {
  foldersArray.sort((a, b) => {
    return a[objProperty] - b[objProperty]
  })
  removeUrls()
  urlLister(foldersArray)
}

folderSorter
.on('change', (e) => {
  e.preventDefault()
  e.target.value === 'popularity' ? sortUrls('popularity') : sortUrls('id')

  console.log('value', e.target.value)
})

const urlList = (title) => {
  const foundFolder = foldersArray.filter((folder) => {
    return folder.folder_name === title
  })
  console.log(foundFolder);
  return urlLister(foundFolder)
}

const urlLister = (folderObject) => {
  console.log(folderObject)
  folderObject.forEach((object) => {
    console.log(object.title)
    $('.url-list').append(`<li>${object.url}, ${object.title}</li>`)
    // $('.url-list').append(`<li> ITEM HERE </li>`)
  })
}
