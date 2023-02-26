const { addNoteHandler } = require('./handlers');

const routes = [
    {
      method: 'POST',
      path: '/notes',
      handler: addNoteHandler,
    },
  ];
   
  module.exports = routes;