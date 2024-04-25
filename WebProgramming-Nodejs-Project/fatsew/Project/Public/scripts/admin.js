document.addEventListener("DOMContentLoaded", function () {
    const contentAdd = document.getElementById("content-1");
    const addProductButton = document.getElementById("add-product");
    const contentUpdate = document.getElementById("content-3");
    const updateProductButton = document.getElementById("update-product");

    addProductButton.addEventListener("click", function () {
        contentAdd.style.display = "flex";
        contentUpdate.style.display = "none";
    });

    updateProductButton.addEventListener("click", function () {
        contentUpdate.style.display = "flex";
        contentAdd.style.display = "none";
    });
});



