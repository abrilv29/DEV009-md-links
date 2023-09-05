const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const cheerio = require('cheerio'); // Importa cheerio
const axios = require('axios');

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

// Función auxiliar para validar un enlace
function validarLink(link) {
	return axios
	  .head(link.href)
	  .then((response) => {
		return {
		  href: link.href,
		  text: link.text,
		  file: link.file,
		  status: response.status,
		  ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail',
		};
	  })
	  .catch((error) => {
		return {
		  href: link.href,
		  text: link.text,
		  file: link.file,
		  status: 0,
		  ok: 'fail',
		};
	  });
  }
  

module.exports = mdLinks;
