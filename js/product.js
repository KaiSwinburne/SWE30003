export class Product {
    constructor(data) {
        this.id = Math.floor(Math.random() * 10000);
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

        card.innerHTML = 
        `
            <img src="../assets/${this.imageURL}" alt="${this.name}">
            <div class="desc">
                <span>${this.brand}</span>
                <h5>${this.name}</h5>
                <h4>$${this.price}</h4>
                <p>Ratings: ${this.ratings} <i class="fa-solid fa-star" style="color:rgb(255, 221, 0);"></i></p>
                <p>${this.availability}</p>
            </div>
            <button>Add to Cart</button>
        `

        card.onclick = () => this.showDetails();
        return card;
    }


    //testing purposes
    showDetails(){
        alert(`${this.name}\n${this.description}\n$${this.price}`);
    }
}