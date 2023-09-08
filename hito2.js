const axios = require('axios');

/* ----------------Hito 2  status de la ruta mediante http ----------------*/

// Función auxiliar para validar un enlace
const validarLink = (link) => {
	return new Promise((resolve) => {
	  axios.head(link.href)
		.then((response) => {
		  if (response.status >= 200 && response.status < 400) {
			link.status = 'ok';
			link.ok = true;
		  } else {
			link.status = 'fail';
			link.ok = false;
		  }
		  resolve(link);
		})
		.catch(() => {
		  link.status = 'fail';
		  link.ok = false;
		  resolve(link);
		});
	});
  };
  
  
module.exports = validarLink;