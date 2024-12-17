const express = require('express');
const router = express.Router();
const users = require('../data/users.json');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(400).send({message: 'Invalid credentials!' });
    }
    if (user.password != password) {
        return res.status(400).send({message: 'Invalid credentials!' });
    }
    return res.status(200).send({message: 'Login successful!'});
});

module.exports = router;
