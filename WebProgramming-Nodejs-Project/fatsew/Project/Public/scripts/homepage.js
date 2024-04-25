const welcomeHeader = document.getElementById("welcome-header");

const welcomeText = {
    header: "Welcome",
};

function typeText(element, text) {
    let index = 0;
    const intervalId = setInterval(() => {
        element.textContent = text.slice(0, index);
        index++;

        if (index > text.length) {
            clearInterval(intervalId);
        }
    }, 100); // Adjust the interval duration (milliseconds) for the typing speed
}

// Start the typing animation for the header
typeText(welcomeHeader, welcomeText.header);


function applySlideAnimation() {
    const welcomeParagraph = document.getElementById("welcome-paragraph");

    // Set a timeout to delay the animation onload
    setTimeout(() => {
        welcomeParagraph.style.opacity = "1";
        welcomeParagraph.style.transform = "translateY(0)";
    }, 500); // Adjust the delay as needed
}

// Call the function when the window is loaded
window.onload = applySlideAnimation;

document.addEventListener("DOMContentLoaded", function () {
    var navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 0) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
});


window.addEventListener('load', function () {
    var img = document.getElementById('right-con-img');
    img.onload = function () {
        img.classList.add('pixelate');
    };
});


document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
        const quantityElement = card.querySelector('.card-quantity');
        const decreaseButton = card.querySelector('.quantity-btn-decrease');
        const increaseButton = card.querySelector('.quantity-btn-increase');
        const stockElement = card.querySelector('.card-stock span');

        if (decreaseButton && increaseButton) {
            let quantity = 0;

            decreaseButton.addEventListener('click', function () {
                if (quantity > 0) {
                    quantity--;
                    quantityElement.textContent = quantity;
                }
            });

            increaseButton.addEventListener('click', function () {
                const currentStock = parseInt(stockElement.textContent, 10);
                if (quantity < currentStock) {
                    quantity++;
                    quantityElement.textContent = quantity;
                }
            });
        }
    });
});

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var searchInput = document.getElementById('search-input');
    var searchList = document.getElementById('search-list');
    var filter = document.getElementById('choices').value;


    $.ajax({
        url: '/search',
        method: 'POST',
        data: {
            search: searchInput.value,
            search_filter: filter
        },
        success: function (result) {

            searchList.innerHTML = '';

            if (result.status === 200) {
                result.products.forEach(function (product) {
                    var listItem = document.createElement('li');

                    listItem.innerHTML = `
                        <div id="${product.Category}-con">
                           <div id="${product.Category}-items">
                                <div class="card">
                                    <div class="card-inner">
                                        <div class="card-front">
                                            <img src="../images/${product.Name}.jpeg" alt="Image for ${product.Name}">
                                            <p class="price">$${product.Price}</p>
                                            <h1 class="name" data-description="${product.Description}" data-price="${product.Price}" data-stock="${product.StockQuantity}">${product.Name}</h1>
                                        </div>
                                        <div class="card-back">
                                            <p class="card-stock" data-stock="${product.StockQuantity}">Stock:&nbsp;<span>${product.StockQuantity}</span></p>
                                            <p class="card-description">${product.Description}</p>
                                            <button class="go-to-product" data-id="${product.Name}" data-index="1">Go to product</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    searchList.appendChild(listItem);

                    var goToProductButton = listItem.querySelector('.go-to-product');
                    if (goToProductButton) {
                        goToProductButton.addEventListener('click', function () {
                    
                            const productName = goToProductButton.dataset.id;
                            const nameElement = document.querySelector(`.name[data-name="${productName}"]`);
                            if (nameElement) {
                              
                                nameElement.scrollIntoView({ behavior: 'smooth',block: 'center', inline: 'center' });
                            }
                        });
                    }

                });
            } else {
                var noResultsItem = document.createElement('li');
                noResultsItem.textContent = 'No results found.';
                searchList.appendChild(noResultsItem);
            }
        },
        error: function (error) {
            console.error('Error fetching search results:', error);
        }
    });
});


document.getElementById('search-input').addEventListener('focus', function () {
    $('#search-list').addClass('active');
});

document.getElementById('search-input').addEventListener('blur', function () {
    $('#search-list').removeClass('active');
});

