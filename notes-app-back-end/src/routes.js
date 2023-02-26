const { addNoteHandler, getAllNotesHandler } = require('./handlers');

const routes = [
    {
      method: 'POST',
      path: '/notes',
      handler: addNoteHandler,
    },
    {
      method: 'GET',
      path: '/notes',
      handler: getAllNotesHandler,
    },
  ];
   
  module.exports = routes;