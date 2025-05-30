export class Order{
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.address = data.address;
        this.cardName = data.cardName;
        this.cardNumber = data.cardNumber;
        this.cardExpiry = data.cardExpiry;
        this.cardCVV = data.cardCVV;
        this.cartItems = data.cartItems;
        this.total = data.total;
        this.status = 'Pending'; // Default
    }

    renderOrderSummary() {
        const orderSummary = document.createElement('div');
        orderSummary.className = 'order-summary';

        orderSummary.innerHTML = `
            <div class="desc">
                <h2>Order Summary</h2>
                <p><strong>Name:</strong> ${this.name}</p>
                <p><strong>Email:</strong> ${this.email}</p>
                <p><strong>Address:</strong> ${this.address}</p>
                <p><strong>Total:</strong> $${this.total.toFixed(2)}</p>
                <h3>Items:</h3>
                <ul>
                    ${this.items.map(item => `<li>${item.name} (x${item.quantity})</li>`).join('')}
                </ul>
            </div>
        `;

        return orderSummary;
    }
}