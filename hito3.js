/*-----------------------------------------------------------------------*/
const fs = require('fs/promises');
const markdownIt = require('markdown-it');
const encontrarLinks = require('./hito1'); // Importa una función para encontrar links en HTML
const validarLink = require('./hito2'); // Importa una función para validar enlaces

const processFile = (filePath, options) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8')
        .then((fileContent) => {
          const md = markdownIt();
          const lines = fileContent.split('\n');
          const lineLinks = [];
  
          // Procesa cada línea del archivo
          lines.forEach((line, lineNumber) => {
            const html = md.render(line); // Convierte el contenido Markdown a HTML
            const links = encontrarLinks(html, filePath, lineNumber + 1); // Encuentra los links en el HTML
            lineLinks.push(...links); // Agrega los links encontrados en esta línea
          });
  
          const result = lineLinks;
  
          if (options.validate) {
            // Si se requiere validación, crea un array de promesas de validación para los links de esta línea
            const linkPromises = lineLinks.map((link) => {
              return validarLink(link); // Valida el enlace
            });
  
            // Espera a que todas las promesas de validación se resuelvan antes de continuar
            Promise.all(linkPromises)
              .then((validationResults) => {
                // Agrega los resultados de la validación al resultado final
                result.forEach((link, index) => {
                  link.status = validationResults[index].status;
                  link.ok = validationResults[index].ok;
                });
                resolve(result);
              })
              .catch((error) => {
                reject(error); // Rechaza la promesa si ocurre un error durante la validación
              });
          } else {
            // Si no se requiere validación, resuelve la promesa directamente con los resultados
            resolve(result);
          }
        })
        .catch((error) => {
          reject(error); // Rechaza la promesa si ocurre un error durante la lectura del archivo
        });
    });
  };

  module.exports = processFile;