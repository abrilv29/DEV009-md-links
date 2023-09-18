const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const encontrarLinks = require('./hito1'); // Importa una función para encontrar links en HTML
const validarLink = require('./hito2'); // Importa una función para validar enlaces

const mdLinks = (absolutaPath, validate) => {
  return new Promise((resolve, reject) => {
    // Función recursiva para buscar en un directorio y sus subdirectorios
    const buscarEnDirectorio = (directoryPath) => {
      return fs
        .readdir(directoryPath) // Lee el contenido del directorio
        .then((items) => {
          const results = []; // Almacena los resultados encontrados

          const processItem = (item) => {
            const itemPath = path.join(directoryPath, item); // Obtiene la ruta completa del item
            return fs.stat(itemPath).then((itemStat) => {
              if (itemStat.isDirectory()) {
                // Si es un directorio, llama recursivamente a la función en ese directorio
                return buscarEnDirectorio(itemPath).then((subdirectoryResults) => {
                  results.push(...subdirectoryResults); // Agrega los resultados al resultado principal
                });
              } else if (itemStat.isFile() && item.endsWith('.md')) {
                // Si es un archivo .md, procesa el contenido
                return fs.readFile(itemPath, 'utf-8').then((fileContent) => {
                  const md = markdownIt();
                  const html = md.render(fileContent); // Convierte el contenido Markdown a HTML
                  const links = encontrarLinks(html, itemPath); // Encuentra los links en el HTML

                  if (!validate) {
                    // Si no se requiere validación, agrega los links al resultado
                    results.push(...links);
                  } else {
                    // Si se requiere validación, valida los enlaces y luego agrega los resultados
                    const linkPromises = links.map((link) => {
                      return validarLink(link); // Valida el enlace
                    });

                    return Promise.all(linkPromises).then((validados) => {
                      results.push(...validados); // Agrega los resultados validados al resultado principal
                    });
                  }
                });
              }
            });
          };

          const itemPromises = items.map((item) => {
            return processItem(item); // Procesa cada item del directorio
          });

          return Promise.all(itemPromises).then(() => {
            return results; // Retorna los resultados una vez que se procesaron todos los items
          });
        })
        .catch((error) => {
          throw error; // Lanza cualquier error que ocurra durante el proceso
        });
    };

    const convertAbsoluta = path.resolve(absolutaPath); // Convierte la ruta a absoluta

    fs.access(convertAbsoluta) // Verifica si la ruta existe
      .then(() => {
        return buscarEnDirectorio(convertAbsoluta); // Llama a la función para buscar en el directorio
      })
      .then((links) => {
        resolve(links); // Resuelve la promesa con los links encontrados
      })
      .catch((error) => {
        reject(error); // Rechaza la promesa si ocurre un error
      });
  });
};

module.exports = mdLinks;
