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

app.post('/order-recieved', function(req, res) {
	const faxOrders = [];
	const id = req.get('x-shopify-order-id');
	faxOrders.push(id);
	getDataFromShopify(id);
	res.send('success');
});

const prepEmail = (OrderInfo) => {
	const Values = Object.values(OrderInfo);

	const OrderDetails = [];
	const CustomerAddress = [];
	const OrderMethod = [];
	const ShippingAddress = [];
	const lineItems = [];
	const OrderValue = [];
	const OrderProps = [];
	const OrderPrice = [];

	const SubLine = [];

	const TimePlaced = Moment().format('lll');

	Values.forEach(item => {
		SubLine.push(`
      Pollard's has a new order from ${item.customer.default_address.name}
      `);

		OrderValue.push(`
		<ul>
			<li><strong>Subtotal:</strong> ${item.subtotal_price}</li>
			<li><strong>Tax:</strong> ${item.total_tax}</li>
			<li><strong>Total:</strong> ${item.total_price} </li>
		</ul>
		`)

		ShippingAddress.push(
			`
      <div>
      <h2>Shipping Information</h2>
      <ul>
      <li><strong>Full Name: </strong> ${item.shipping_address.name} </li>
      <li><strong>Company: </strong> ${item.shipping_address.company} </li>
      <li><strong>Address: </strong> ${item.shipping_address.address1} </li>
      <li><strong>Address Details: </strong> ${
				item.shipping_address.address2
			} </li>
      <li><strong>City: </strong> ${item.shipping_address.city} </li>
      <li><strong>Zip Code:</strong> ${item.shipping_address.zip} </li>
      <li><strong>Phone:</strong> ${item.shipping_address.phone} </li>
      </ul>
      </div>
    `
		);

		const Items = item.line_items;

		Items.forEach(item => {
		const Props = Object.values(item.properties);

		const PropStore = [];

		Props.forEach( prop => {

			PropStore.push(`<li><strong>${prop.name}:</strong> ${prop.value}</li>`);

			});
			console.log(PropStore);
		lineItems.push(
				`
		<li><strong>Product: </strong> ${item.name} </li>
		<li><strong>Type: </strong> ${item.variant} </li>
        <li><strong>Qty:</strong> ${item.quantity} </li>
        <li><strong>Price:</strong> ${item.price} </li>
		<li><strong>Link:</strong><a href="https://pollardschicken-com.myshopify.com/admin/orders/${item.id}">View order ${item.id}</a></li>
		${PropStore}
		`
				);


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
      `
		);

		CustomerAddress.push(
			`<div>
        <h2>Customer Address Information</h2>
        <ul>
        <li><strong>Full Name:</strong> ${
					item.customer.default_address.name
				}</li>
        <li><strong>Address id:</strong> ${
					item.customer.default_address.id
				}</li>
        <li><strong>Customer id:</strong> ${
					item.customer.default_address.customer_id
				}</li>
        <li><strong>Primary Address:</strong> ${
					item.customer.default_address.address1
				}</li>
        <li><strong>Address Details:</strong> ${
					item.customer.default_address.address2
				}</li>
        <li><strong>City:</strong> ${item.customer.default_address.city}</li>
        <li><strong>State:</strong> ${
					item.customer.default_address.province
				}</li>
        <li><strong>Country:</strong> ${
					item.customer.default_address.country
				}</li>
        <li><strong>Zip Code:</strong> ${item.customer.default_address.zip}</li>
        <li><strong>Phone:</strong> ${item.customer.default_address.phone}</li>
        <li><strong>State Abrv:</strong> ${
					item.customer.default_address.province_code
				}</li>
        <li><strong>Country Abrv:</strong> ${
					item.customer.default_address.country_code
				}</li>
        </ul>
        </div>
        `
		);

		const noteValues = Object.values(item.note_attributes);

		noteValues.forEach(item => {
			console.log(Object.keys(item));
			OrderMethod.push(
				`
				<ul>
				<li>
					<strong>${item.name}:</strong> ${item.value}
				</li>
				</ul>
				`


			);

			OrderProps.push(item);


	});

	sendEmail(
		OrderProps,
		SubLine,
		lineItems,
		OrderMethod,
		TimePlaced,
		OrderValue
		);
	});
};
var CheckPrevious;
// For Production
const getDataFromShopify = (id) => {
	if ( CheckPrevious !== id ) { 
	console.log('getting data...');
	console.log(`This is the id: ${id}`);
	// make the api call to get the data
	Shopify.get('/admin/orders/' + id + '.json', function(err, data, headers) {
		console.log('Order Details Obtained!');
		const Order = data;
		prepEmail(Order);
		console.log(`Updating Order Flag`);
		CheckPrevious = id;
		});
	}
}

function sendEmail(
	OrderProps,
	SubLine,
	lineItems,
	OrderMethod,
	TimePlaced,
	OrderValue
) {
	console.log('These are the order properties');

	console.log('check props');
	console.log(OrderProps[4]);
	const FaxInfo = OrderProps[4];
	console.log(Object.values(FaxInfo));
	const toEmail = FaxInfo.value;
	const testEmail = 'matt@everyway.io';
	console.log('Preparing Email!');
	const sgMail = require('@sendgrid/mail');
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const msg = {
		to: toEmail,
		from: 'webmaster@pollardschicken.com',
		subject: `${SubLine}`,
		text: 'Order Information:',
		html: `
  	<div>

		<p>${SubLine}</p>
		<h4> Order Details: ${TimePlaced} </h4>
		<h4>Order Items</h1>
		<ul>
			${lineItems}
			</ul>
			<br />
			<h4>Order Value:</h4>
			<ul>
				${OrderValue}
			</ul>
		<br />
	  <h4>Order Notes</h4>
    <ul>
  ${OrderMethod}
  </ul>
</div>
		`
	};
	console.log(`send email to ${toEmail}`);
	console.log("Order information sent successfully - You've got mail!");
	sgMail.send(msg);
}

// Setting up heroku - Dynamic Binding

const PORT = process.env.PORT;
app.listen(PORT);
