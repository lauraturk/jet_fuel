// on change store the value of folder form
// send value to server as folder for url

  const testFolder = $('#folder-form')

  let foldersArray = [{title: 'yellow', url:'llllll', 'popularity': 0, 'id': 1},
  {title: 'yellow', url:'llllll', 'popularity': 2, 'folder': 'color', 'id': 3},
  {title: 'blue', url:'llllll', 'popularity': 4, 'folder': 'color', 'id': 2},
  {title: 'red', url:'llllll', 'popularity': 1, 'folder': 'color', 'id': 4}]

  const urlList = (title) => {
    const foundFolder = foldersArray.filter((folder) => {
      return folder.folder === title
    })
    console.log(foundFolder);
    urlLister(foundFolder)
  }

  const urlLister = (folderObject) => {
    console.log(folderObject)
    // const listItem = folderObject.map((object) => {
    //   return (
    //     `<li>${object.url, object.title}</li>`
    //   )
    // })
    // return listItem
  }

  testFolder
  .on('change', (e) => {
    e.preventDefault()
    //on submit, grab value of folder select and use for server things

    $('.folder-title').replaceWith(`<div class = "folder-title"><h2>${e.target.value}</h2></div>`)
    $('.folder-title').append(`<ul>${urlList(e.target.value)}</ul>`)
    $('.folder-content').addClass('active')
  })
  .on('submit', (e) => {
    e.preventDefault();
  })

  const folderSorter = $('#folder-sort')

  const sortUrls = (objProperty) => {
    foldersArray.sort((a, b) => {
      return a[objProperty] - b[objProperty]
    })
  }

  folderSorter
  .on('change', (e) => {
    e.preventDefault()
    e.target.value === 'popularity' ? sortUrls('popularity') : sortUrls('id')

    console.log('value', e.target.value)
    console.log('sortedArray', foldersArray)
  })
