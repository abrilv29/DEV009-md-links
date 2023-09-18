const validarLink = require('../hito2.js'); // Ajusta la ruta según sea necesario
const axios = require('axios');

// Mockear Axios para simular respuestas
/*jest.mock('axios');

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
});*/



// Mockear la función axios.head para simular respuestas HTTP
jest.mock('axios');

describe('validarLink', () => {
  it('debería retornar un objeto con status "ok" para una URL válida', async () => {
    // Mockear la respuesta HTTP exitosa
    axios.head.mockResolvedValue({ status: 200 });

    const urlPrueba = {
      href: 'https://www.ejemplo.com', // Reemplaza esto con la URL que deseas probar
    };

    const resultado = await validarLink(urlPrueba);

    expect(resultado.ok).toBe('ok');
  });

  it('debería retornar un objeto con status "fail" para una URL inaccesible', async () => {
    // Mockear una respuesta HTTP con error
    axios.head.mockRejectedValue({ response: { status: 404 } });

    const urlPrueba = {
      href: 'https://www.ejemplo.com/url-invalida', // Reemplaza esto con una URL que generará un error
    };

    const resultado = await validarLink(urlPrueba);

    expect(resultado.ok).toBe('fail');
  });

  it('debería marcar como "fail" si no se puede acceder al enlace', async () => {
    // Mockear una respuesta HTTP con error
    axios.head.mockRejectedValue({ response: { status: 500 } });

    const urlPrueba = {
      href: 'https://www.ejemplo.com/enlace-inaccesible', // URL inaccesible
    };

    const resultado = await validarLink(urlPrueba);

    expect(resultado.ok).toBe('fail');
  });
});
