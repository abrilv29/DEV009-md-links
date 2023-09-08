#!/usr/bin/env node
const figlet = require('figlet');
const chalk = require('chalk');
const mdLinks = require('./hito3-1.js');
const yargs = require('yargs');

// Título de la CLI
figlet('MD - LINKS!!!', function (err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }

  const figuraConColor = chalk.blue(data);
  console.log(figuraConColor);
});

/*--------------------Menu de opciones para CLI -----------------------------------------------*/

// Configuración de yargs
yargs
  .command('$0 <ruta>', 'Encuentra y muestra los enlaces en archivos Markdown', (yargs) => {
    yargs.positional('ruta', {
      describe: 'Ruta al directorio o archivo Markdown',
      type: 'string',
    });
  })
  .option('validate', {
    alias: 'v',
    describe: 'Validar los enlaces',
    type: 'boolean',
  })
  .option('stats', {
    alias: 's',
    describe: 'Mostrar estadísticas de los enlaces',
    type: 'boolean',
  })
 
  .help().argv;

const { ruta, validate, stats } = yargs.argv;

// Función para mostrar enlaces en un formato específico
const mostrarEnlaces = (links) => {
  return links.map((link) => {
    let output = `${chalk.green('href:')} ${chalk.yellow(link.href)} \n`;
    output += `${chalk.green('Text:')} ${chalk.magenta(link.text)} \n`;
    output += `${chalk.green('File:')} ${chalk.cyan(link.file)}\n`;

    if (validate) {
      output += ` ${chalk.green('Status:')} ${chalk.red(link.status)} \n`;
      output += ` ${chalk.green('Ok:')} ${chalk.blue(link.ok)}\n`;
    }
    return output;
  });
};

const optionValidate = (ruta) => {
  mdLinks(ruta, { validate })
    .then((links) => {
      const formattedLinks = mostrarEnlaces(links);
      formattedLinks.forEach((formattedLink) => console.log(formattedLink));
    })
    .catch((error) => {
      console.error(error.message);
    });
};

const optionStats = (ruta) => {
  mdLinks(ruta, { validate: false }) // No se necesita validación aquí
    .then((links) => {
      if (stats) {
        const totalLinks = links.length;
        const uniqueLinks = new Set(links.map((link) => link.href)).size;
        console.log(`${chalk.cyanBright('Total:')} ${chalk.cyan(totalLinks)}`);
        console.log(`${chalk.greenBright('Unique:')} ${chalk.green(uniqueLinks)}`);
      } else {
        const formattedLinks = mostrarEnlaces(links);
        formattedLinks.forEach((formattedLink) => console.log(formattedLink));
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
};

const optionValidateStats = (ruta) => {
    mdLinks(ruta, { validate })
      .then((links) => {
        if (stats) {
          const totalLinks = links.length;
          const uniqueLinks = new Set(links.map((link) => link.href)).size;
  
          // Filtrar los enlaces rotos (FAIL)
          const brokenLinks = links.filter((link) => link.status === 'fail').length;
  
          console.log(`${chalk.cyanBright('Total:')} ${chalk.cyan(totalLinks)}`);
          console.log(`${chalk.greenBright('Unique:')} ${chalk.green(uniqueLinks)}`);
          console.log(`${chalk.redBright('Broken:')} ${chalk.red(brokenLinks)}`);
        } else {
          const formattedLinks = mostrarEnlaces(links);
          formattedLinks.forEach((formattedLink) => console.log(formattedLink));
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  
  
// Determina qué función llamar según las opciones
if (validate && stats) {
  optionValidateStats(ruta);
} else if (validate) {
  optionValidate(ruta);
} else if (stats) {
  optionStats(ruta);
} else {
  // Si no se especifica ninguna opción, muestra los enlaces sin validación ni estadísticas
  mdLinks(ruta, { validate: false })
    .then((links) => {
      const formattedLinks = mostrarEnlaces(links);
      formattedLinks.forEach((formattedLink) => console.log(formattedLink));
    })
    .catch((error) => {
      console.error(error.message);
    });
}
