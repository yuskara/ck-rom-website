import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const stripe = process.env.STRIPE_RESTRICTED_KEY ? new Stripe(process.env.STRIPE_RESTRICTED_KEY) : null;
const json = (response, status, body) => { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(body)); };
const readBody = async (request) => { const chunks = []; for await (const chunk of request) chunks.push(chunk); return Buffer.concat(chunks).toString('utf8'); };

const createCheckoutSession = async (request, response) => {
  if (!stripe || !process.env.STRIPE_PRICE_ID) return json(response, 503, { error: 'Checkout is not configured yet.' });
  const origin = process.env.PUBLIC_SITE_URL || `http://localhost:${port}`;
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID);
  const session = await stripe.checkout.sessions.create({
    mode: price.type === 'recurring' ? 'subscription' : 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    automatic_tax: { enabled: process.env.STRIPE_TAX_ENABLED === 'true' },
    billing_address_collection: 'required',
    success_url: `${origin}/?payment=success#contact`,
    cancel_url: `${origin}/?payment=cancelled#payment`
  });
  return json(response, 200, { url: session.url });
};

const handleWebhook = async (request, response) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return json(response, 503, { error: 'Webhook is not configured yet.' });
  const payload = await readBody(request);
  let event;
  try { event = stripe.webhooks.constructEvent(payload, request.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET); }
  catch (error) { return json(response, 400, { error: `Invalid webhook signature: ${error.message}` }); }
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    if (session.payment_status !== 'unpaid') console.log(`Stripe payment received: ${session.id}`);
  } else if (event.type === 'checkout.session.async_payment_failed') console.warn(`Stripe payment failed: ${event.data.object.id}`);
  return json(response, 200, { received: true });
};

const serveStatic = async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host || `localhost:${port}`}`).pathname;
  const requested = pathname === '/' ? '/index.html' : pathname;
  const safePath = normalize(requested).replace(/^\.\.(\/|\\|$)/, '');
  try {
    const filePath = join(root, safePath);
    const body = await readFile(filePath);
    const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' }[extname(filePath)] || 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` }); response.end(body);
  } catch { response.writeHead(404); response.end('Not found'); }
};

http.createServer(async (request, response) => {
  try {
    if (request.method === 'POST' && request.url === '/api/create-checkout-session') return await createCheckoutSession(request, response);
    if (request.method === 'POST' && request.url === '/api/stripe-webhook') return await handleWebhook(request, response);
    if (request.method === 'GET') return await serveStatic(request, response);
    return json(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error('Stripe request failed:', error.type || 'Error', error.code || '', error.message || '');
    return json(response, 500, { error: error.code ? `Stripe error (${error.code}): ${error.message}` : 'Unexpected server error. Check the terminal running npm start.' });
  }
}).listen(port, () => console.log(`CK-ROM site running at http://localhost:${port}`));
