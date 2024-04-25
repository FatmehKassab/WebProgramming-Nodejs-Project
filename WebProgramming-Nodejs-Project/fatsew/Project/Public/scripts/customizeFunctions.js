const baseURL = "http://localhost:1337/";
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
                    }
                    else {
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

document.getElementById("content-1").addEventListener("submit", async function (event) {
    var category = document.getElementById("choices").value;
    var name = document.getElementById("name").value;
    var color = document.getElementById("color").value;
    var size = document.getElementById("size").value;
    var description = document.getElementById("description").value;
   

    if (!category || !name || !color || !size || !description) {

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
            icon: "warning",
            title: "Please fill in at all required fields."
        });
        event.preventDefault();
        return;

    }

 
    
    const data = {
        productCategory: category,
        productName: name,
        productDescription: description,
        productColor: color,
        productSize: size
    };

    event.preventDefault();
    var baseURlPost = baseURL + "customize";
    const res = await fetch(baseURlPost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            productCategory: category,
            productName: name,
            productDescription: description,
            productColor: color,
            productSize: size
        }),
    });

    const result = await res.json();

    if (result.status === 200) {

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
            icon: "success",
            title: "Customization succesfully added."
        });
    } else
        if (result.status === 400) {

            Swal.fire({
                text: 'Customization failed.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
           
        }

        else alert('Internal Server error');


});

document.getElementById('btn-add-product').addEventListener('click', function (event) {


    fetch(`/submitt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {


            Swal.fire({
                title: "Customization sent!",
                icon: "success",
                confirmButtonText: 'ok'
            }).then((result) => {
                if (result.isConfirmed) {

                    window.location.href = '/';
                } else {
                    window.location.href = '/';
                }
            });


        })
        .catch(error => {
            console.error('Error:', error);
        });

 

});