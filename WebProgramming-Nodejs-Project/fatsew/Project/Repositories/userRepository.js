var connect = require('../DBconnection');

class UserRepository {
    constructor() { }

    checklogin(email, password) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'select * from users where Email = ? AND PasswordHash = ?', [email, password], (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result.length === 0) {
                            resolve(undefined);
                        } else {
                            var user = {
                                userid: result[0].UserID,
                                email: result[0].Email,
                                firstname: result[0].FirstName,
                                lastname: result[0].LastName,
                                password: result[0].PasswordHash,
                                address: result[0].Address,
                                phonenumber: result[0].PhoneNumber,
                                role: result[0].UserType
                            };
                            resolve(user);
                        }

                    }
                }
            );
        });
    }

    register(email, password, firstname, lastname, address, phonenumber) {
        var status;
        return new Promise((resolve, reject) => {
            connect.con.query('select * from users where Email =?', [email], (err, result2, fields) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (result2.length > 0) {
                        status = 400;
                        resolve(status);
                    } 
                    else {  // are placeholders for parameters 
                        connect.con.query('INSERT INTO users (FirstName,LastName,Email, PasswordHash,Address,PhoneNumber) VALUES (?, ?, ?, ?, ?, ?)', [firstname, lastname, email, password, address, phonenumber], (err, result) => {

                            if (err) throw err
                            console.log(result);

                            status = 200;
                            resolve(status);   

                        });

                    }

                }
            });
        });
    }



    
    AddContact( name, email, feedback) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'INSERT INTO contact (name, email, feedback) VALUES (?, ?, ?)',
                [name, email, feedback],
                (deleteErr, deleteResult) => {
                    if (deleteErr) {
                        reject(deleteErr);
                    } else {
                        console.log(deleteResult);
                        resolve(200);
                    }
                }
            );
        })
    }
}
module.exports = UserRepository;
