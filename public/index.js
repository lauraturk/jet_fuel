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
    console.log(urls)
    $('.folder-title').append(`${renderUrls(urls)}`)
    displayUrls()
  })
  .catch(error => console.log(error))
}

const renderFolders = (folders) => {
  const printFolders = folders.map((folder) => {
    return `<div class = "retrieved-folder" id=${folder.id}>
              <img src="./folder-icon.svg" class="folder-svg" alt="folder icon">
              <p>${folder.folder_name}<p>
            </div>`
  }).join(" ")
  return printFolders
}

const renderUrls = (urls) => {
  removeUrls()
  const printUrls = urls.map((url) => {
    return `<div class = "appended-url" id=${url.id} data-popularity=${url.popularity} data-created_at=${url.created_at} >
              <h4>${url.title}</h4>
              <a href=${url.shortened_url}>${url.shortened_url}</a>
            </div>`
  }).join(" ")
  return printUrls
}

const displayUrls = () => {
  $('.folder-content').addClass('active')
  // $('.url-inputs').addClass('active')
  console.log($('.folder-content').find('.appended-url').length)
  const urlListLength = $('.folder-content').find('.appended-url').length
  urlListLength > 1 ? $('#folder-sort').removeClass('sort-remove').addClass('sort-active') :
    $('#folder-sort').addClass('sort-remove').removeClass('sort-active')
}

const removeUrls = () =>{
  $('.folder-title').empty()
}

const sortUrls = (sortType) => {
  // console.log('urlsToSort', parseInt(urlsToSort[1].id))
  // console.log('div pop', parseInt(urlsToSort[1].dataset.popularity))
  // console.log('div created at', urlsToSort[1].dataset.created_at)
  // console.log('div title', urlsToSort[1].children[0].innerText)
  // console.log('div link', urlsToSort[1].children[1].text)

  const foundUrls = $('.folder-content').find('.appended-url')
  const urlsKeys = (Object.keys(foundUrls).filter(key => key.length <= 2))

  const urlsToSort = urlsKeys.map((key) => {
    return {
      id: parseInt(foundUrls[key].id),
      popularity: parseInt(foundUrls[key].dataset.popularity),
      created_at: foundUrls[key].dataset.created_at,
      title: foundUrls[key].children[0].innerText,
      shortened_url: foundUrls[key].children[1].text
    }
  })

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

  console.log(sortedUrls, 'sorted Urls')
  $('.folder-title').append(`${renderUrls(sortedUrls)}`)
}

$('#folders-holder').on('click', '.retrieved-folder', function(e) {
  const parsedId = parseInt(this.id, 10)
  getUrlsByFolder(parsedId)
})

$('.folder-content').on('click', function(e){
  sortUrls(e.target.value)
})
