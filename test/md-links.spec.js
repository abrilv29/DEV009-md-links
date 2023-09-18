const mdLinks = require('../index.js');

describe('mdLinks', () => {
  it('debería encontrar y retornar los links en archivos .md en el directorio y subdirectorios (false)', () => {
    // Define el directorio de prueba y llama a mdLinks con validate = false
    return mdLinks('./fileMD', false).then((links) => {
      // Realiza las comprobaciones necesarias en los resultados
      expect(links).toHaveLength(23); // Ajusta este número según tus expectativas
      // Asegúrate de que los resultados tengan la estructura adecuada (href, text, file)
      expect(links[0]).toHaveProperty('href');
      expect(links[0]).toHaveProperty('text');
      expect(links[0]).toHaveProperty('file');
    });
  });

  it('debería encontrar y validar los links en archivos .md en el directorio y subdirectorios (true)', () => {
    // Define el directorio de prueba y llama a mdLinks con validate = true
    return mdLinks('./fileMD/', true).then((links) => {
      // Realiza las comprobaciones necesarias en los resultados
      expect(links).toHaveLength(23); // Ajusta este número según tus expectativas
      // Asegúrate de que los resultados tengan la estructura adecuada (href, text, file, status, ok)
      expect(links[0]).toHaveProperty('href');
      expect(links[0]).toHaveProperty('text');
      expect(links[0]).toHaveProperty('file');
      expect(links[0]).toHaveProperty('status');
      expect(links[0]).toHaveProperty('ok');
    });
  });

  it('debería rechazar la promesa si la ruta no existe', () => {
    // Define una ruta que no existe y llama a mdLinks
    return expect(mdLinks('./ruta-inexistente', false)).rejects.toThrowError('ENOENT: no such file or directory');
  });
  
});
