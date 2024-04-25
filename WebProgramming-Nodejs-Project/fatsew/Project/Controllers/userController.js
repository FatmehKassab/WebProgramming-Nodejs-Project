const middleware = require('../Services/middleware.js');
const session = require('express-session');
class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async login(req,res) {
        var email = req.body.email;
        var password = req.body.password;

        try {
            var result = await this.userService.confirmlogin(email, password);

            if (result!==undefined) {
        
                req.session.user = result; // storing user info in the session if the login successful

                res.send({
                    status: 200
                });

            } else {
                res.send({
                    status: 404
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    async register(req, res) {

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.email;
        var password = req.body.password;
        var address = req.body.address;
        var phonenumber = req.body.phonenumber;
        
        try {
            var result = await this.userService.register(email, password,firstname,lastname,address,phonenumber);

            if (result === 200) {

                res.send({
                    status: 200
                });
            } else {
                res.send({
                    status: 404
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {

            if (err) {
                return res.status(500).json({ success: false, message: 'Logout failed', error: err.message });
            }

            else {

                return res.status(200).json({ success: true, message: 'Logout successful' });

            }
        });
    }



    async Contact(req,res) {
        var name = req.body.name;
        var email = req.body.email;
        var feedback = req.body.feedback;
               
            var result = await this.userService.AddContact(name,email, feedback);

            if (result!==undefined) {
        
                req.session.user = result;

                if (err) {
                    return res.status(500).json({ success: false, message: 'Feedback failed', error: err.message });
                }
    
                else {
    
                    return res.status(200).json({ success: true, message: 'Feedback successful' });
    
                }
            }
      
        }
    }

module.exports = UserController;
