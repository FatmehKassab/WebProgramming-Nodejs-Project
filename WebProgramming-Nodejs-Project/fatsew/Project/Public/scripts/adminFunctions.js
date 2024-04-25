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
    var price = document.getElementById("price").value;
    var stock = document.getElementById("stock").value;
    var description = document.getElementById("description").value;
   

    if (!category || !name || !price || !stock || !description) {

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

    if (!(/^\d+(\.\d+)?$/.test(price)) || !(/^\d+(\.\d+)?$/.test(stock)) || price < 0 || stock < 0) {

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
            title: "Invalid input for price or stock."
        });
        event.preventDefault();
        return;
     }
    
    const data = {
        productCategory: category,
        productName: name,
        productDescription: description,
        productPrice: price,
        productStock: stock
    };

    event.preventDefault();
    var baseURlPost = baseURL + "admin/insert";
    const res = await fetch(baseURlPost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            productCategory: category,
            productName: name,
            productDescription: description,
            productPrice: price,
            productStock: stock
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
            title: "Product succesfully added."
        });
    } else
        if (result.status === 400) {

            Swal.fire({
                text: 'Product not added because product with given name already exists.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
           
        }

        else alert('Internal Server error');


});

document.getElementById("content-3").addEventListener("submit", async function (event) {
    var category = document.getElementById("choices2").value;
    var name = document.getElementById("name2").value;
    var price = document.getElementById("price2").value;
    var stock = document.getElementById("stock2").value;
    var description = document.getElementById("description2").value;
   

    console.log(category);
    console.log(name);
    console.log(price);
    console.log(stock);
    console.log(description);

    if (!name) {

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
            title: "Please select a product."
        });
        event.preventDefault();
        return;

    }

    if (!category && !price && !stock && !description) {

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
            title: "Please fill in at least one field."
        });
        event.preventDefault();
        return;
       
    }
 
    if (!(/^\d+(\.\d+)?$/.test(price)) && price && price < 0 || !(/^\d+(\.\d+)?$/.test(stock)) && stock && stock < 0) {


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
            title: "Invalid input for price or stock."
        });
        event.preventDefault();
        return;
      
    }
    
    const data = {
        productCategory:category,
        productName: name,
        productDescription: description,
        productPrice: price,
        productStock: stock
    };


    event.preventDefault();
    var baseURlPost = baseURL + "admin/update";
    const res = await fetch(baseURlPost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            productCategory: category,
            productName: name,
            productDescription: description,
            productPrice: price,
            productStock: stock
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
            title: "Product succesfully updated."
        });

    } else alert('Internal Server error');



});
