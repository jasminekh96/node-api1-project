// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
	res.send({ api: 'up and running...' });
});

//get list of users
server.get('/users', (req, res) => {
	db
		.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((error) => {
			console.log('error on the GET/users', error);
			res.status(500).json({ errorMessage: 'The users information could not be retrieved.' });
		});
});

server.post('/users', (req, res) => {
	const userData = req.body;
	db
		.insert(userData)
		.then((user) => {
			res.status(201).json(user);
		})
		.catch((error) => {
			console.log('error on the POST/users', error);
			res.status(500).json({
				errorMessage : '"There was an error while saving the user to the database"',
			});
		});
});

const port = 5000;
server.listen(port, () => console.log(`\n API running on port ${port} \n`));
