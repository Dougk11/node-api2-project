// require your server and launch it here

const server = require('./api/server')

const port = 9000;

server.listen(9000, () => {
    console.log('listening on port 9000')
})