class productService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getallproducts() {
        try {
            var result = await this.productRepository.getAll();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getproductbyName(name) {
        try {
            var result = await this.productRepository.getProductbyName(name);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getfromShoppingCartQuantity(productID, userID) {
        try {
            var result = await this.productRepository.getFromCartQuantity(productID, userID);
            return result;
        } catch (error) {
            throw error;
        }

    }

    async addtocart(productID, userID, quantity, price, state, oldprice) {
        try {
            var result = await this.productRepository.AddCart(productID, userID, quantity, price, state, oldprice);
            return result;
        } catch (error) {
            throw error;
        }

    }

    async getfromShoppingCartProducts(userID) {
        try {
            var result = await this.productRepository.getProductsForUser(userID);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async insert(product) {
        try {
            var result = await this.productRepository.AddProduct(product);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async update(product) {
        try {
            var result = await this.productRepository.UpdateProduct(product);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromShoppingCart(productID,userID) {
        try {
            var result = await this.productRepository.DeleteProductFromShoppingCart(productID,userID);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updatequantity(productID, productQuantity, userID) {
        try {
            var result = await this.productRepository.update(productID, productQuantity, userID);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getorders(userid) {
        try {
            var result = await this.productRepository.GetOrders(userid);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getordersitems(userid){
        try {
            var result = await this.productRepository.GetOrderItems(userid);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async proccedorder(userid, currentDate, status, total) {
        try {
            var result = await this.productRepository.ProcessOrder(userid, currentDate, status, total);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getOrderID(givendate) {
        try {
            var result = await this.productRepository.RerunOrderID(givendate);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async proccedOrderItem(OrderID,ProductID, Quantity, Price) {
        try {
            var result = await this.productRepository.ProcessOrderItem(OrderID, ProductID, Quantity, Price);
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    async UpdateStock(ProductID, NewStock) {
        try {
            var result = await this.productRepository.updateStock(ProductID, NewStock);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async CheckProductInNoitficatioCenter(ProductID) {
        try {
            var result = await this.productRepository.CheckNotificationCenter(ProductID);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async GetUsersForThisProduct(ProductID) {
        try {
            var result = await this.productRepository.GetUsers(ProductID);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async AddtoNotificationCenter(userID,productID) {
        try {
            var result = await this.productRepository.AddToNotification(userID, productID);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async DeleteFromNotificationCenter(userID, productID) {
        try {
            var result = await this.productRepository.DeleteFromNotification(userID, productID);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getSearchResult(query,filter) {
        try {
            var result = await this.productRepository.GetSearchResult(query,filter);
            return result;
        } catch (error) {
            throw error;
        }
    }


    async customize(product) {
        try {
            var result = await this.productRepository.customize(product);
          
            return result;
        } catch (error) {
            throw error;
        }
    }


}
    

module.exports = productService;
