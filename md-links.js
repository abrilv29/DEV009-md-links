const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const encontrarLinks = require('./hito1');
const validarLink = require('./hito2');

/* ----------------Crear una promesa y convertir la ruta absoluta ----------------*/
const mdLinks = (absolutaPath,validate) => {
  return new Promise((resolve, reject) => {
    // Convertir la ruta absoluta
    const convertAbsoluta = path.resolve(absolutaPath);
    // Verificamos si la ruta existe
    fs.access(convertAbsoluta)
      .then(() => {
        // Verificar que el archivo sea Markdown
		const extname = path.extname(convertAbsoluta);
		const markdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];

        if (markdownExtensions.includes(extname)) {
			// Leer el archivo
			return fs.readFile(convertAbsoluta, 'utf-8');
         
        } reject(new Error('El archivo no es Markdown'));
		// si no es el archivo markdown muestra el error
      })
      .then((contenido) => {
        const md = markdownIt();
        const html = md.render(contenido);

        // Encontrar los enlaces dentro del documento usando cheerio
        const links = encontrarLinks(html, convertAbsoluta);
        if (!validate) {
			// Si no se requiere validación, resolver con los links
			resolve(links);
		  } else {
			// Si se requiere validación, hacer solicitudes HTTP para validar los enlaces
			const linkPromises = links.map((link) => {
			  return validarLink(link);
			});
  
			Promise.all(linkPromises)
			  .then((validados) => {
				resolve(validados);
			  })
			  .catch((error) => {
				reject(error);
			  });
		  }
		})
		.catch((error) => {
		  reject(error);
		});
	});
}; // end mdLinks


module.exports = mdLinks;
