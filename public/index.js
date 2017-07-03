let chosenFolderName = ''

$(document).ready(() =>{
  return getAllFolders()
})

const getAllFolders = () => {
  fetch('/api/v1/folders', {
    method: 'GET',
  })
  .then((data) => data.json())
  .then((folders) => {
    $('#folders-holder').append(`${renderFolders(folders)}`)
  })
  .catch(error => console.log(error))
}

const getUrlsByFolder = (folderId) =>{
  return fetch(`/api/v1/folders/${folderId}/urls`, {
    method: 'GET',
  })
  .then((data) => data.json())
  .then((urls) => {
    $('.folder-title').append(`${renderUrls(urls)}`)
    displayUrls()
  })
  .catch(error => console.log(error))
}

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
    .then((data) => console.log(data))
    .catch(error => console.log(error))
}

const visitIncrement = (target) => {
  return fetch(`/api/v1/urls/${target}/visits`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'}
  })
  .then((data) => console.log(data))
  .catch((error) => console.log(error))
}

const renderFolders = (folders) => {
  const printFolders = folders.map((folder) => {
    return `<div class = "retrieved-folder" id=${folder.id} data-name="${folder.folder_name}">
              <img src="./folder-icon.svg" class="folder-svg" alt="folder icon">
              <p>${folder.folder_name}</p>
            </div>`
  }).join(" ")
  return printFolders
}

const renderUrls = (urls) => {
  removeUrls()
  const printUrls = urls.map((url) => {
    return `<div class = "appended-url" data-popularity=${url.popularity} data-created_at=${url.created_at} >
              <h4>${url.title}</h4>
              <a id=${url.id} href=${url.shortened_url}>${url.shortened_url}</a>
            </div>`
  }).join(" ")
  return printUrls
}

const displayUrls = () => {
  const urlListLength = $('.folder-content').find('.appended-url').length

  $('.folder-content').addClass('active')
  // $('.url-inputs').addClass('active')
  urlListLength > 1 ? $('#folder-sort').removeClass('sort-remove').addClass('sort-active') :
    $('#folder-sort').addClass('sort-remove').removeClass('sort-active')
}

const removeUrls = () => {
  $('.folder-title').empty()
  $('#folder-sort').addClass('sort-remove').removeClass('sort-active')
}

const removeFolders = () => {
  $('#folders-holder').empty()
}

const clearInputs = () => {
  $('#folder-select').val('')
  $('#url').val('')
  $('#title').val('')
  $('.submit-url').prop('disabled', true)
  chosenFolderName = ''
  removeUrls()
}

const cleanUrls = () => {
  const foundUrls = $('.folder-content').find('.appended-url')
  const urlsKeys = (Object.keys(foundUrls).filter(key => key.length <= 2))

  return urlsKeys.map((key) => {
    return {
      id: parseInt(foundUrls[key].id),
      popularity: parseInt(foundUrls[key].dataset.popularity),
      created_at: parseInt(foundUrls[key].id),
      title: foundUrls[key].children[0].innerText,
      shortened_url: foundUrls[key].children[1].text
    }
  })
}

const sortUrls = (sortType) => {
  const urlsToSort = cleanUrls()

  let sortedUrls;

  if(urlsToSort[0][sortType] > urlsToSort[1][sortType]) {
    sortedUrls = urlsToSort.sort((a,b) => {
      return a[sortType] - b[sortType]
    })
  } else {
    sortedUrls = urlsToSort.sort((a, b) => {
      return  b[sortType] - a[sortType]
    })
  }
  $('.folder-title').append(`${renderUrls(sortedUrls)}`)
}

const isValid = (element, index, array) =>{
  return element !== ' ' && element !== ''
}

const urlValid = (url) =>{
  let modifiedUrl
  let regex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z‌​]{2,6}\b([-a-zA-Z0-9‌​@:%_\+.~#?&=]*)/g)

  if(!url.includes('http') && !url.includes('www.') && regex.test(url)){
    modifiedUrl = 'http://www.'.concat(url)
  } else if (!url.includes('http://') && regex.test(url)) {
    modifiedUrl = 'http://'.concat(url)
  } else if (regex.test(url)){
    modifiedUrl = url
  }

  return modifiedUrl
}

const enableCheck = () =>{
  const dataSubmit = $('#submit-url')
  const folderSelect = $('#folder-select')

  let regex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z‌​]{2,6}\b([-a-zA-Z0-9‌​@:%_\+.~#?&=]*)/g)

  let folder = folderSelect.val() || chosenFolderName.length
  let url = $('#url').val()
  let title = $('#title').val()

  if([folder, title].every(isValid) && regex.test(url)){
    dataSubmit.prop('disabled', false)
  } else {
    dataSubmit.prop('disabled', true)
  }
}

const successAlert = (title, folder) => {
  $('.success-alert').replaceWith(`<div class="success-alert" id>${title} added to ${folder}</div>`)
}

const clearSuccessAlert = () => {
  $('.success-alert').replaceWith('<div class="success-alert"></div>')
}

$('#url, #title, #folder-select').on('keyup', () =>{
  enableCheck()
  // clearSuccessAlert()
})

$('#folders-holder').on('click', '.retrieved-folder', function(e) {
  const parsedId = parseInt(this.id, 10)

  getUrlsByFolder(parsedId)
  return chosenFolderName = this.dataset.name
})

$('.folder-title').on('click', 'a', function(e) {
  visitIncrement(this.id)
})

$('.folder-content').on('click', (e) => sortUrls(e.target.value))

$('#submit-url').click((e) => {
  e.preventDefault()

  let folder = !$('#folder-select').val() ? chosenFolderName : $('#folder-select').val()
  let url = $('#url').val()
  let title = $('#title').val()

  if([url, folder, title].every(isValid)){
    let modifiedUrl = urlValid(url)

    addUrls(folder, modifiedUrl, title)
      .then(() => {
        successAlert(title, folder)
        removeFolders()
        getAllFolders()
      })
  }
  clearInputs()
})
