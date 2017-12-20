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
    console.log("Order Information");
    console.log(Object.values(data.order));
    console.log("Note Attributes");
    console.log(Object.values(data.order.note_attributes));

  });
}

sls config credentials --provider aws --key AKIAI2LZJSKN4GPEYL3A --secret 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


function formatData(Values) {

  console.log("Grabbing Values");
  console.log(Values);

}

const Send_Local = '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';

function sendEmail() {
console.log('Preparing Email!')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY || Send_Local );
const msg = {
    to: 'hi@danielsnell.ninja',
    from: 'sendgrid@danielsnell.ninja',
    subject: 'Pollards Chicken Test',
    text: 'Order Information:',
    html: '<strong>Insert Order Info Here</strong>',
  };
  console.log("Order information sent successfully - You've got mail!");
  sgMail.send(msg);
}

// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
