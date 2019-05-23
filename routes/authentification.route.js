const User = require('../models/user.model');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.username) {
            res.send('You must provide a username');
        } else if (!req.body.email) {
            res.send('You must provide an email address');
        } else if (!req.body.password) {
            res.send('You must provide a password');
        } else {
            const user = new User({
                username: req.body.username.toLowerCase(),
                email: req.body.email.toLowerCase(),
                password: req.body.password
            });
            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({
                            sucess: false,
                            msg: 'Username or Email already exists'
                        });
                    } else {
                        if (err.errors) {
                            if (err.errors.email) {
                                res.json({
                                    success: false,
                                    message: err.errors.email.message
                                });
                            } else {
                                if (err.errors.username) {
                                    res.json({
                                        success: false,
                                        message: err.errors.username.message
                                    });
                                } else {
                                    if (err.errors.password) {
                                        res.json({
                                            success: false,
                                            message: err.errors.password.message
                                        })
                                    }
                                }
                            }
                        }
                    }
                } else {
                    res.json({
                        success: true,
                        msg: 'Account Registered'
                    });
                }
            });
        }
    });

    return router;
}