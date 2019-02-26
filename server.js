const Koa = require('koa');
const next = require('next');
require('isomorphic-fetch');

const bodyParser = require('koa-bodyparser');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, TUNNEL_URL } = process.env;


app.prepare().then(() => {
	const server = new Koa();

	server.use(session(server));

	server.listen(port, () => {
	  console.log(`> Ready on http://localhost:${port}`);
	});
});