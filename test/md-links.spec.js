const mdLinks = require("../md-links.js");
const fs = require('fs/promises');
const path = require('path');

// Creamos el mock
jest.mock('fs/promises');

describe('mdLinks', () => {
  // Restaurar el comportamiento original de fs.promises después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería devolver los enlaces encontrados dentro del archivo Marckdown', async () => {
    const  fileContens = 'Contenido del archivo Markdown con [un enlace](https://example.com)';
    // simulas que se tiene acceso a la ruta
    fs.access.mockResolvedValue();
    // simulamos la lectura del archivo
    fs.readFile.mockResolvedValue(fileContens);
    const result = await mdLinks('./fileMD/links.md'); // Reemplaza con una ruta válida
    expect(result).toEqual([
      {
        href: 'https://example.com',
        text: 'un enlace',
        file: path.resolve('./fileMD/links.md'),
      },
    ]);

  });

  it('Debería mostrar un error si la ruta no es válida', async () => {
    // Configurar el comportamiento simulado de fs.promises
    fs.access.mockRejectedValue(new Error('Ruta no válida')); // Simula un error al acceder a la ruta

    try {
      await mdLinks('./ruta/ivalida'); // Reemplaza con una ruta válida
      // Debería arrojar una excepción, así que si llega aquí, la prueba fallará
    } catch (error) {
      expect(error.message).toBe('Ruta no válida');
    }
  });
  it('Debería mostrar un error si el archivo no es Markdown', async () => {
    // Configurar el comportamiento simulado de fs.promises
    fs.access.mockResolvedValue(); // Simula que la ruta es accesible
    fs.readFile.mockResolvedValue('Contenido de un archivo no Markdown'); // Simula la lectura del archivo

    try {
      await mdLinks('./fileMD/archivo.txt'); // Reemplaza con una ruta válida a un archivo no Markdown
      // Debería arrojar una excepción, así que si llega aquí, la prueba fallará
    } catch (error) {
      expect(error.message).toBe('El archivo no es Markdown');
    }
  });
  
});// end describe

