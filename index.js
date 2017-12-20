const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var shopifyAPI = require('shopify-node-api');

var Shopify = new shopifyAPI({
  shop: 'pollardschicken-com.myshopify.com', // MYSHOP.myshopify.com
  shopify_api_key: 'cb10241d405803d037ed2d06c4840015', // Your API key
  access_token: '0512819bc1724b742aabfcb605c97d12' // Your API password
});

  const idStore = [];

app.post('/order-recieved', function(req, res) {
   const faxOrders = [];
   const id = req.get('x-shopify-order-id');
   faxOrders.push(id)
   idStore.push(id)
   getDataFromShopify(id)
   res.send('success')
});

function getDataFromShopify(id) {
  console.log('getting data...')
  console.log(`This is the id: ${id}`);
  // make the api call to get the data
  Shopify.get('/admin/orders/' + id + '.json', function(err, data, headers) {
    console.log(data); // Data contains product json information
    console.log(headers); // Headers returned from request
    console.log(idStore);
    const Values = Object.values(data);
    const Keys = Object.keys(data);
    console.log("These are the Keys");
    console.log(Keys);

    console.log("These are the Values");
    console.log(Values);
    sendEmail()
  });
}


function sendEmail() {
console.log('sending Email...')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'matt@everyway.io',
    from: 'sendgrid@danielsnell.ninja',
    subject: 'Sending with SendGrid is Fun',
    text: 'Stuff Here',
    html: '<strong>Node.js is trying to send you a message</strong>',
  };
  sgMail.send(msg);
  console.log("Message Sent - Yay");
}

// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
