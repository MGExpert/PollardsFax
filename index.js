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


app.post('/order-recieved', function(req, res) {
   const faxOrders = [];
   const id = req.get('x-shopify-order-id');
   faxOrders.push(id)
   sendFax(id)
   res.send('success')
});

function sendFax(id) {
  console.log('sending fax...')
  // make the api call to send the fax
}

// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
