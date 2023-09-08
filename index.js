#!/usr/bin/env node
const mdLinks = require('./hito3-1.js'); // Reemplaza './mdLinks' con la ruta correcta a tu función mdLinks
const argv = require('yargs').argv;
const chalk = require('chalk'); // Importar la biblioteca chalk

const path = argv._[0];
const validate = argv.validate || false;
const stats = argv.stats || false;

// Lógica para invocar mdLinks con los argumentos correctos
mdLinks(path, validate)
  .then((links) => {
    if (stats) {
      const totalLinks = links.length;
      const uniqueLinks = [...new Set(links.map((link) => link.href))].length;
      console.log(`Total de enlaces: ${totalLinks}`);
      console.log(`Enlaces únicos: ${uniqueLinks}`);
    } else {
      links.forEach((link) => {
        const statusMessage = validate ? (link.ok ? chalk.green('OK') : chalk.red('FAIL')) : '';
        console.log(`Ruta: ${link.file}, Texto: ${link.text}, Enlace: ${link.href}, Estado: ${statusMessage}`);
      });
    }
  })
  .catch((error) => {
    // Colorear mensajes de error en rojo
    console.error(chalk.red('Error:', error.message));
  });



/*const  mdLinks = require('./hito3-1.js');

//mdLinks('./fileMD/archivo.txt')
mdLinks('/Users/LENOVO/DEV009-md-links/',true)
.then(links => {
  console.log(links);
})
.catch(error => {
  console.error(error.message);
});*/

// llamamos la funcion de md-links

