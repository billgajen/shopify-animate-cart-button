const http = require('http');
const Koa = require('koa');

const port = parseInt(process.env.PORT, 10) || 3000;

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, TUNNEL_URL } = process.env;


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
