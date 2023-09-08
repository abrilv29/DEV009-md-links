const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const encontrarLinks = require('./hito1');
const validarLink = require('./hito2');

const mdLinks = (absolutaPath, validate) => {
  return new Promise((resolve, reject) => {
    // Convertir la ruta absoluta
    const convertAbsoluta = path.resolve(absolutaPath);

    // Verificamos si la ruta existe
    fs.access(convertAbsoluta)
      .then(() => {
        // Leer la información del archivo o directorio
        return fs.stat(convertAbsoluta);
      })
      .then((stats) => {
        if (stats.isDirectory()) {
          // Si es un directorio, leer los archivos dentro de él
          return fs.readdir(convertAbsoluta);
        } else if (stats.isFile() && path.extname(convertAbsoluta) === '.md') {
          // Si es un archivo Markdown válido, leer su contenido
          return fs.readFile(convertAbsoluta, 'utf-8')
            .then((contenido) => {
              const md = markdownIt();
              const html = md.render(contenido);
              const links = encontrarLinks(html, convertAbsoluta);

              if (!validate) {
                resolve(links);
              } else {
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
            });
        } else {
          reject(new Error('El archivo/directorio no es válido.'));
        }
      })
      .then((files) => {
        // Si es un directorio, procesar los archivos .md dentro de él
        if (Array.isArray(files)) {
          const linkPromises = [];

          files.forEach((file) => {
            const filePath = path.join(convertAbsoluta, file);
            const extname = path.extname(filePath);

            if (extname === '.md') {
              linkPromises.push(
                fs.readFile(filePath, 'utf-8')
                  .then((contenido) => {
                    const md = markdownIt();
                    const html = md.render(contenido);
                    const links = encontrarLinks(html, filePath);

                    if (!validate) {
                      return links;
                    } else {
                      const validatedLinks = links.map((link) => {
                        return validarLink(link);
                      });

                      return Promise.all(validatedLinks);
                    }
                  })
              );
            }
          });

          Promise.all(linkPromises)
            .then((results) => {
              const allLinks = validate ? [].concat(...results) : results;
              resolve(allLinks);
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
};

module.exports = mdLinks;
