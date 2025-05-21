export class Product {
    constructor(data) {
        this.id = data.ID;
        this.name = data.Name;
        this.desc = data.Description;
        this.brand = data.Brand;
        this.category = data.Category;
        this.price = data.Price;
        this.stock = data.Stock;
        this.size = data.Size;
        this.availability = data.Availability;
        this.ratings = data.Ratings;
        this.imageURL = data.imageURLs || '../assets/default.jpg';
        this.featured = data.Featured;
    }
    
    renderCard(){
        const card = document.createElement('div');
        card.className = 'product';

        // Check if product is available
        const isAvailable = this.isAvailable();

        card.innerHTML = 
        `
            <img src="../assets/${this.imageURL}" alt="${this.name}">
            <div class="desc">
                <span>${this.brand}</span>
                <h5>${this.name}</h5>
                <h4>${this.price}</h4>
                <p>Ratings: ${this.ratings} <i class="fa-solid fa-star" style="color:rgb(255, 221, 0);"></i></p>
                <p class="availability">${this.availability}</p>
            </div>
            <button class="add-to-cart-btn" data-id="${this.id}" 
                ${!isAvailable ? 'disabled style="background-color: #cccccc; cursor: not-allowed;"' : ''}>
                ${isAvailable ? 'Add to Cart' : 'Cannot Add to Cart'}
            </button>
        `

        // Product card click (navigates to product detail page)
        const productImg = card.querySelector('img');
        const productDesc = card.querySelector('.desc');
        
        productImg.addEventListener('click', () => {
            window.location.href = `product.html?id=${this.id}`;
        });
        
        productDesc.addEventListener('click', () => {
            window.location.href = `product.html?id=${this.id}`;
        });
        
        // Add to cart button click - only if available
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (isAvailable) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent navigation to product detail page
                this.addToCart();
            });
        }
        
        return card;
    }

    isAvailable() {
        const unavailableTerms = ['discontinued', 'out of stock', 'sold out', 'unavailable'];
        
        // Check if availability contains any of the unavailable terms (case insensitive)
        if (this.availability) {
            const availabilityLower = this.availability.toLowerCase();
            return !unavailableTerms.some(term => availabilityLower.includes(term));
        }
        
        // If no availability info or stock is 0, consider unavailable
        return this.stock > 0;
    }

    addToCart(quantity = 1) {
        // Import here to avoid circular dependency
        import('./cartManager.js').then(module => {
            const { addToCart } = module;
            
            // Convert product to the format expected by addToCart
            const productData = {
                ID: this.id,
                Name: this.name,
                Price: this.price,
                imageURLs: this.imageURL
            };
            
            addToCart(productData, quantity);
            
            // Create and show the notification message
            this.showAddedToCartMessage();
        });
    }
    
    showAddedToCartMessage() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa-solid fa-check-circle"></i>
                <span>${this.name} added to cart!</span>
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
        
        // Add to the DOM
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
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    //testing purposes
    showDetails(){
        alert(`${this.name}\n${this.description}\n$${this.price}`);
    }
}
