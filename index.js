const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Moment = require('moment');


app.use(bodyParser.urlencoded({ extended: true }));

var shopifyAPI = require('shopify-node-api');

var Shopify = new shopifyAPI({
  shop: process.env.SHOPIFY_STORE_URI, // MYSHOP.myshopify.com
  shopify_api_key: process.env.SHOPIFY_API_KEY, // Your API key
  access_token: process.env.SHOPIFY_API_PASSWORD // Your API password
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

const Stores = [
  {
    "id": "1269890",
    "address": "8370 Tidewater Drive",
    "fax": "7575877466@metrofax.com"
  },
  {
    "id": "1269891",
    "address": "1924 Centerville Turnpike",
    "fax": "7572281870@metrofax.com"
  },
  {
    "id": "1269892",
    "address": "3545 Buckner Blvd",
    "fax": "7574160018@metrofax.com"
  },
  {
    "id": "1269893",
    "address": "100 London Bridge Shopping Center",
    "fax": "7573401487@metrofax.com"
  },
  {
    "id": "1269894",
    "address": "6523 College Park Square",
    "fax": "7574242157@metrofax.com"
  },
  {
    "id": "1269895",
    "address": "3033 Ballentine Blvd",
    "fax": "7578584079@metrofax.com"
  },
  {
    "id": "1269896",
    "address": "405 S. Witchduck Road",
    "fax": "7575199029@metrofax.com"
  },
  {
    "id": "1269897",
    "address": "717 Battlefield Blvd. S.",
    "fax": "7575469921@metrofax.com"
  },
  {
    "id": "1269898",
    "address": "4806 George Washington Hwy",
    "fax": "7573923984@metrofax.com"
  },
  {
    "id": "1269899",
    "address": "2316 Virginia Beach Blvd",
    "fax": ""
  },
  {
    "id": "1270737",
    "address": "8370 Tidewater Drive Catering",
    "fax": ""
  },
  {
    "id": "1270738",
    "address": "1924 Centerville Turnpike Catering",
    "fax": ""
  },
  {
    "id": "1270739",
    "address": "3545 Buckner Blvd Catering",
    "fax": ""
  },
  {
    "id": "1270740",
    "address": "100 London Bridge Shopping Center Catering",
    "fax": ""
  },
  {
    "id": "1270741",
    "address": "6523 College Park Square Catering",
    "fax": ""
  },
  {
    "id": "1270742",
    "address": "3033 Ballentine Blvd Catering",
    "fax": ""
  },
  {
    "id": "1270743",
    "address": "405 S. Witchduck Road Catering",
    "fax": ""
  },
  {
    "id": "1270744",
    "address": "717 Battlefield Blvd. S. Catering",
    "fax": ""
  },
  {
    "id": "1270745",
    "address": "4806 George Washington Hwy Catering",
    "fax": ""
  },
  {
    "id": "1270746",
    "address": "2316 Virginia Beach Blvd Catering",
    "fax": ""
  }
];


const prepEmail = (OrderInfo) => {

  const Values = Object.values(OrderInfo);

  const OrderDetails = [];
  const CustomerAddress = [];
  const OrderMethod = [];
  const ShippingAddress = [];
  const lineItems = [];

  const SubLine = [];
  console.log(OrderInfo);

  Values.forEach((item) => {
    console.log(item.note_attributes);
    SubLine.push(`

      Pollard's has a new order from ${item.customer.default_address.name}
      `);

    ShippingAddress.push(
      `
      <div>
      <h2>Shipping Information</h2>
      <ul>
      <li><strong>Full Name: </strong> ${item.shipping_address.name} </li>
      <li><strong>Company: </strong> ${item.shipping_address.company} </li>
      <li><strong>Address: </strong> ${item.shipping_address.address1} </li>
      <li><strong>Address Details: </strong> ${item.shipping_address.address2} </li>
      <li><strong>City: </strong> ${item.shipping_address.city} </li>
      <li><strong>Zip Code:</strong> ${item.shipping_address.zip} </li>
      <li><strong>Phone:</strong> ${item.shipping_address.phone} </li>
      </ul>
      </div>

    `);

    const Items = item.line_items;

    Items.forEach((item) => {

      lineItems.push(
        `

        <li><strong>Item id:</strong> ${item.id} </li>
        <li><strong>Option id:</strong> ${item.variant_id} </li>
        <li><strong>Qty:</strong> ${item.quantity} </li>
        <li><strong>Price:</strong> ${item.price} </li>
        <li><strong>Sku:</strong> ${item.sku} </li>
        <li><strong>Vendor:</strong> ${item.vendor} </li>

        `);

    });

    OrderDetails.push(
      `
      <div>
      <h2>Order Details</h2>
      <ul>
      <li><strong>id:</strong> ${item.customer.id}</li>
      <li><strong>Order Placed On:</strong> ${item.customer.created_at}</li>
      <li><strong>Last Updated:</strong> ${item.customer.updated_at}</li>
      <li><strong>First Name:</strong> ${item.customer.first_name}</li>
      <li><strong>Last Name:</strong> ${item.customer.last_name}</li>
      <li><strong>Order Count:</strong> ${item.customer.orders_count}</li>
      <li><strong>Order Notes:</strong> ${item.customer.note}</li>
      <li><strong>Last Order:</strong> ${item.customer.last_order_name}</li>
      </ul>
      </div>

      `);

    CustomerAddress.push(
        `<div>
        <h2>Customer Address Information</h2>
        <ul>
        <li><strong>Full Name:</strong> ${item.customer.default_address.name}</li>
        <li><strong>Address id:</strong> ${item.customer.default_address.id}</li>
        <li><strong>Customer id:</strong> ${item.customer.default_address.customer_id}</li>
        <li><strong>Primary Address:</strong> ${item.customer.default_address.address1}</li>
        <li><strong>Address Details:</strong> ${item.customer.default_address.address2}</li>
        <li><strong>City:</strong> ${item.customer.default_address.city}</li>
        <li><strong>State:</strong> ${item.customer.default_address.province}</li>
        <li><strong>Country:</strong> ${item.customer.default_address.country}</li>
        <li><strong>Zip Code:</strong> ${item.customer.default_address.zip}</li>
        <li><strong>Phone:</strong> ${item.customer.default_address.phone}</li>
        <li><strong>State Abrv:</strong> ${item.customer.default_address.province_code}</li>
        <li><strong>Country Abrv:</strong> ${item.customer.default_address.country_code}</li>
        </ul>
        </div>
        `
      );

      const noteValues = Object.values(item.note_attributes);

      noteValues.forEach((item) => {

      OrderMethod.push(
        `

        <li><strong>${item.name}:</strong> ${item.value}</li>


        `
      );
    });
    console.log(Stores);
  });


  sendEmail(SubLine, OrderDetails, lineItems, OrderMethod, CustomerAddress, ShippingAddress);
}

// For testing purposes only
/*const getOrder = Shopify.get('/admin/orders/' + '248838324254' + '.json', function(err, data, headers) {
  console.log("Order Details Obtained!")

  const Order = data;

    prepEmail(Order);
  }); */

// For Production
function getDataFromShopify(id) {
  console.log('getting data...')
  console.log(`This is the id: ${id}`);
  // make the api call to get the data
  Shopify.get('/admin/orders/' + id + '.json', function(err, data, headers) {
    console.log("Order Details Obtained!")
    const Order = data;
    prepEmail(Order);
  });
}


function sendEmail(SubLine, OrderDetails, lineItems, OrderMethod, CustomerAddress, ShippingAddress) {
console.log('Preparing Email!')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'matt@everyway.io',
    from: 'sendgrid@danielsnell.ninja',
    subject: `${SubLine}`,
    text: 'Order Information:',
    html: `
    <h1> New Order Summary </h1>
    <br />
  <div>
    <h2>Store Information Notes</h2>
    <ul>
  ${OrderMethod}
  </ul>
  </div>
    <br />
    ${OrderDetails}
    <br />
  ${CustomerAddress}
  <br />
  <div>
    <h2>Product's Ordered</h2>
    <ul>
    ${lineItems}
    </ul>
    </div>
    <br />
    ${ShippingAddress}
    <br />
    <strong>If there is any problems with this email, please email webmaster@ittfags.com</strong>
    `
  };
  console.log("Order information sent successfully - You've got mail!");
  sgMail.send(msg);
}

// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
