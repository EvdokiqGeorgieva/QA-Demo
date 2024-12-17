module.exports = {
    URL: {
        BASE_URL: 'http://localhost:3001/',
        LOGIN_URL: '/api/auth/login'
    },
    USERS: {
        VALID_USER: {
            USERNAME: 'test_user_one',
            PASSWORD: 'testUserOnePass'
        },
        INVALID_USER: {
            USERNAME: 'wrong_user_one',
            PASSWORD: 'wrongPass'
        }
    }, 
    MESSAGES: {
        LOGIN_SUCCESSFUL: 'Login successful!',
        INVALID_CREDENTIALS: 'Invalid credentials!'
    }
};
