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
    console.log("Order Details Obtained!")
    const OrderDetails = Object.values(data.order);
    const NoteValues = Object.values(data.order.note_attributes);
    formatData(OrderDetails, NoteValues);
  });
}

function formatData(OrderDetails, NoteValues) {

  console.log("Checking Data");
  console.log(`These are the details: ${OrderDetails}`);
  console.log("This is the raw order details");
  console.log(OrderDetails);
  console.log(`These are the Note Details ${NoteValues}`);
  console.log('These are the raw note values');
  console.log(NoteValues);
  const OrderValues = Object.values(OrderDetails);
  const NoteNewValues = Object.values(NoteValues);
  console.log("Extract Objects ...... ");
  console.log('Order Objects');
  console.log(OrderValues);

  console.log('Note Objects');
  console.log(NoteNewValues);
   // OrderDetails.map((item) => {
   //
   //   const testSubject = `You have a new order! ID: ${item.id}`;
   //   const testBody = `${item.id}`;
   //   sendEmail(testSubject, testBody);
   // });


}

const Send_Local = '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';

function sendEmail(testSubject, testBody) {
console.log('Preparing Email!')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY || Send_Local );
const msg = {
    to: 'hi@danielsnell.ninja',
    from: 'sendgrid@danielsnell.ninja',
    subject: `${testSubject}`,
    text: 'Order Information:',
    html: `<div><strong>Order ID:</strong> ${testBody}</div>`,
  };
  console.log("Order information sent successfully - You've got mail!");
  sgMail.send(msg);
}

// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
