const mdLinks = require('../index.js');
const validarLink = require('../hito2.js');
const path = require('path');

/*describe('mdLinks', () => {
  // Prueba para el caso en el que se resuelve la promesa
  it('Debería resolver con los enlaces si el archivo Markdown es válido', () => {
    const absolutePath = path.resolve(__dirname, 'C:/Users/LENOVO/DEV009-md-links/fileMD/links.md'); // Reemplaza con la ruta de un archivo Markdown válido
    return mdLinks(absolutePath, false).then((result) => {
      // Realiza aserciones en el resultado
      expect(Array.isArray(result)).toBe(true);
      // Agrega más aserciones según sea necesario
    });
  });



  

});*/



describe('mdLinks', () => {
  test('Debe devolver un array de objetos con propiedades "href", "text" y "file"', () => {
    return mdLinks('C:/Users/LENOVO/DEV009-md-links/fileMD/', false).then((result) => {
      // Normaliza las rutas de archivo en el resultado esperado
      const expected = [
        {
          href: 'https://www.google.com',
          text: 'enlace a Google',
          file: path.normalize('C:/Users/LENOVO/DEV009-md-links/fileMD/links.md'),
        },
        {
          href: 'https://www.wikipedia.org',
          text: 'enlace a Wikipedia',
          file: path.normalize('C:/Users/LENOVO/DEV009-md-links/fileMD/links.md'),
        },
        // Agrega más objetos de prueba según sea necesario
      ];
  
      expect(result).toEqual(expected);
    });
  });
  
  test('Debe validar los enlaces si se pasa la opción "validate"', () => {
    return mdLinks('C:/Users/LENOVO/DEV009-md-links/fileMD/links.md', true).then((result) => {
      // Normaliza las rutas de archivo en el resultado esperado
      const expected = [
        {
          file: path.normalize('C:/Users/LENOVO/DEV009-md-links/fileMD/links.md'),
          href: 'https://www.google.com',
          ok: 'ok', // Ajusta esto según el resultado real
          status: 200, // Ajusta esto según el resultado real
          text: 'enlace a Google',
        },
        {
          file: path.normalize('C:\\Users\\LENOVO\\DEV009-md-links\\fileMD\\links.md'),
          href: 'https://www.wikipedia.org',
          ok: 'ok', // Ajusta esto según el resultado real
          status: 200, // Ajusta esto según el resultado real
          text: 'enlace a Wikipedia',
        },
        // Agrega más objetos de prueba según sea necesario
      ];
  
      expect(result).toEqual(expected);
    });
  });

});


  


