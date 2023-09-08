const fs = require('fs/promises');
const path = require('path');
const markdownIt = require('markdown-it');
const encontrarLinks = require('./hito1');
const validarLink = require('./hito2');

const mdLinks = (absolutaPath, validate) => {
  return fs.stat(absolutaPath)
    .then((stats) => {
      if (stats.isDirectory()) {
        return fs.readdir(absolutaPath)
          .then((files) => {
            const promises = files.map((file) => {
              const filePath = path.join(absolutaPath, file);
              const extname = path.extname(file);

              if (extname) {
                return fs.readFile(filePath, 'utf-8')
                  .then((contenido) => {
                    if (extname === '.md') {
                      const md = markdownIt();
                      const html = md.render(contenido);
                      const links = encontrarLinks(html, filePath);

                      if (validate) {
                        const linkPromises = links.map((link) => validarLink(link));
                        return Promise.all(linkPromises);
                      } else {
                        return links;
                      }
                    } else {
                      // Para otros tipos de archivos, simplemente devolvemos el contenido
                      return {
                        file: filePath,
                        content: contenido,
                      };
                    }
                  });
              }
            });

            return Promise.all(promises)
              .then((results) => results.flat());
          });
      } else {
        const extname = path.extname(absolutaPath);

        if (extname === '.md') {
          return fs.readFile(absolutaPath, 'utf-8')
            .then((contenido) => {
              const md = markdownIt();
              const html = md.render(contenido);
              const links = encontrarLinks(html, absolutaPath);

              if (validate) {
                const linkPromises = links.map((link) => validarLink(link));
                return Promise.all(linkPromises);
              } else {
                return links;
              }
            });
        } else {
          throw new Error('El archivo no es Markdown');
        }
      }
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = mdLinks;
