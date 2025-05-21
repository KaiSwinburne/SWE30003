import { Product } from './product.js';

document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const productId = url.get('id');

    if(!productId) {
        console.error("Product ID not found in URL");
        return;
    }

    fetch(`http://localhost:3000/api/product/${productId}`)
        .then(res => res.json()) //get data from server
        .then(productData => {
            const product = new Product(productData);
            const imgContainer = document.querySelector('.single-product-img');
            const descContainer = document.querySelector('.single-product-desc');

            if (!descContainer || !imgContainer) {
                console.error("Missing required class divs in HTML");
                return;
            }

            //image preview
            imgContainer.innerHTML = `
                <img src="../assets/${product.imageURL}" alt="${product.name} id="main-img">
            `;
            
            //product description
            descContainer.innerHTML = `
                <h6>${product.category}</h6>
                <h5>${product.brand}</h5>
                <h3>${product.name}</h3>
                <p class="ratings">Ratings: ${product.ratings} <i class="fa-solid fa-star" style="color:rgb(255, 221, 0);"></i></p>
                <h4 class="price">$${product.price}</h4>
                <h4>Key Features</h4>
                <span>${product.desc}</span>
                
                <p>${product.availability}</p>
                <input type="number" min="1" max="${product.stock}" value="1">
                <button>Add to Cart</button>
            `;

        })
        .catch(error => console.error('Error fetching product details:', error));
});