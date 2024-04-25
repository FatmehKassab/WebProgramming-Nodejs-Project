const middleware = require('../Services/middleware.js');
const session = require('express-session');
const nodemailer = require('nodemailer');
class productController {
    constructor(productService) {
        this.productService = productService;
    }

    getFormattedDate() {   // Function to get the current date and time in a formatted string
        const today = new Date();  // Get the current date and time
        // Extract year, month, day, hours, minutes, and seconds
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        const seconds = String(today.getSeconds()).padStart(2, '0');
        // Format the date and time string
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        // Return the formatted date string
        return formattedDate;
    }

    sendEmail(name,email,productname) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fatmehkassab@gmail.com',
                pass: 'ddas slus asmo fkhq'
            }
        });

        const mailoptions = {
            from: 'fatsew',
            to: email,
            subject: `${productname} is back in stock!`,
            text: `Dear ${name},

            Great news from fatsew! We're excited to inform you that ${productname} is now back in stock. Don't miss the chance to get yours!

            Hurry up and place your order.

            Best regards,
            fatsew`,

            html: `<b>Dear ${name},

            Great news from fatsew! We're excited to inform you that ${productname} is now back in stock. Don't miss the chance to get yours!

            Hurry up and place your order.

            Best regards,
            fatsew</b>`
        };
            // Send email using Nodemailer transporter
        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                return console.error('error sending email:', error);
            }
            console.log('message sent: %s', info.messageId);
        });

    }   


    async getproducts() {
        try {
            var result = await this.productService.getallproducts();

            if (result !== undefined) {
                return {
                    products: result,
                    status: 200
                };
            } else {
                return {
                    products: undefined, 
                    status: 404
                };
            }
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                status_error: 'Internal Server Error'
            };
        }
    }
// Synchronous function to retrieve all products
    async getproductByName(name) {
        try {  // Call the ProductService to get all products
            var result = await this.productService.getproductbyName(name);
 // Check if products are found
            if (result !== undefined) {
                return {
                    product: result,
                    status: 200
                };
            } else {
                return {
                    product: undefined,
                    status: 404
                };
            }
        } catch (error) { // Log and handle errors, return an internal server error status code (500)
            console.error(error);
            return {
                status: 500,
                status_error: 'Internal Server Error'
            };
        }
    }

    async getQuantityfromShoppoingCart(productID, userID) { 
        try { // Call the ProductService to get the quantity from the shopping cart
            var result = await this.productService.getfromShoppingCartQuantity(productID, userID);

            if (result !== undefined) {
                return {
                    product: result,
                    status: 200
                };
            } else {
                return {
                    product: undefined, 
                    status: 404
                };
            }
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                status_error: 'Internal Server Error'
            };
        }
    }

    async addToCart(productID, userID, quantity, price, state, oldprice) {
        try {
            var result = await this.productService.addtocart(productID, userID, quantity, price, state, oldprice);

            if (result !== undefined) {
                return {
                    status: 200
                };
            } else {
                return {
                    status: 404
                };
            }
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                status_error: 'Internal Server Error'
            };
        }
    }

    async AddItems(req, res) {
        try {
            const user = req.session.user;
            const name = req.body.name;
            const quantitySelected = req.body.quantity;

            const controller = new productController(this.productService);
            const result = await controller.getproductByName(name);
            const productID = result.product.ProductID;
            const price = result.product.Price;
            const stock = result.product.StockQuantity;

            const resultCart = await controller.getQuantityfromShoppoingCart(productID, user.userid);
            const quantityInCart = resultCart.product.Quantity ?? 0;
            const oldprice = resultCart.product.Price ?? 0;

            var total = quantityInCart + quantitySelected;

            //checking if the user already has the selected item in his shoppingcart

            if (stock === quantityInCart) {  // checking the max value mawjoude bil stoock w ntlbt 3al shoping 

                const successmessage = `${user.firstname} you have the maximum quantity of ${name} in your shopping cart. No quantity added.`;
                res.send({ status: 200, message: successmessage });

            } else if (stock >= total || resultCart.product.Quantity === undefined || quantityInCart === 0) {

                if (resultCart.product.Quantity === undefined) {

                    await controller.addToCart(productID, user.userid, quantitySelected, price, 'insert', oldprice);

                } else {``

                    await controller.addToCart(productID, user.userid, total, price, 'update', oldprice);

                }

                const successmessage = `${user.firstname} you added ${quantitySelected} of ${name} into your shopping cart. Your quantity now is ${total}.`;
                res.send({ status: 200, message: successmessage });


            } else if (stock < total) {

                var addedQuantity = stock - quantityInCart;
                await controller.addToCart(productID, user.userid, stock, price, 'update', oldprice);

                const successmessage = `${user.firstname} you already have ${quantityInCart} of ${name} in your shopping cart. Only ${addedQuantity} added. Your quantity now is ${stock}.`;
                res.send({ status:200, message: successmessage });
            }
        } catch (err) {
            console.log(err);
            const errormessage = 'Internal Server Error';
            res.send({status:500, message: errormessage });
        }
    }

    // Asynchronous function to get products from a user's shopping cart
async getUserproducts(userid) {
    try {
        // Retrieve products from the user's shopping cart
        var result = await this.productService.getfromShoppingCartProducts(userid);

        // Check if products were successfully retrieved
        if (result !== undefined) {
            // Loop through each product in the result
            for (var i = 0; i < result.length; i++) {
                // Check if the quantity of the product is 0 in the shopping cart
                if (result[i].Quantity === 0) {
                    // If the quantity is 0, remove the product from the shopping cart
                    var resultForCart = await this.productService.removeProductFromShoppingCart(result[i].ProductID, result[i].UserID);

                    // Check if the removal from the cart was successful
                    if (resultForCart === 200) {
                        // If successful, remove the product from the local result array
                        result.splice(i, 1);
                    } else {
                        // If removal from the cart fails, return an internal server error
                        return {
                            status: 500,
                            status_error: 'Internal Server Error'
                        };
                    }
                }
            }
        }

        // Check if products are still present after processing
        if (result !== undefined) {
            // Return the remaining products and a success status code (200)
            return {
                products: result,
                status: 200
            };
        } else {
            // Return undefined products and a not found status code (404)
            return {
                products: undefined,
                status: 404
            };
        }
    } catch (error) {
        // Log and handle errors, return an internal server error status code (500)
        console.error(error);
        return {
            status: 500,
            status_error: 'Internal Server Error'
        };
    }
}


   // Asynchronous function to insert a product
async Insert(req, res) {
    try {
        // Extract the product data from the request body yaane 3m tsewe post bil req.body 
        var product = req.body;

        // Call the ProductService to insert the product
        var result = await this.productService.insert(product);

        // Check the result of the insertion
        if (result === 200) {
            // If successful, send a success status (200) in the response
            res.send({
                status: 200
            });
        } else {
            // If insertion fails, send a client error status (400) in the response
            res.send({
                status: 400
            });
        }
    } catch (error) {
        // Log and handle errors, send an internal server error status (500) in the response
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

    // Asynchronous function to update a product
async Update(req, res) {
    try {
        // Extract the updated product data from the request body
        var product = req.body;

        // Create a new product controller instance to access utility methods
        const controller = new productController(this.productService);

        // Get the existing product data based on the product name
        var oldproduct = await controller.getproductByName(product.productName);

        // Check and update fields only if they are empty in the request
        if (product.productDescription === "") {
            product.productDescription = oldproduct.product.Description;
        }

        if (product.productCategory === "") {
            product.productCategory = oldproduct.product.Category;
        }

        if (product.productStock === "") {
            product.productStock = oldproduct.product.StockQuantity;
        }

        if (product.productPrice === "") {
            product.productPrice = oldproduct.product.Price;
        }

        // Call the ProductService to perform the product update
        var result = await this.productService.update(product);

        // Sending email notifications to users if the stock is updated
        if (product.productStock != 0) {
            var ProductInNotificationCenter = await this.productService.CheckProductInNoitficatioCenter(oldproduct.product.ProductID);

            if (ProductInNotificationCenter.length > 0) {
                var users = await this.productService.GetUsersForThisProduct(oldproduct.product.ProductID);

                for (var i = 0; i < ProductInNotificationCenter.length; i++) {
                    // Send email notifications to users
                    this.sendEmail(users[i].FirstName + " " + users[i].LastName, users[i].Email, oldproduct.product.Name);

                    // Delete the product from the notification center
                    await this.productService.DeleteFromNotificationCenter(users[i].userID, oldproduct.product.ProductID);
                }
            }
        }

        // Check the result of the update and send an appropriate response to the client
        if (result === 200) {
            res.send({
                status: 200
            });
        } else {
            res.send({
                status: 400
            });
        }
    } catch (error) {
        // Log and handle errors, send an internal server error status (500) in the response
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


   // Asynchronous function to update product quantity
async updateQuantity(req, res) {
    try {
        // Extract data from the request body
        var productName = req.body.name;
        var productQuantity = req.body.newquantity;
        var Quantity = req.body.displayquantity;
        var UpdatedData = Quantity - productQuantity;
        var user = req.session.user;

        
        const controller = new productController(this.productService);
        // Get the product ID based on the product name
        const resultID = await controller.getproductByName(productName);
        const productID = resultID.product.ProductID;

        // Call the ProductService to update the product quantity
        var result = await this.productService.updatequantity(productID, UpdatedData, user.userid);

        // Check the result of the update and send a response to the client
        if (result === 200) {
            res.send({
                updateddata: UpdatedData
            });
        } 
    } catch (error) {
        // Log and handle errors, send an internal server error status (500) in the response
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
// Asynchronous function to get user orders
async getOrders(userid) {
    try {
        // Call the ProductService to retrieve user orders
        var result = await this.productService.getorders(userid);

        // Check if orders were successfully retrieved
        if (result !== undefined) {
            // Return the orders and a success status code (200)
            return {
                orders: result,
                status: 200
            };
        } else {
            // Return undefined orders and a not found status code (404)
            return {
                orders: undefined,
                status: 404
            };
        }
    } catch (error) {
        // Log and handle errors, return an internal server error status code (500)
        console.error(error);
        return {
            status: 500,
            status_error: 'Internal Server Error'
        };
    }
}
// Asynchronous function to get user order items
async getOrderItems(userid) {
    try {
        // Call the ProductService to retrieve user order items
        var result = await this.productService.getordersitems(userid);

        // Check if order items were successfully retrieved
        if (result !== undefined) {
            // Return the order items and a success status code (200)
            return {
                items: result,
                status: 200
            };
        } else {
            // Return undefined order items and a not found status code (404)
            return {
                items: undefined,
                status: 404
            };
        }
    } catch (error) {
        // Log and handle errors, return an internal server error status code (500)
        console.error(error);
        return {
            status: 500,
            status_error: 'Internal Server Error'
        };
    }
}


   // Asynchronous function to proceed with an order
async proccedOrder(req, res) {
    try {
        // Get user information from the session, current date, and total value from the request
        const user = req.session.user;
        const currentDate = this.getFormattedDate();
        const total = req.body.totalValue;

        // Create a new product controller instance to access utility methods
        const controller = new productController(this.productService);

        // Retrieve products from the user's shopping cart
        var userItems = await controller.getUserproducts(user.userid);

        // Proceed with the order by confirming it and obtaining the order ID
        var order = await this.productService.proccedorder(user.userid, currentDate, 'Confirmed', total);

        // Check if the order confirmation is successful
        if (order === 200) {
            // Get the ID of the recently confirmed order
            var OrderID = await this.productService.getOrderID(currentDate);

            // Process each product in the user's shopping cart
            for (var i = 0; i < userItems.products.length; i++) {
                // Create an order item for each product in the order
                var orderItem = await this.productService.proccedOrderItem(
                    OrderID,
                    userItems.products[i].ProductID,
                    userItems.products[i].Quantity,
                    userItems.products[i].Price
                );

                // Update the stock of the product based on the order quantity
                var NewStock = userItems.products[i].StockQuantity - userItems.products[i].Quantity;
                var UpdateStock = await this.productService.UpdateStock(userItems.products[i].ProductID, NewStock);

                // If the order item creation is successful, remove the product from the shopping cart
                if (orderItem === 200) {
                    var result = await this.productService.removeProductFromShoppingCart(
                        userItems.products[i].ProductID,
                        user.userid
                    );
                }
            }

            // Send a success status (200) in the response
            res.send({
                status: 200
            });
        }
    } catch (error) {
        // Log and handle errors, return an internal server error status code (500)
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


    // Asynchronous function to add a product to the user's notification center
async AddToNotificationCenter(req, res) {
    try {
        // Get user information from the session and product name from the request
        var user = req.session.user;
        const name = req.body.name;

        // Retrieve the product information based on the product name
        var product = await this.getproductByName(name);
        var productID = product.product.ProductID;

        // Call the ProductService to add the product to the user's notification center
        var result = await this.productService.AddtoNotificationCenter(user.userid, productID);

        // Check the result and send an appropriate response to the client
        if (result === 200) {
            const successMessage = `${user.firstname} you will be notified when ${name} is back in stock.`;
            res.json({ message: successMessage });
        } else if (result === 400) {
            const successMessage = `${user.firstname} you are already in the notification list for ${name}.`;
            res.json({ message: successMessage });
        }
    } catch (error) {
        // Log and handle errors, return an internal server error status code (500)
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
// Asynchronous function to search for products
async search(req, res) {
    try {
        // Get search query and filter from the request
        var query = req.body.search;
        var filter = req.body.search_filter;

        // Call the ProductService to get search results based on the query and filter
        var result = await this.productService.getSearchResult(query, filter);

        // Check if search results were found and send a response to the client
        if (result.length !== 0) {
            res.send({
                products: result,
                status: 200
            });
        } else {
            res.send({
                status: 404
            });
        }
    } catch (error) {
        // Log and handle errors, return an internal server error status code (500)
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}




// Asynchronous function to customize a product
async customize(req, res) {
    try {
        // Extract product data from the request body
        var product = req.body;

        // Call the ProductService to perform the customization
        var result = await this.productService.customize(product);

        // Check the result of the customization and send a response to the client
        if (result === 200) {
            // If successful, send a success status (200) in the response
            res.send({
                status: 200
            });
        } else {
            // If customization fails, send a client error status (400) in the response
            res.send({
                status: 400
            });
        }
    } catch (error) {
        // Log and handle errors, send an internal server error status (500) in the response
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

} 
module.exports = productController;
