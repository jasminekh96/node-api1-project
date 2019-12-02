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
// add a user
server.post('/users', (req, res) => {
	const { name, bio } = req.body;
	if (!name || !bio) {
		res.status(400).json({ error: 'Please provide name and bio for the user.' });
	} else {
		db
			.insert({ name, bio })
			.then(({ id }) => {
				db.findById(id).then((user) => {
					res.status(201).json(user);
				});
			})
			.catch((error) => {
				console.log('error on the POST/users', error);
				res.status(500).json({
					errorMessage : 'There was an error while saving the user to the database',
				});
			});
	}
});
//get ID directly when typed in
server.get('/users/:id', (req, res) => {
	const { id } = req.params;
	db
		.findById(id)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ error: 'The user with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: 'The user information could not be retrieved.' });
		});
});

//delete
server.delete('/users/:id', (req, res) => {
	const { id } = req.params;
	db
		.remove(id)
		.then((deleted) => {
			if (deleted) {
				res.status(200).json({ message: 'hub removed successfuly' });
			} else {
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			console.log('error on the POST/hubs', error);
			res.status(500).json({
				errorMessage : 'The user could not be removed',
			});
		});
});
const port = 5000;
server.listen(port, () => console.log(`\n API running on port ${port} \n`));
