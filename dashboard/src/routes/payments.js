const stripe = require("stripe")(process.env.STRIPE_SECRET);
const express = require('express');
const path = require('path');
const axios = require('axios');
const {Client} = require('pg');
const router = express.Router();
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.urlencoded({ extended: true }));
//router.use(express.json());

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log("User is logged in.");
        //console.log(req.user);
        //console.log(req.user.discordId)
        next();
    }
    else {
        console.log("User is not logged in.");
        res.redirect('/auth');
    }
}



router.use("/success", isAuthorized, async (req, res) => {
  res.render('checkout-success');
})


router.post('/create-customer-portal-session', async (req, res) => {
   const results = await axios({
    method: 'get',
    url: 'https://api.stripe.com/v1/customers',
    params:{
      email: req.user.email
    },
    headers:{
      Authorization: `Bearer ${process.env.STRIPE_SECRET}`
    }
  });
    // Authenticate your user.
    const session = await stripe.billingPortal.sessions.create({
      customer: results.data.data[0].id,
      return_url: 'http://localhost:1832/dashboard',
    });
  
    res.redirect(session.url);
  });

router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
    const endpointSecret = "whsec_d7fcb1086308d7555ee29c0dfa1e99bff00113cdcc48d278b58500cfad436c1e";
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const client = new Client({
      user: process.env.user,
      host: process.env.host,
      database: process.env.db,
      password: process.env.passwd,
      port: process.env.port,
    }); 
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
          console.log(`PaymentIntent was successful! ${paymentIntentSucceeded.id}`);
        break;
      // ... handle other event types
      case "checkout.session.completed":
        const session = event.data.object;
        // Fulfill the purchase...
        client.connect();
        const query = `UPDATE public.allowed_guilds SET premium= true WHERE guild_id = ${session.client_reference_id};`
        client.query(query);
        client.end();
        console.log(`Guild Id: ${session.client_reference_id} was successfully upgraded to premium!`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

module.exports = router;