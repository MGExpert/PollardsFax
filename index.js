const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.post('/order-recieved', function(req, res) {
   var body = req.body.Body
   res.set('Content-Type', 'text/plain')
   res.send(`You sent: ${body} to Express`)
   console.log(body);
});


if (process.env.NODE_ENV === 'production') {
	//This will serve production React Enviroment

	app.use(express.static('client/build'));

	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// Setting up heroku - Dynamic Binding
const PORT = process.env.PORT || 2000;
app.listen(PORT);
