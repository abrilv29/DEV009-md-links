#!/usr/bin/env node
const figlet = require('figlet');
const chalk = require('chalk');
const mdLinks = require('./index.js');
const yargs = require('yargs');
const cliBoxes = require('cli-boxes');

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

    let output;

    output = `${chalk.green('href:')} ${chalk.yellow(link.href)} \n`;
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
  mdLinks(ruta, { validate: true }) // No se necesita validación aquí
    .then((links) => {
      if (stats) {
        const totalLinks = links.length;
        const uniqueLinks = new Set(links.map((link) => link.href)).size;
        const boxStyle = cliBoxes.singleDouble; // Obtener el estilo de caja
        const labelWidth = 8;
        const boxedOutput =
        `${boxStyle.topLeft}${boxStyle.top.repeat(22)}${boxStyle.topRight}\n` +
        `${boxStyle.left}${`${chalk.cyanBright('Total:')}${chalk.cyan(totalLinks)}`.padEnd(50 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.left}${`${chalk.greenBright('Unique:')}${chalk.green(uniqueLinks)}`.padEnd(50 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.bottomLeft}${boxStyle.bottom.repeat(22)}${boxStyle.bottomRight}`;
        console.log(boxedOutput);
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
  mdLinks(ruta, { validate: true })
    .then((links) => {
      if (stats) {
        const totalLinks = links.length;
        const uniqueLinks = new Set(links.map((link) => link.href)).size;
        const brokenLinks = links.filter((link) => link.ok === 'fail').length; // Filtra los enlaces rotos

        const boxStyle = cliBoxes.singleDouble; // Obtener el estilo de caja
        const labelWidth = 8;
        const boxedOutput =
        `${boxStyle.topLeft}${boxStyle.top.repeat(22)}${boxStyle.topRight}\n` +
        `${boxStyle.left}${`${chalk.cyanBright('Total:')}${chalk.cyan(totalLinks)}`.padEnd(50 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.left}${`${chalk.greenBright('Unique:')}${chalk.green(uniqueLinks)}`.padEnd(50 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.left}${`${chalk.redBright('Broken:')}${chalk.red(brokenLinks)}`.padEnd(50 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.bottomLeft}${boxStyle.bottom.repeat(22)}${boxStyle.bottomRight}`;
        console.log(boxedOutput);
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