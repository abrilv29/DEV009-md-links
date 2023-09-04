const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const cheerio = require('cheerio'); // Importa cheerio

/* ----------------Crear una promesa y convertir la ruta absoluta ----------------*/
const mdLinks = (absolutaPath) => {
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

        // Responder con los links
        resolve(links);
      })
      .catch((error) => {
        reject(error);
      });
  });
}; // end mdLinks

// Función auxiliar para encontrar los links dentro del contenido HTML
function encontrarLinks(html, absolutaPath) {
  const $ = cheerio.load(html); // Carga el HTML con cheerio
  const links = [];

  $('a').each((index, element) => {
    const href = $(element).attr('href');
    const text = $(element).text();
    links.push({
      href,
      text,
      file: absolutaPath,
    });
  });

  return links;
}

module.exports = mdLinks;
