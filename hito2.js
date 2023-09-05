const axios = require('axios');

/* ----------------Hito 2  status de la ruta mediante http ----------------*/

// Función auxiliar para validar un enlace
function validarLink(link) {
	return axios
	  .head(link.href)
	  .then((response) => {
		return {
		  href: link.href,
		  text: link.text,
		  file: link.file,
		  status: response.status,
		  ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail',
		};
	  })
	  .catch((error) => {
		link.status = error.response ? error.response.status : 404;
		link.ok = 'fail';
		return link;
	  });
  }
  
module.exports = validarLink;