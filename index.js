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
            let lineLinks = [];
            const itemPath = path.join(directoryPath, item);
            // Obtiene la ruta completa del item
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
                  const lines = fileContent.split('\n');

                  const lineLinkPromises = lines.map((line, lineNumbrer) => {
                    const html = md.render(line); // Convierte el contenido Markdown a HTML
                    const links = encontrarLinks(html, itemPath, lineNumbrer + 1); // Encuentra los links en el HTML
                    results.push(...links); // Agregar los links encontrados al resultado

                  
                    if (validate) {
                      // Si se requiere validación, crea un array de promesas de validación para los links de esta línea
                      const linkPromises = links.map((link) => {
                        return validarLink(link); // Valida el enlace
                      });

                      return Promise.all(linkPromises); // Retorna un array de promesas de validación
                    }

                    return [];
                  });

                  // Espera a que todas las promesas de validación se resuelvan antes de continuar
                  return Promise.all(lineLinkPromises);
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
