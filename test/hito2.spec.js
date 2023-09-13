const validarLink = require('../hito2.js'); // Ajusta la ruta según sea necesario
const axios = require('axios');

// Mockear Axios para simular respuestas
jest.mock('axios');

test('Debería validar un enlace existente con estado 200', () => {
  // Configurar el mock de Axios para simular una respuesta exitosa
  axios.head.mockResolvedValue({ status: 200 });

  const link = {
    href: 'https://www.ejemplo.com',
  };

  // Llamar a la función validarLink
  return validarLink(link).then((result) => {
    expect(result.status).toBe(200);
    expect(result.ok).toBe('ok');
  });
});

test('Debería validar un enlace inexistente con estado 404', () => {
  // Configurar el mock de Axios para simular una respuesta con estado 404
  axios.head.mockRejectedValue({ response: { status: 404 } });

  const link = {
    href: 'https://www.ejemplo.com/enlaceinexistente',
  };

  // Llamar a la función validarLink
  return validarLink(link).then((result) => {
    expect(result.status).toBe(404);
    expect(result.ok).toBe('fail');
  });
});
