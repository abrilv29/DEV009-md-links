const fs = require('fs/promises');
const searchInDirectory = require('./hito5');
const processFile = require('./hito3');

const mdLinks = (absolutaPath, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.stat(absolutaPath)
      .then((stats) => {
        if (stats.isDirectory()) {
          searchInDirectory(absolutaPath, options)
            .then((results) => {
              resolve(results);
            })
            .catch((error) => {
              reject(error);
            });
        } else if (stats.isFile() && absolutaPath.endsWith('.md')) {
          processFile(absolutaPath, options)
            .then((results) => {
              resolve(results);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error('La entrada no es un directorio ni un archivo Markdown válido.'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = mdLinks;
