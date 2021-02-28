let navlinks = $('.navbar-nav .nav-link')
navlinks.click((ev)=>{
    console.log($(ev.target).attr('data-components'));
    let componentsURL = `/components/${$(ev.target).attr('data-components')}.html`
    $('#content').load(componentsURL)
})