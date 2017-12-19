const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/order-recieved', function(req, res) {
   var body = req.body
   res.set('Content-Type', 'text/plain')
   res.send(`You sent: ${body} to Express`)
   console.log(`This is the request : ${req}`);
   const headerReq = 'x-shopify-order-id';
   console.log(req.headers.headerReq);


});


// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
