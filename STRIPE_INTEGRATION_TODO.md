# Stripe integration TODO

## Required setup

- Create a Stripe Payment Link in the Dashboard for the product or recurring plan.
- Paste the public Payment Link URL beginning with `https://buy.stripe.com/` into `STRIPE_PAYMENT_LINK` in `script.js`.
- No API keys, backend, webhook, Node server, or `.env` file are needed for this static Payment Link flow.

## Current product choice

- Configure tax and receipts directly on the Payment Link in Stripe Dashboard.
