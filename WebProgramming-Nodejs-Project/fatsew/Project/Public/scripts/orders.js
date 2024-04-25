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