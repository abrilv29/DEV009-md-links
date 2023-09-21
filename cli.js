#!/usr/bin/env node
const fs = require('fs/promises'); // Importa el módulo fs
const figlet = require('figlet');
const chalk = require('chalk');
const mdLinks = require('./index.js');
const yargs = require('yargs');
const cliBoxes = require('cli-boxes');

// Texto para la figura
const texto = 'MD - LINKS!!!';

// Colores de degradado
const colores = [chalk.red.bold, chalk.yellow.bold, chalk.green.bold, chalk.blue.bold, chalk.magenta.bold, chalk.cyan.bold];

// Función para imprimir el texto con un degradado de colores
function colorDegradado(texto, colores) {
  let figuraConColor = '';
  for (let i = 0; i < texto.length; i++) {
    const colorIndex = i % colores.length;
    figuraConColor += colores[colorIndex](texto[i]);
  }
  console.log(figuraConColor);
}

// Generar la figura con Figlet
figlet(texto, function (err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }

  // Imprimir la figura con degradado de colores
  colorDegradado(data, colores);
});

/*--------------------Menu de opciones para CLI -----------------------------------------------*/


// Configuración de yargs
yargs

.command('$0 <ruta>', chalk.green('     Encuentra y muestra los enlaces en archivos Markdown    '), (yargs) => {
  yargs.positional(chalk.cyan.bold('ruta'), {
    describe: chalk.hex('#6512B8').bold('Ruta al directorio o archivo Markdown'),
    type: 'string',
  });
})
.option(chalk.hex('#6512B8').bold('validate'), {
  alias: chalk.hex('#6512B8').bold('v'),
  describe: chalk.hex('#6512B8').bold('Validar los enlaces'),
  type: chalk.hex('#6512B8').bold('boolean'),
})
.option(chalk.hex('#6512B8').bold('stats'), {
  alias: chalk.hex('#6512B8').bold('s'),
  describe: chalk.hex('#6512B8').bold('Mostrar estadísticas de los enlaces unicos'),
  type: 'boolean',
})
.option(chalk.hex('#6512B8').bold('validate', 'stats'), {
  alias: chalk.hex('#6512B8').bold('v','s'),
  describe: chalk.hex('#6512B8').bold('Mostrar estadísticas de los enlaces rotos'),
  type: 'boolean',
})


.help().argv;

const { ruta, validate, stats } = yargs.argv;

 // Manejo de Errores para las rutas

const verificarRuta = async () => {
  try {
    const rutaStat = await fs.stat(ruta);
    if (rutaStat.isDirectory()) {
      // Verifica si el directorio está vacío
      const items = await fs.readdir(ruta);
      if (items.length === 0) {
        console.error('Error: Directorio vacío. No se encontraron archivos Markdown en el directorio.');
        process.exit(1);
      }
    } else if (!ruta.endsWith('.md')) {
      console.error(`Error: El archivo '${ruta}' no es un archivo Markdown.`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
// Llama a la función asíncrona para verificar la ruta
verificarRuta();


// Función para mostrar enlaces en un formato específico
const mostrarEnlaces = (links) => {
  console.log(chalk.blue(`
  ---------------------------------------------------------------------------

           M   O   S   T   R   A   R  * *  E   N  L   A   C   E   S
  
 --------------------------------------------------------------------------- 
  
  `));


  return links.map((link) => {
    let output;
  
    output = `${chalk.bgYellow.bold('href:')} ${chalk.yellow(link.href)} \n`;
    output += `${chalk.bgMagenta.bold('Text:')} ${chalk.magenta(link.text)} \n`;
    output += `${chalk.bgRgb(5,203,230).bold('File:')} ${chalk.hex('#05CBE6')(link.file)}\n`;
    output += `${chalk.bgRgb(162,51,255).bold('Line:')} ${chalk.hex('#A233FF').bold(link.line)}\n`; // Agregar la línea
 
    if (validate) {
      output += ` ${chalk.bgRedBright.bold('Status:')} ${chalk.red.bold(link.status)} \n`;
      output += ` ${chalk.bgGreenBright.bold('Ok:')} ${chalk.green.bold(link.ok)}\n`;
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
        `${boxStyle.left}${`${chalk.bgCyan.bold('Total  :')}${chalk.cyan(totalLinks)}`.padEnd(59 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.left}${`${chalk.bgGreenBright.bold('Unique :')}${chalk.green(uniqueLinks)}`.padEnd(60 - labelWidth, ' ')}${boxStyle.right}\n` +
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
        `${boxStyle.left}${`${chalk.bgCyan.bold('Total  :')}${chalk.cyan(totalLinks)}`.padEnd(59 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.left}${`${chalk.bgGreenBright.bold('Unique :')}${chalk.green(uniqueLinks)}`.padEnd(60 - labelWidth, ' ')}${boxStyle.right}\n` +
        `${boxStyle.left}${`${chalk.bgYellowBright.bold('Broken :')}${chalk.yellow(brokenLinks)}`.padEnd(60 - labelWidth, ' ')}${boxStyle.right}\n` +
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
  // Llama a la función mdLinks sin validación ni estadísticas
  mdLinks(ruta, { validate: false })
    .then((links) => {
      if (links.length === 0) {
        console.log('No se encontraron enlaces en el archivo o directorio especificado.');
      } else {
        const formattedLinks = mostrarEnlaces(links);
        formattedLinks.forEach((formattedLink) => console.log(formattedLink));
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
}
