import express from 'express';
import users from '../data/users.json'

const router = express.Router();

router.get('/:username', (req, res) => {
    const username = req.params.username;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).send({message: "User not found"});
    }

    return res.status(200).json({
        username: user.username,
        email: user.email,
        name: user.name
    });
});

module.exports = router;
