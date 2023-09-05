const  mdLinks = require('./md-links.js');

//mdLinks('./fileMD/archivo.txt')
mdLinks('./fileMD/links.md',true)
.then(links => {
  console.log(links);
})
.catch(error => {
  console.error(error.message);
});

/*mdLinks('./fileMD/', true, (error, result) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Resultado:', result); 
  }
});*/
// llamamos la funcion de md-links

