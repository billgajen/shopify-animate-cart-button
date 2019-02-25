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
	const server = new Koa();
	const router = new Router();

	server.use(session(server));
	server.keys = [SHOPIFY_API_SECRET_KEY];

	server.use(serve(__dirname + '/public'));

	router.post('/webhooks/products/create', bodyParser(), validateWebhook);

	router.get('/effects/select', bodyParser(), updateScriptTag);

	router.get('/', processPayment);

	server.use(
	  createShopifyAuth({
	    apiKey: SHOPIFY_API_KEY,
	    secret: SHOPIFY_API_SECRET_KEY,
	    scopes: ['read_products', 'write_products', 'read_script_tags', 'write_script_tags'],
	    async afterAuth(ctx) {
	        const { shop, accessToken } = ctx.session;
	        ctx.cookies.set('shopOrigin', shop, { httpOnly: false })

			const stringifiedBillingParams = JSON.stringify({
	         recurring_application_charge: {
	           name: 'Recurring charge',
	           price: 0.01,
	           return_url: TUNNEL_URL,
	           test: true
	         }
			});
			const stringifiedWebhookParams = JSON.stringify({
	          webhook: {
	            topic: 'products/create',
	            address: `${TUNNEL_URL}/webhooks/products/create`,
	            format: 'json',
	          },
			});
			const scriptTagBody = JSON.stringify({
	            script_tag: {
	                event: 'onload',
	                src: `${TUNNEL_URL}/js/gadjen_app.js`
	            },
			});
			const scriptTagHeaders = {
				'X-Shopify-Access-Token': accessToken,
				'Content-Type': 'application/json',
				'Accept': '*/*'
			};
			const options = {
	        	method: 'POST',
	        	body: stringifiedBillingParams,
	        	credentials: 'include',
	        	headers: {
	        	  'X-Shopify-Access-Token': accessToken,
	        	  'Content-Type': 'application/json',
	        	},
			};
			const addScriptTagOptions = {
	        	method: 'POST',
	        	credentials: 'include',
	        	body: scriptTagBody,
	        	headers: scriptTagHeaders,
	        	json: true
			};
			const webhookOptions = {
	        	method: 'POST',
	        	body: stringifiedWebhookParams,
	        	credentials: 'include',
	        	headers: {
	        	  'X-Shopify-Access-Token': accessToken,
	        	  'Content-Type': 'application/json',
	        	},
			};

	        fetch(`https://${shop}/admin/webhooks.json`, webhookOptions)
	          .then((response) => response.json())
	          .then((jsonData) =>
	            console.log('webhook response', JSON.stringify(jsonData)),
	          )
	          .catch((error) => console.log('webhook error', error));

	       	const confirmationURL = await fetch(
	         `https://${shop}/admin/recurring_application_charges.json`, options)
	         .then((response) => response.json())
	         .then((jsonData) => jsonData.recurring_application_charge.confirmation_url)
	         .catch((error) => console.log('error', error));
	         ctx.redirect(confirmationURL);

	       	fetch(`https://${shop}/admin/script_tags.json`, addScriptTagOptions)
	         .then((response) => response.json())
	         .then((jsonData) => 
	         	console.log(jsonData),
	         )
	         .catch((error) => console.log('error', error));
	    },
	  }),
	);

	server.use(graphQLProxy());
	server.use(router.routes());
	server.use(verifyRequest());
	server.use(async (ctx) => {
	    await handle(ctx.req, ctx.res);
	    ctx.respond = false;
	    ctx.res.statusCode = 200;
	    return
	});


	server.listen(port, () => {
	  console.log(`> Ready on http://localhost:${port}`);
	});
});