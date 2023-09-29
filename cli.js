#!/usr/bin/env node
const fs = require('fs'); // Importa el módulo fs
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

/*------------------ --------------------------OPTION WITH YARGS ----------------------------------------------*/

const argv = yargs
  .usage(`Usage: ${chalk.cyan('$0')} ${chalk.green('<path>')} [options]`)
  .demandCommand(1, chalk.red('You must specify a path to a file or directory.'))
  .options({
    validate: {
      describe: chalk.magenta('Validate links'),
      boolean: true,
    },
    stats: {
      describe: chalk.cyan('Show link statistics'),
      boolean: true,
    },
  })
  .help()
  .alias('h', 'help')
  .argv;


  
  const path = argv._[0];
  
  // Verifica si la ruta existe
  if (!fs.existsSync(path)) {
    console.error('La ruta especificada no existe.');
    process.exit(1); // Sale del programa con un código de error
  }



  // Si la ruta es válida, continúa con el procesamiento
  

const options = {
  validate: argv.validate || false,
  stats: argv.stats || false,
};

mdLinks(path, options)
  .then((results) => {
    if (options.validate && options.stats) {
      // --validate y --stats juntos
      console.log('Links validados y estadísticas:');
      console.log(chalk.bgCyan.bold('Total de links:'), chalk.cyan(results.length));
      console.log(chalk.bgGreenBright.bold('Links únicos:'), chalk.green(new Set(results.map((link) => link.href)).size));
      console.log(chalk.bgYellowBright.bold('Links rotos:'), chalk.yellow(results.filter((link) => link.status !== 200).length));
    } else if (options.validate) {
      // Solo --validate
      console.log('Links validados:');
      results.forEach((link) => {
        console.log(`${chalk.bgYellow.bold('href:')} ${chalk.yellow(link.href)}`);
        console.log(`${chalk.bgMagenta.bold('Text:')} ${chalk.magenta(link.text)}`);
        console.log(`${chalk.bgRgb(5,203,230).bold('File:')} ${chalk.hex('#05CBE6')(link.file)}`);
        console.log(`${chalk.bgRgb(162,51,255).bold('Line:')} ${chalk.hex('#A233FF').bold(link.line)}`); // Agregar la línea
        console.log(`${chalk.bgRedBright.bold('Status:')} ${chalk.red.bold(link.status)}`);
        console.log(`${chalk.bgGreenBright.bold('Ok:')} ${chalk.green.bold(link.ok)}`);
        console.log('---');
        
      });
    } else if (options.stats) {
      // Solo --stats
    
      console.log(chalk.yellow('Estadísticas de links:'));
      console.log(chalk.bgCyan.bold('Total de links:'), chalk.cyan(results.length));
      console.log(chalk.bgGreenBright.bold('Links únicos:'), chalk.green(new Set(results.map((link) => link.href)).size));
    
    }
    
    else {
      // Sin opciones adicionales
      console.log(' Links encontrados ');
      results.forEach((link) => {
        console.log(`${chalk.bgYellow.bold('href:')} ${chalk.yellow(link.href)}`);
        console.log(`${chalk.bgMagenta.bold('Text:')} ${chalk.magenta(link.text)}`);
        console.log(`${chalk.bgRgb(5,203,230).bold('File:')} ${chalk.hex('#05CBE6')(link.file)}`);
        console.log('---');
      });
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
