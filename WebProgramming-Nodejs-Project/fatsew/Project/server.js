'use strict';
var http = require('http');
var port = process.env.PORT || 1337;
var express = require('express');
var app = express();
var path = require('path');
var HTMLpath = path.join(__dirname, "Public");
var connect = require('./DBconnection.js');
const middleware = require('./Services/middleware.js');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));
app.use(middleware);

var UserService = require('./Services/userService.js');
var UserController = require('./Controllers/userController.js');
var UserRepository = require('./Repositories/userRepository.js');

var productsService = require('./Services/productService.js');
var productsController = require('./Controllers/productController.js');
var productsRepository = require('./Repositories/productRepository.js');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const propductRepository = new productsRepository();
const productService = new productsService(propductRepository);
const productController = new productsController(productService);







app.get("/login", (req, res) => {
    res.sendFile(`${HTMLpath}/html/login_register.html`);
});

app.post("/login", (req, res) => userController.login(req,res));

app.get("/logout", middleware.isAuthenticated, (req, res) => userController.logout(req, res));

app.post("/register", (req, res) => userController.register(req, res));

app.post("/submit", (req, res) => userController.Contact(req, res));
app.post("/submitt", (req, res) => productController.customize(req, res));
app.get("/", middleware.isAuthenticated, async (req, res) => {

    try {
        var result = await productController.getproducts();

            var products = result.products;

            const user = req.session.user;

            res.render('homepage', { products, user })
       
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
   
});

app.post("/add-to-cart", middleware.isAuthenticated, (req, res) => productController.AddItems(req, res));

app.post("/notify", middleware.isAuthenticated, (req, res) => productController.AddToNotificationCenter(req, res));

app.get("/cart", middleware.isAuthenticated, async (req, res) => {

    try {

        const user = req.session.user;
        
        var result = await productController.getUserproducts(user.userid);

        var shoppingCart = result.products ?? undefined;

        res.render('shopping-cart', { shoppingCart, user });
      
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  
});

app.post("/cart", middleware.isAuthenticated, (res) => {
    res.send({ status: 200 });
});

app.get("/admin", middleware.isAuthenticated, async (req, res) => {

    try {

        const user = req.session.user;
        var result = await productController.getproducts();
        var products = result.products;

        res.render('admin', { products, user })

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/admin/insert", middleware.isAuthenticated, (req, res) => productController.Insert(req,res));

app.post("/admin/update", middleware.isAuthenticated, (req, res) => productController.Update(req, res));

app.post("/update-quantity", middleware.isAuthenticated, (req, res) => productController.updateQuantity(req,res));

app.get("/orders", middleware.isAuthenticated, async (req, res) => {

    try {

        const user = req.session.user;

        var result = await productController.getOrders(user.userid);
        var orders = result.orders;

        var reusltItems = await productController.getOrderItems(user.userid);
        var orderitems = reusltItems.items;


        res.render('orders', { orders, orderitems, user })

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/proccedOrder", middleware.isAuthenticated, (req, res) => productController.proccedOrder(req, res));

app.get("/contact", middleware.isAuthenticated, (req, res) => {

    const user = req.session.user;

    res.render('contact', { user })
});

app.post("/search", middleware.isAuthenticated, (req, res) => productController.search(req, res));


app.get("/customize", middleware.isAuthenticated, (req, res) => {

  

    const user = req.session.user;

    res.render('customize', { user })
});
app.listen(port, () => {
  
    console.log(`Server running at http://localhost:${port}/`);
  });