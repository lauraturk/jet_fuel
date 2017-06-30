
let foldersArray = []
let urlsArray = []
const folderForm = $('#folder-form')
const folderSelect = $('#folder-select')
const dataSubmit = $('#submit-url')
const folderSorter = $('#folder-sort')
// const jetfuel = process.env.PORT

$(document).ready(() =>{
  fetch('/api/v1/folders', {
    method: 'GET',
  })
    .then((data) => data.json())
    .then((folders) => {
      foldersArray = folders
      folders.forEach((folder) => {
        $('#folders').append(`<option value="${folder.folder_name}"/>`)
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
  return fetch(`/api/v1/folders/${folderId}/urls`, {
  method: 'GET',
  })
  .then((data) => data.json())
  .catch(error => console.log(error))
}

const addUrls = (folder, url, urlTitle) =>{
  return fetch('/api/v1/folders/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "folder_name": `${folder}`,
      "original_url": `${url}`,
      "title": `${urlTitle}`
    })
  })
    .then((response) => console.log(response))
    .catch(error => console.log(error))
}

folderForm
.on('change', (e) => {
  e.preventDefault()
  let folderVal = folderSelect.val()

  let matchFolder = foldersArray.find((folder) =>{
    return folder.folder_name.toString() === folderVal.trim()
  })

  if(matchFolder){
    $('.folder-title').replaceWith(`<div class = "folder-title">
                                      <p>Selected Folder:</p>
                                      <h2>${e.target.value}</h2>
                                    </div>`)
    getUrlsByFolder(matchFolder.id)
      .then((urls) =>{
        urlsArray = urls
        $('.folder-title').append(`<div class = 'url-list'></div>`)
        urlList(urls)
      })
      .catch((error) => console.log(error))
    $('.folder-content').addClass('active')
    $('.url-inputs').addClass('active')
    $('#folder-sort').removeClass('sort-remove').addClass('sort-active')
  } else if (!matchFolder) {
    $('.folder-title').replaceWith(`<div class = "folder-title">
                                      <p>Create New Folder:</p>
                                      <h2>${e.target.value}</h2>
                                    </div>`)
    $('.folder-content').addClass('active')
    $('#folder-sort').addClass('sort-remove').removeClass('sort-active')
    $('.url-inputs').addClass('active')
  }
})
.on('submit', (e) => {
  e.preventDefault();
})

dataSubmit.click((e)=>{
  e.preventDefault()
  let folder = folderSelect.val()
  let url = $('#url').val()
  let title = $('#title').val()

  addUrls(folder, url, title)

    .then(() =>{
      let matchFolder = foldersArray.find((arrFolder) =>{
        return arrFolder.folder_name.toString() === folder.trim()
      })

      if (matchFolder){
        getUrlsByFolder(matchFolder.id)
        .then((urls) =>{
          console.log(urls, 'in matchFolder line 112')
          let urlAddOn = urls[urls.length-1].urlAddOn
          let shortUrl = urls[urls.length-1].shortened_url
          $('.url-list').append(`<div class= 'appended-url'>
                                  <div>
                                    <h4>Title: </h4>
                                    <p>${urls[urls.length-1].title}</p>
                                  </div>
                                  <div>
                                    <h4>ShortLink: </h4>
                                    <a href='${urlAddOn}/${shortUrl}'>${urlAddOn}/${shortUrl}</a>
                                  </div>`)
        })
        .catch((error) => console.log(error))
      }
    })
})

$('#url, #title, #folder-select').on('keyup', () =>{
  enableCheck()
})

folderSorter
.on('change', (e) => {
  e.preventDefault()
  e.target.value === 'popularity' ? sortUrls('popularity') : sortUrls('created_at')
})

const sortUrls = (sortType) => {
  let urls = urlsArray
  let sortedUrls = urls.sort((a, b) => {
    return a[sortType] - b[sortType]
  })
  removeUrls()
  urlSorter(sortedUrls)
}

const urlSorter = () => {
  urlsArray.forEach((url) => {
    $('.url-list').append(`<div class= 'appended-url'>
                            <div>
                              <h4>Title: </h4>
                              <p>${url.title}</p>
                            </div>
                            <div>
                              <h4>ShortLink: </h4>
                              <p>${url.shortened_url}</p>
                            </div>`)
  })
}

const urlList = (urls) =>{
  urls.forEach((url) =>{
    let urlAddOn = url.urlAddOn
    let shortUrl = url.shortened_url

    $('.url-list').append(`<div class= 'appended-url'>
                            <div>
                              <h4>Title: </h4>
                              <p>${url.title}</p>
                            </div>
                            <div>
                              <h4>ShortLink: </h4>
                              <a href='${urlAddOn}/${shortUrl}'>${urlAddOn}/${shortUrl}</a>
                            </div>`)


    // $('.url-list').append(`<div class= 'appended-url'>
    //                         <div>
    //                           <h4>Title: </h4>
    //                           <p>${url.title}</p>
    //                         </div>
    //                         <div>
    //                           <h4>ShortLink: </h4>
    //                           <p>${url.shortened_url}</p>
    //                         </div>`)
  })
}

const removeUrls = () =>{
  $('.url-list').empty()
}

const enableCheck = () =>{
  let folder = folderSelect.val()
  let url = $('#url').val()
  let title = $('#title').val()

  if(folder.length > 0 && url.length > 0 && title.length > 0){
    dataSubmit.prop('disabled', false)
  } else {
    dataSubmit.prop('disabled', true)
  }
}
