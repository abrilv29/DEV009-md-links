const mdLinks = require("../hito1.js")// Asegúrate de proporcionar la ruta correcta al archivo mdLinks.js
const axios = require('axios');

/// Prueba básica para mdLinks sin validación
it('deberia retornar un array de objetos con enlaces = false', () => {
    return mdLinks('./fileMD/links.md', false).then((links) => {
      expect(links).toHaveLength(2); // Cambia el valor a 2 para reflejar el número correcto de enlaces
      expect(links[0]).toEqual(expect.objectContaining({
        href: expect.any(String),
        text: expect.any(String),
        file: expect.any(String),
      }));
    });
  });
  
  // Prueba para mdLinks con validación
 it('deberia retornar un array de objetos con enlaces validados = true', () => {
    // Mock para axios.head
    axios.head = jest.fn().mockResolvedValue({ status: 200 });
  
    return mdLinks('./fileMD/links.md', true).then((links) => {
      expect(links).toHaveLength(2); // Cambia el valor a 2 para reflejar el número correcto de enlaces
      expect(links[0]).toEqual(expect.objectContaining({
        href: expect.any(String),
        text: expect.any(String),
        file: expect.any(String),
        status: 200,
        ok: 'ok',
      }));
    });
  });
  