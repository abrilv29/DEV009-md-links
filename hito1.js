const cheerio = require('cheerio'); // Importa cheerio

/*---------------------Hito 1  encontrar links dentro del archivo markdown -----------------------------------------*/

// Función auxiliar para encontrar los links dentro del contenido HTML
function encontrarLinks(html, absolutaPath,lineNumbrer) {
  const $ = cheerio.load(html); // Carga el HTML con cheerio
  const links = [];

  $('a').each((index, element) => {
    const href = $(element).attr('href');
    const text = $(element).text();
    links.push({
      href,
      text,
      file: absolutaPath,
      line:lineNumbrer,
    });
  });

  return links;
}

module.exports = encontrarLinks;

