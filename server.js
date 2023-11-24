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

const checkToken = (req, res, next) => {
	const token = req.headers["authorization"];
	console.log(req.headers, req.headers["a"]);
	if (token) {
		jwt.verify(token, 'secret', (err, decoded) => {
			if (err) {
				res.status(401).send(err)

				return
			}
			else {
				req.userID = decoded.userID
				next()
			}
		})
	} else {
		res.status(401).send({ message: 'Access Denied' })
	}
}

app.get("/data", checkToken, (req, res) => {
	const filteredCars = cars.filter((car) => car.userId === req.userID)

	res.status(200).send({ data: filteredCars })
})


app.listen(port, () => {
	console.log("Running post" + port);
})
