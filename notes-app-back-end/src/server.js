console.log('Hallo kita akan membuat RESTful API');

const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 8000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://notesapp-v1.dicodingacademy.com/'],
                // 'http://notesapp-v1.dicodingacademy.com:80/'
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();