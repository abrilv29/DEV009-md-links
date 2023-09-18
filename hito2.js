const axios = require('axios');

/* ----------------Hito 2  status de la ruta mediante http ----------------*/
// Función auxiliar para validar un enlace
function validarLink(link) {
	return axios
	  .head(link.href)
	  .then((response) => {
		link.status = response.status; // Establecer el código de estado HTTP
		link.ok = response.status >= 200 && response.status < 400 ? 'ok' : 'fail'; // Marcar como 'ok' o 'fail' según el código de estado
		return link;
	  })
	  .catch((error) => {
		link.status = error.response ? error.response.status : 404; // Marcar como 404 si no se puede acceder al enlace
		link.ok = 'fail'; // Marcar como enlace roto
		return link;
	  });
  }
  

module.exports = validarLink;