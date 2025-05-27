import { Product } from './product.js';
import { addToCart } from './cartManager.js';

// Function to check if product is available for purchase
function isProductAvailable(product) {
    const unavailableTerms = ['discontinued', 'out of stock', 'sold out', 'unavailable'];
    
    // Check if availability contains any of the unavailable terms (case insensitive)
    if (product.availability) {
        const availabilityLower = product.availability.toLowerCase();
        return !unavailableTerms.some(term => availabilityLower.includes(term));
    }
    
    // If no availability info or stock is 0, consider unavailable
    return product.stock > 0;
}

// Function to show notification message
function showAddedToCartMessage(productName, quantity) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa-solid fa-check-circle"></i>
            <span>${quantity} ${productName}${quantity > 1 ? 's' : ''} added to cart!</span>
        </div>
    `;
    
    // Add styles to the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    
    // Add styles to the content
    const content = notification.querySelector('.notification-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.gap = '10px';
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

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
                <img src="../assets/${product.imageURL}" alt="${product.name}" id="main-img">
            `;
            
            //product description
            descContainer.innerHTML = `
                <h6>${product.category}</h6>
                <h5>${product.brand}</h5>
                <h3>${product.name}</h3>
                <p class="ratings">Ratings: ${product.ratings} <i class="fa-solid fa-star" style="color:rgb(255, 221, 0);"></i></p>
                <h4 class="price">${product.price}</h4>
                <h4>Key Features</h4>
                <span>${product.desc}</span>
                
                <p class="availability">${product.availability}</p>
                <input type="number" id="quantity" min="1" max="${product.stock}" value="1" ${isProductAvailable(product) ? '' : 'disabled'}>
                <button id="add-to-cart-btn" ${isProductAvailable(product) ? '' : 'disabled style="background-color: #cccccc; cursor: not-allowed;"'}>
                    ${isProductAvailable(product) ? 'Add to Cart' : 'Cannot Add to Cart'}
                </button>
            `;

            // Add event listener to the Add to Cart button only if product is available
            const addToCartBtn = document.getElementById('add-to-cart-btn');
            const quantityInput = document.getElementById('quantity');
            
            if (isProductAvailable(product)) {
                addToCartBtn.addEventListener('click', () => {
                    const quantity = parseInt(quantityInput.value);
                    
                    if (quantity > 0 && quantity <= product.stock) {
                        // Convert product to the format expected by addToCart
                        const productData = {
                            ID: product.id,
                            Name: product.name,
                            Price: product.price,
                            imageURLs: product.imageURL
                        };
                        
                        addToCart(productData, quantity);
                        showAddedToCartMessage(product.name, quantity);
                    } else {
                        alert('Please select a valid quantity.');
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
});
