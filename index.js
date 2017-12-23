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
	faxOrders.push(id);
	idStore.push(id);
	getDataFromShopify(id);
	res.send('success');
});

const prepEmail = OrderInfo => {
	const Values = Object.values(OrderInfo);

	const OrderDetails = [];
	const CustomerAddress = [];
	const OrderMethod = [];
	const ShippingAddress = [];
	const lineItems = [];

	const OrderProps = [];

	const SubLine = [];

	Values.forEach(item => {
		SubLine.push(`

      Pollard's has a new order from ${item.customer.default_address.name}
      `);

		ShippingAddress.push(
			`
      Shipping Information

      ${item.shipping_address.name}
      Company:  ${item.shipping_address.company}
      Address:  ${item.shipping_address.address1}
      Address Details:  ${item.shipping_address.address2}
      City:  ${item.shipping_address.city}
      Zip Code: ${item.shipping_address.zip}
      Phone: ${item.shipping_address.phone}


    `
		);

		const Items = item.line_items;

		Items.forEach(item => {
			lineItems.push(
				`

        Item id: ${item.id}
        Option id: ${item.variant_id}
        Qty: ${item.quantity}
        Price: ${item.price}
        Sku: ${item.sku}
        Vendor: ${item.vendor}

        `
			);
		});

		OrderDetails.push(
			`

      Order Details

      id: ${item.customer.id}
      Order Placed On: ${item.customer.created_at}
      Last Updated: ${item.customer.updated_at}
      First Name: ${item.customer.first_name}
      Last Name: ${item.customer.last_name}
      Order Count: ${item.customer.orders_count}
      Order Notes: ${item.customer.note}
      Last Order: ${item.customer.last_order_name}

      `
		);

		CustomerAddress.push(
			`
        Customer Address Information

        Full Name: ${item.customer.default_address.name}
        Address id: ${item.customer.default_address.id}
        Customer id: ${item.customer.default_address.customer_id}
        Primary Address: ${item.customer.default_address.address1}
        Address Details: ${item.customer.default_address.address2}
        City: ${item.customer.default_address.city}
        State: ${item.customer.default_address.province}
        Country: ${item.customer.default_address.country}
        Zip Code: ${item.customer.default_address.zip}
        Phone: ${item.customer.default_address.phone}
        State Abrv: ${item.customer.default_address.province_code}
        Country Abrv: ${item.customer.default_address.country_code}


        `
		);

		const noteValues = Object.values(item.note_attributes);

		noteValues.forEach(item => {
			OrderMethod.push(
				`

        ${item.name}: ${item.value}


        `
			);

			OrderProps.push(item);
		});
	});

	sendEmail(
		OrderProps,
		SubLine,
		OrderDetails,
		lineItems,
		OrderMethod,
		CustomerAddress,
		ShippingAddress
	);
};

// For testing purposes only
/*const getOrder = Shopify.get('/admin/orders/' + '248838324254' + '.json', function(err, data, headers) {
  console.log("Order Details Obtained!")

  const Order = data;

    prepEmail(Order);
  }); */

// For Production
function getDataFromShopify(id) {
	console.log('getting data...');
	console.log(`This is the id: ${id}`);
	// make the api call to get the data
	Shopify.get('/admin/orders/' + id + '.json', function(err, data, headers) {
		console.log('Order Details Obtained!');
		const Order = data;
		prepEmail(Order);
	});
}

function sendEmail(
	OrderProps,
	SubLine,
	OrderDetails,
	lineItems,
	OrderMethod,
	CustomerAddress,
	ShippingAddress
) {
	console.log('These are the order properties');
	console.log(OrderProps);
	console.log(OrderProps[4]);
	const FaxInfo = OrderProps[4];
	console.log(Object.values(FaxInfo));
	const toEmail = FaxInfo.value;
	const testEmail = 'matt@everyway.io';
	console.log('Preparing Email!');
	const toText = `New Order Summary

  Store Information Notes

  ${OrderMethod}

  ${OrderDetails}

  ${CustomerAddress}

  ${lineItems}

  ${ShippingAddress}`;
	const sgMail = require('@sendgrid/mail');
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const msg = {
		to: toEmail,
		from: 'webmaster@pollardschicken.com',
		subject: `${SubLine}`,
		text: `${toText}`,
		html: ''
	};
	console.log(`send email to ${toEmail}`);
	console.log("Order information sent successfully - You've got mail!");
	console.log(toText);
	console.log('this was the message sent');
	sgMail.send(msg);
}

// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
