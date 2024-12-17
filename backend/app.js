const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
