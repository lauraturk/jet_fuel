
let foldersArray = []
let urlsArray = []
const folderForm = $('#folder-form')
const folderSelect = $('#folder-select')
const dataSubmit = $('#submit-url')
const folderSorter = $('#folder-sort')
const shortUrl = $('.short-url')

// $(document).ready(() =>{
//   fetch('/api/v1/folders', {
//     method: 'GET',
//   })
//     .then((data) => data.json())
//     .then((folders) => {
//       foldersArray = folders
//       folders.forEach((folder) => {
//         $('#folders').append(`<option value="${folder.folder_name}"/>`)
//       })
//     })
//     .catch(error => console.log(error))
// })

// const getAllUrls = () =>{
//   fetch('/api/v1/urls', {
//     method: 'GET',
//   })
//     .then((data) => data.json())
//     .then((urls) => {
//       console.log(urls)
//     })
//     .catch(error => console.log(error))
// }

// const getUrlsByFolder = (folderId) =>{
//   return fetch(`/api/v1/folders/${folderId}/urls`, {
//   method: 'GET',
//   })
//   .then((data) => data.json())
//   .catch(error => console.log(error))
// }

const addUrls = (folder, url, urlTitle) =>{
   return fetch('/api/v1/folders/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      folder_name: `${folder}`,
      original_url: `${url}`,
      title: `${urlTitle}`
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

  if([url, folder, title].every(isValid)){

    let modifiedUrl = urlValid(url)

    addUrls(folder, modifiedUrl, title)
      .then(() =>{
      let matchFolder = foldersArray.find((arrFolder) =>{
        return arrFolder.folder_name.toString() === folder.trim()
      })

      if (matchFolder){
        getUrlsByFolder(matchFolder.id)
        .then((urls) =>{
          console.log(urls, 'in matchFolder line 112')
          let shortUrl = urls[urls.length-1].shortened_url
          $('.url-list').append(`<div class= 'appended-url'>
            <div>
              <h4>Title: </h4>
              <p>${urls[urls.length-1].title}</p>
            </div>
            <div>
              <h4>ShortLink: </h4>
              <a href= ${shortUrl} id ='test-button' class="short-url">/${shortUrl}</a>
            </div>`)
        })
        .catch((error) => console.log(error))
      }
    })
  }

  folderSelect.val('')
  $('#url').val('')
  $('#title').val('')
})

$('#url, #title, #folder-select').on('keyup', () =>{
  enableCheck()
})

// folderSorter
// .on('change', (e) => {
//   e.preventDefault()
//   sortUrls(e.target.value)
// })



$('.folder-title').find('click',(e) =>{
  console.log(e.target.innerText)
  // getAllUrls()
  //   .then((urls) =>{
  //     let match = urls.find((url)=>{
  //       return url.shortened_url === e.target.value
  //     })
  //   })
  // updatePopularity(e.target.value)
})

// const urlList = (urls) =>{
//   urls.forEach((url) =>{
//     let shortUrl = url.shortened_url
//     $('.url-list').append(`<div class= 'appended-url'>
//       <div>
//         <h4>Title: </h4>
//         <p>${url.title}</p>
//       </div>
//       <div>
//         <h4>ShortLink:</h4>
//         <a href= ${shortUrl} id ='test-button' class="short-url">/${shortUrl}</a>
//       </div>`)
//   })
// }

// const removeUrls = () =>{
//   $('.url-list').empty()
// }
//
// const sortUrls = (sortType) => {
//   let urls = urlsArray
//   let sortedUrls = urls.sort((a, b) => {
//     return  b[sortType] - a[sortType]
//   })
//   removeUrls()
//   urlList(sortedUrls)
// }

const updatePopularity = (shortened_url) =>{
  fetch('api/v1/urls/popularity', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      shortened_url: `${shortened_url}`
    })
  }).then((response) => console.log(response))
    .catch((error) => console.log(error))
}

// const isValid = (element, index, array) =>{
//   return element !== ' ' && element !== ''
// }
//
// const urlValid = (url) =>{
//   let modifiedUrl
//   let regex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z‌​]{2,6}\b([-a-zA-Z0-9‌​@:%_\+.~#?&=]*)/g)
//
//   if(!url.includes('http') && !url.includes('www.') && regex.test(url)){
//     modifiedUrl = 'http://www.'.concat(url)
//   } else if (!url.includes('http://') && regex.test(url)) {
//     modifiedUrl = 'http://'.concat(url)
//   } else if (regex.test(url)){
//     modifiedUrl = url
//   }
//
//   return modifiedUrl
// }
//
// const enableCheck = () =>{
//
//   let regex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z‌​]{2,6}\b([-a-zA-Z0-9‌​@:%_\+.~#?&=]*)/g)
//
//   let folder = folderSelect.val()
//   let url = $('#url').val()
//   let title = $('#title').val()
//
//   if([folder, title].every(isValid) && regex.test(url)){
//     dataSubmit.prop('disabled', false)
//   } else {
//     dataSubmit.prop('disabled', true)
//   }
// }
