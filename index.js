// on change store the value of folder form
// send value to server as folder for url

  const testFolder = $('#folder-form')

  testFolder
  .on('change', (e) => {
    e.preventDefault()
    //on submit, grab value of folder select and use for server things
    $('.folder-title').replaceWith(`<div class = "folder-title"><h2>${$('.target').val()}</h2></div>`)
    $('.folder-content').addClass('active')
  })
  .on('submit', (e) => {
    e.preventDefault();
  })
