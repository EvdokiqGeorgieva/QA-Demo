module.exports = {
    URL: {
        LOGIN_URL: 'http://localhost:3002/'
    },
    USERS: {
        VALID_USER: {
            USERNAME: 'test_user_one',
            PASSWORD: 'testUserOnePass'
        },
        INVALID_USER: {
            USERNAME: 'test_user_one',
            PASSWORD: 'wrongPass'
        }
    }, 
    MESSAGES: {
        LOGIN_SUCCESSFUL: 'Login successful!',
        INVALID_CREDENTIALS: 'Invalid credentials!'
    }
};
