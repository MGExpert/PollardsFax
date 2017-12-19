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
   var body = req.body
   res.set('Content-Type', 'text/plain')
   res.send(`You sent: ${body} to Express`);
   const getHeader = req.get('x-shopify-order-id');
   Shopify.get(`/admin/orders/${getHeader}`, query_data, function(err, data, headers){
     console.log(data); // Data contains product json information
     console.log(headers); // Headers returned from request
   });
});


// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
