const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const users = require("./users.json");
const cars = require("./cars.json");

const app = express();
const port = 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/login', (req, res) => {
	const user = users.find(({ userName }) => userName === req.body.userName);

	if (user) {
		if (user.password === req.body.password) {
			const token = jwt.sign({ userID: user.id }, 'secret');
			res.status(200).send({ token })
		}
		else {
			res.status(401).send({ message: 'Access Denied' })
		}
	}
	else {
		res.status(401).send({ message: 'Access Denied' })
	}
})

