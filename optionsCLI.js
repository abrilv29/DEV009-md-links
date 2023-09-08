const argv = require('yargs')
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
  .argv;
