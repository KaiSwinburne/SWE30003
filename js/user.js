export class User{
    constructor(name) {
        this.id = Math.floor(Math.random() * 1000000); 
        this.username = name;
        this.password = null; 
    }
    
    getName() {
        return this.name;
    }    
    
    setName(name) {
        this.name = name;
    }
    
    getId() {
        return this.id;
    }

    updateProfile(name, password) {
        this.username = name;
        this.password = password;
    }

    renderUserCard() {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        userCard.innerHTML = `
        <div class="desc">
            <h3>${this.username}</h3>
            <p>User ID: ${this.id}</p>
        </div>
        `;
        
        return userCard;
    }
}