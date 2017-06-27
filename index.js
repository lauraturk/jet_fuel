// on change store the value of folder form
// send value to server as folder for url

  const testFolder = $('#folder-form')

  let foldersArray = [{title: 'yellow', url:'llllll', 'popularity': 0, 'id': 1},
  {title: 'yellow', url:'llllll', 'popularity': 2, folder: 'color', 'id': 3},
  {title: 'blue', url:'llllll', 'popularity': 4, folder: 'color', 'id': 2},
  {title: 'red', url:'llllll', 'popularity': 1, folder: 'color', 'id': 4}]

  const urlList = (title) => {
    const foundFolder = foldersArray.filter((folder) => {
      return folder.folder === title
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

  testFolder
  .on('change', (e) => {
    e.preventDefault()
    //on submit, grab value of folder select and use for server things

    $('.folder-title').replaceWith(`<div class = "folder-title"><h2>${e.target.value}</h2></div>`)
    $('.folder-title').append(`<ul class = 'url-list'></ul>`)
    $('.folder-content').addClass('active')
    urlList(e.target.value)
  })
  .on('submit', (e) => {
    e.preventDefault();
  })

  const folderSorter = $('#folder-sort')
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
    console.log('sortedArray', foldersArray)
  })
