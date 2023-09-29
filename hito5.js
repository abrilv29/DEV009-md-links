/* ------------------Recursividad----------------------------------------------*/
const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const encontrarLinks = require('./hito1'); // Importa una función para encontrar links en HTML
const validarLink = require('./hito2'); // Importa una función para validar enlaces


const searchInDirectory = (directoryPath, options) => {
    return new Promise((resolve, reject) => {
      // Lee el contenido del directorio
      fs.readdir(directoryPath)
        .then((items) => {
          const results = []; // Almacena los resultados encontrados
  
          // Función auxiliar para procesar cada item en el directorio
          const processItem = (item) => {
            const itemPath = path.join(directoryPath, item);
  
            // Obtiene la información del item (archivo o directorio)
            return fs.stat(itemPath)
              .then((itemStat) => {
                if (itemStat.isDirectory()) {
                  // Si es un directorio, llama recursivamente a la función en ese directorio
                  return searchInDirectory(itemPath, options)
                    .then((subdirectoryResults) => {
                      results.push(...subdirectoryResults); // Agrega los resultados al resultado principal
                    });
                } else if (itemStat.isFile() && item.endsWith('.md')) {
                  // Si es un archivo Markdown, procesa el contenido
                  return fs.readFile(itemPath, 'utf-8')
                    .then((fileContent) => {
                      const md = markdownIt();
                      const lines = fileContent.split('\n');
                      const lineLinks = [];
  
                      // Procesa cada línea del archivo
                      lines.forEach((line, lineNumber) => {
                        const html = md.render(line); // Convierte el contenido Markdown a HTML
                        const links = encontrarLinks(html, itemPath, lineNumber + 1); // Encuentra los links en el HTML
                        lineLinks.push(...links); // Agrega los links encontrados en esta línea
                      });
  
                      results.push(...lineLinks); // Agrega los links de esta línea al resultado principal
  
                      if (options.validate) {
                        // Si se requiere validación, crea un array de promesas de validación para los links de esta línea
                        const linkPromises = lineLinks.map((link) => {
                          return validarLink(link); // Valida el enlace
                        });
  
                        // Espera a que todas las promesas de validación se resuelvan antes de continuar
                        return Promise.all(linkPromises);
                      }
  
                      return [];
                    });
                }
              });
          };
  
          const itemPromises = items.map((item) => {
            return processItem(item); // Procesa cada item del directorio
          });
  
          // Espera a que todas las promesas de procesamiento de items se resuelvan antes de continuar
          return Promise.all(itemPromises).then(() => {
            resolve(results); // Resuelve la promesa con los resultados una vez que se procesaron todos los items
          });
        })
        .catch((error) => {
          reject(error); // Rechaza la promesa si ocurre un error durante la lectura del directorio
        });
    });
  };

  module.exports = searchInDirectory;