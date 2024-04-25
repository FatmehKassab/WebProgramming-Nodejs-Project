document.addEventListener('DOMContentLoaded', function () {

    // Get all the remove buttons in the document
    var removeButtons = document.querySelectorAll('.card-btn-add-to-cart');

    var quantityElement2;
    var productName;

    // Iterate over each remove button and attach event listeners
    removeButtons.forEach(function (removeButton) {
        removeButton.addEventListener('click', function () {
            // Get the relevant elements within the card
            var card = removeButton.closest('.card');
            productName = card.querySelector('.name').textContent;
            var quantityElement = card.querySelector('.quantity-controls .card-quantity');
            quantityElement2 = card.querySelector('.card-quantity span');
            var quantity = parseInt(quantityElement.textContent);
            var quantity2 = parseInt(quantityElement2.textContent);

            if (quantity === 0) {

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "error",
                    title: `Your quantity is 0.No items of ${productName} removed`
                });

                return;
            }

            $.ajax({
                url: '/update-quantity', 
                method: 'POST',
                data: { name: productName, newquantity: quantity, displayquantity: quantity2 },
                success: function (updatedData) {
                    Swal.fire({
                        title: 'Cart Updated!',
                        text: `You removed ${quantity} ${productName} from your shopping cart.`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // If the user clicks "OK" in the SweetAlert dialog, then redirect
                            window.location.href = '/cart';
                        } else {
                            window.location.href = '/cart';
                        }
                    });

                },
                error: function (error) {
                    console.error('Error updating quantity:', error);
                }
            });




        });
    });

    // Get all the quantity controls in the document
    var quantityControls = document.querySelectorAll('.quantity-controls');

    // Iterate over each quantity control and attach event listeners
    quantityControls.forEach(function (quantityControl) {
        // Get the relevant elements within the quantity control
        var productNameControl = quantityControl.querySelector('.name1').textContent;
        var cardQuantityElement = quantityControl.closest('.card-back').querySelector('.card-quantity span');
        var stock = parseInt(cardQuantityElement.textContent);
        var decreaseButton = quantityControl.querySelector('.quantity-btn-decrease');
        var quantityDisplay = quantityControl.querySelector('.card-quantity');
        var increaseButton = quantityControl.querySelector('.quantity-btn-increase');
        // Set initial quantity value
        var quantity = 0;
        decreaseButton.addEventListener('click', function () {
            if (quantity > 0) {
                quantity--;
                updateQuantity();
            }
        });

        increaseButton.addEventListener('click', function () {
            if (quantity < stock) {
                quantity++;
                updateQuantity();
            }
        });

        // Function to update the displayed quantity
        function updateQuantity() {
            quantityDisplay.textContent = quantity;
        }
    });
});



document.addEventListener('DOMContentLoaded', function () {//add the order's page and take from the user an array of products 

    var proceedOrderButton = document.getElementById('btn-submit');
    proceedOrderButton.addEventListener('click', function () {


        Swal.fire({
            text: "Are you sure you want to proceed with your order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5cdb5c",
            cancelButtonColor: "#d33",
            confirmButtonText: "PROCCED"
        }).then((result) => {
            if (result.isConfirmed) {

                var total = parseFloat(document.getElementById('totalValue').textContent) ?? 0;

                data = {

                    totalValue: total

                };

                fetch(`/proccedOrder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then(response => response.json())
                    .then(data => {

 
                        Swal.fire({
                            title: "Order Placed!",
                            text: "Order confirmed! Thank you for your purchase.",
                            icon: "success",
                            confirmButtonText: 'GREAT'
                        }).then((result) => {
                            if (result.isConfirmed) {

                                window.location.href = '/cart';
                            } else {
                                window.location.href = '/cart';
                            }
                        });


                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

             
            }
        });

    });
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