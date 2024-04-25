document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        const addToCartButton = event.target.closest('.add-to-cart-btn');
        const notifyButton = event.target.closest('.notify-btn');

        if (addToCartButton) {
            event.preventDefault();
            handleButtonClick(addToCartButton, 'add-to-cart');
        }

        if (notifyButton) {
            event.preventDefault();
            handleButtonClick(notifyButton, 'notify');
        }
    });

    function handleButtonClick(button, action) {
        const productCategory = button.getAttribute('data-category');
        const productIndex = button.getAttribute('data-index');
        const productContainer = button.closest('.card');
        const productName = productContainer.querySelector('h1').getAttribute('data-name');
        const productDescription = productContainer.querySelector('h1').getAttribute('data-description');
        const productPrice = productContainer.querySelector('h1').getAttribute('data-price');
        const productStock = productContainer.querySelector('h1').getAttribute('data-stock');
        const productQuantity = parseInt(productContainer.querySelector('.card-quantity').textContent, 10);

        if (productQuantity === 0 && action === 'add-to-cart') {

            Swal.fire({
                title: 'Error!',
                text: 'No quantity of ' + productName + ' selected!',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        };

        const data = {
            category: productCategory,
            index: productIndex,
            name: productName,
            description: productDescription,
            price: productPrice,
            stock: productStock,
            quantity: productQuantity
        };

        // AJAX request to the server
        fetch(`/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {

                Swal.fire({
                    text: data.message,
                    confirmButtonText: 'OK'
                });

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

});
document.getElementById('logout-btn').addEventListener('click', function (event) {

    fetch('/logout', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                Swal.fire({
                    text: 'Successfully logged out!',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/';
                    } else {
                        window.location.href = '/';
                    }
                });


            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => console.error('Error:', error));

});

function redirectToServerRoute(route) {
    fetch(route)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            
            console.log(data);
            window.location.href = "http://localhost:1337" + route;

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

document.getElementById('home-link').addEventListener('click', function () {
    redirectToServerRoute('/'); 
});

document.getElementById('contact-link').addEventListener('click', function () {
    redirectToServerRoute('/contact'); 
});

document.getElementById('about-link').addEventListener('click', function () {
    redirectToServerRoute('/customize'); 
});

document.getElementById('orders-link').addEventListener('click', function () {
    redirectToServerRoute('/orders'); 
});

document.getElementById('cart-link').addEventListener('click', function () {
    redirectToServerRoute('/cart')
});
document.getElementById('admin-link').addEventListener('click', function () {
    redirectToServerRoute('/admin');
});