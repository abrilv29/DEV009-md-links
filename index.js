const  mdLinks = require('./hito1.js');

// mdLinks('./fileMD/archivo.txt')
mdLinks('./fileMD/links.md',true)
.then(links => {
  console.log(links);
})
.catch(error => {
  console.error(error.message);
});


// llamamos la funcion de md-links

