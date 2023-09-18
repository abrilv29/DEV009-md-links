const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const encontrarLinks = require('./hito1');
const validarLink = require('./hito2');


const mdLinks = (absolutaPath, validate) => {
  return new Promise((resolve, reject) => {
    const buscarEnDirectorio = (directoryPath) => {
      return fs
        .readdir(directoryPath)
        .then((items) => {
          const results = [];

          const processItem = (item) => {
            const itemPath = path.join(directoryPath, item);
            return fs.stat(itemPath).then((itemStat) => {
              if (itemStat.isDirectory()) {
                return buscarEnDirectorio(itemPath).then((subdirectoryResults) => {
                  results.push(...subdirectoryResults);
                });
              } else if (itemStat.isFile() && item.endsWith('.md')) {
                return fs.readFile(itemPath, 'utf-8').then((fileContent) => {
                  const md = markdownIt();
                  const html = md.render(fileContent);
                  const links = encontrarLinks(html, itemPath);

                  if (!validate) {
                    results.push(...links);
                  } else {
                    const linkPromises = links.map((link) => {
                      return validarLink(link);
                    });

                    return Promise.all(linkPromises).then((validados) => {
                      results.push(...validados);
                    });
                  }
                });
              }
            });
          };

          const itemPromises = items.map((item) => {
            return processItem(item);
          });

          return Promise.all(itemPromises).then(() => {
            return results;
          });
        })
        .catch((error) => {
          throw error;
        });
    };

    const convertAbsoluta = path.resolve(absolutaPath);

    fs.access(convertAbsoluta)
      .then(() => {
        return buscarEnDirectorio(convertAbsoluta);
      })
      .then((links) => {
        resolve(links);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = mdLinks;
