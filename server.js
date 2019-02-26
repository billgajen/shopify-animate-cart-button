const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const serve = require('koa-static');
require('isomorphic-fetch');
const Router = require('koa-router');
dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const updateScriptTag = require('./server/router-script_tag');
const processPayment = require('./server/router');
const validateWebhook = require('./server/webhooks');

const bodyParser = require('koa-bodyparser');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, TUNNEL_URL } = process.env;


app.prepare().then(() => {

	server.listen(port, () => {
	  console.log(`> Ready on http://localhost:${port}`);
	});
});