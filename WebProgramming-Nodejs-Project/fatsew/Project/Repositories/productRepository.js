var connect = require('../DBconnection');

class productRepository {
    constructor() { }

    getAll(){
        return new Promise((resolve, reject) => {
            connect.con.query(
                'select * from products', (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {

                        if (result.length === 0) {
                            resolve([]);
                        } else {

                            var productsArray = [];

                            for (var i = 0; i < result.length; i++) {
                                productsArray.push(result[i]); //  to append the elements of another array. to push the elements into arrY 
                            }

                            resolve(productsArray);
                        }
                    }
                }
            );
        });
    }

    getProductbyName(name) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'select * from products where name=?', [name], (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {

                        if (result.length === 0) {
                            resolve([]);
                        } else {

                            var product = {
                                ProductID: result[0].ProductID, 
                                Name: result[0].Name,
                                Description: result[0].Description,
                                Price: result[0].Price,
                                StockQuantity: result[0].StockQuantity,
                                Category: result[0].Category,
                                ImagePath: result[0].ImagePath
                            };

                            resolve(product);
                        }
                    }
                }
            );
        });
    }

    getFromCartQuantity(productID, userID) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'select * from shoppingcart where productID=? AND userID=?', [productID,userID], (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {

                        if (result.length === 0) {
                            resolve([]);
                        } else {

                            var product = {
                                ShoppingCartID: result[0].ShoppingCartID,
                                ProductID: result[0].ProductID,
                                UserID: result[0].UserID,
                                Price: result[0].Price,
                                Quantity: result[0].Quantity,
                            };

                            resolve(product);
                        }
                    }
                }
            );
        });
    }

    AddCart(productID, userID, quantity, price,state,oldprice) {

        var status;
        var newprice = oldprice + (price * quantity);
        newprice = parseFloat(newprice.toFixed(2));

        return new Promise((resolve, reject) => {
            
            if (state === 'insert') {

                connect.con.query('INSERT INTO shoppingcart (UserID,ProductID, Quantity, Price) VALUES (?, ?, ?, ?)', [userID, productID, quantity, newprice], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        status = 200; 
                        resolve(status);
                    }
                });
            } else if (state === 'update') {
                
                connect.con.query('UPDATE shoppingcart SET Quantity = ?, Price = ? WHERE ProductID = ? AND UserID = ?', [quantity, newprice, productID, userID], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        status = 200; 
                        resolve(status);
                    }
                });
            } else {
                status = 400; 
                resolve(status);
            }
        });
    }

    getProductsForUser(userID) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'select * from products inner join shoppingcart on products.ProductID = shoppingcart.ProductID where UserID= ?', [userID], (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {

                        if (result.length === 0) {
                            resolve([]);
                        } else {

                            var productsArray = [];
                           

                            for (var i = 0; i < result.length; i++) {

                                if (result[i].StockQuantity < result[i].Quantity) {

                                    result[i].Quantity = result[i].StockQuantity;
                                    
                                }

                                result[i].TotalPrice = result[i].Price * result[i].Quantity;

                                productsArray.push(result[i]); 
                            }

                            

                            resolve(productsArray);
                        }
                    }
                }
            );
        });
    }

    AddProduct(product) {
        var status;
        return new Promise((resolve, reject) => {
            connect.con.query('select * from products where name =?', [product.productName], (err, result2, fields) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (result2.length > 0) {
                        status = 400;
                        resolve(status);
                    }
                    else {
                        connect.con.query('INSERT INTO products (Name,Description,Price,StockQuantity,Category) VALUES (?, ?, ?, ?, ?)', [product.productName, product.productDescription, product.productPrice, product.productStock, product.productCategory], (err, result) => {

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

    UpdateProduct(product) {
        return new Promise((resolve, reject) => {
            connect.con.query('UPDATE products SET Description = ?, Price = ?, StockQuantity = ?, Category = ? WHERE Name = ?', [product.productDescription, product.productPrice, product.productStock, product.productCategory, product.productName], (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(result);
                        resolve(200);
                    }
                }
            );
        });

    }

    DeleteProductFromShoppingCart(productID,userID) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'DELETE FROM shoppingcart WHERE ProductID = ? AND UserID = ?',
                [productID,userID],
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

    update(productID, productQuantity, userID) {

        if (productQuantity < 0) productQuantity = 0;

        return new Promise((resolve, reject) => {
            connect.con.query('UPDATE shoppingcart SET Quantity = ? WHERE ProductID = ? AND UserID=?', [productQuantity, productID,userID], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(result);
                    resolve(200);
                }
            }
            );
        });

    }

    GetOrders(userid) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'select * from orders where UserID = ?', [userid], (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {

                        if (result.length === 0) {
                            resolve([]);
                        } else {

                            var ordersArray = [];

                            for (var i = 0; i < result.length; i++) {
                                ordersArray.push(result[i]); 
                            }

                            resolve(ordersArray);
                        }
                    }
                }
            );
        });

    }

    GetOrderItems(userid) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'select * from orderitems inner join orders on orders.OrderID = orderitems.OrderID inner join products on orderitems.ProductID = products.ProductID where UserID = ?', [userid], (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {

                        if (result.length === 0) {
                            resolve([]);
                        } else {

                            var productsArray = [];

                            for (var i = 0; i < result.length; i++) {
                                productsArray.push(result[i]);
                            }

                            resolve(productsArray);
                        }
                    }
                }
            );
        });

    }

    ProcessOrder(userid, currentDate, status, total) {
        return new Promise((resolve, reject) => {
            connect.con.query('INSERT INTO orders (UserID, OrderDate, Status, TotalAmount) VALUES (?, ?, ?, ?)', [userid, currentDate, status, total], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(result);
                    resolve(200);
                }
            }
            );
        });

    }

    RerunOrderID(GivenDate) {
        return new Promise((resolve, reject) => {
            connect.con.query('SELECT OrderID from orders where OrderDate = ?', [GivenDate], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    var orderid = result[0].OrderID;
                    console.log(result);
                    resolve(orderid);
                }
            }
            );
        });

    }

    ProcessOrderItem(OrderID, ProductID, Quantity, Price) {
        return new Promise((resolve, reject) => {
            connect.con.query('INSERT INTO orderitems (OrderID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)', [OrderID, ProductID, Quantity, Price], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(result);
                    resolve(200);
                }
            }
            );
        });
    }

    updateStock(ProductID, NewStock) {
        return new Promise((resolve, reject) => {
            connect.con.query('UPDATE products SET StockQuantity = ? WHERE ProductID = ?', [NewStock,ProductID], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(result);
                    resolve(200);
                }
            }
            );
        });

    }

    CheckNotificationCenter(ProductID) {
        return new Promise((resolve, reject) => {
            connect.con.query('SELECT * from notification where ProductID = ?', [ProductID], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) {
                        resolve([]);
                    } else {
                        var NotifyArray = [];
                        for (var i = 0; i < result.length; i++) {
                            NotifyArray.push(result[i]);
                        }
                        resolve(NotifyArray);
                    }
                }
            });
        });
    }

    GetUsers(ProductID) {
        return new Promise((resolve, reject) => {
            connect.con.query('select * from users inner join notification on notification.userid = users.UserID where notification.productID = ?', [ProductID], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) {
                        resolve([]);
                    } else {
                        var UsersArray = [];
                        for (var i = 0; i < result.length; i++) {
                            UsersArray.push(result[i]);
                        }
                        resolve(UsersArray);
                    }
                }
            });
        });
    }

    AddToNotification(userID,productID) {
        var status;
        return new Promise((resolve, reject) => {
            connect.con.query('select * from notification where productID =? AND userID = ?', [productID, userID], (err, result2, fields) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (result2.length > 0) {
                        status = 400;
                        resolve(status);
                    }
                    else {
                        connect.con.query('INSERT INTO notification (productID,userID) VALUES (?, ?)', [productID, userID], (err, result) => {

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


    DeleteFromNotification(userID, productID) {
        return new Promise((resolve, reject) => {
            connect.con.query(
                'DELETE FROM notification WHERE productID = ? AND userID = ?',
                [productID, userID],
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

    GetSearchResult(query, filter) {
        return new Promise((resolve, reject) => {
            let orderByClause = '';

            switch (filter) {
                case 'Price-Ascending':
                    orderByClause = 'ORDER BY Price ASC';
                    break;
                case 'Price-Descending':
                    orderByClause = 'ORDER BY Price DESC';
                    break;
                case 'Alphabetical-Order':
                    orderByClause = 'ORDER BY Name ASC';
                    break;
                case 'Inverse-Alphabetical-Order':
                    orderByClause = 'ORDER BY Name DESC';
                    break;
                default:
                    orderByClause = '';
            }

            if (query === "") {
                connect.con.query(`SELECT * FROM products ${orderByClause}`, (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result.length === 0) {
                            resolve([]);
                        } else {
                            var ProductsArray = [];
                            for (var i = 0; i < result.length; i++) {
                                ProductsArray.push(result[i]);
                            }
                            resolve(ProductsArray);
                        }
                    }
                });
            } else {
                connect.con.query(
                    'SELECT * FROM products WHERE Category LIKE CONCAT(\'%\', ?, \'%\') ' + orderByClause,
                    [query],
                    (err, result, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (result.length === 0) {
                                resolve([]);
                            } else {
                                var ProductsArray = [];
                                for (var i = 0; i < result.length; i++) {
                                    ProductsArray.push(result[i]);
                                }
                                resolve(ProductsArray);
                            }
                        }
                    }
                );
            }
        });
    }


    customize(product) {
        var status;
        return new Promise((resolve, reject) => {
           
                        connect.con.query('INSERT INTO customization (Name,Description,Color,Size,Category) VALUES (?, ?, ?, ?, ?)', 
                        
                        [product.productName, product.productDescription, product.productColor, product.productSize, product.productCategory], (err, result) => {

                            if (err) throw err
                            console.log(result);

                            status = 200;
                            resolve(status);

                        });

                    })};

                
     





}



    


module.exports = productRepository;
