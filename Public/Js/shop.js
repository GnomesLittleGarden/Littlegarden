// Array to hold product details
const products = [
    {
        name: "Starter 420 Kit",
        price: 49.99,
        image: "images/BOX.jpg",
        hoverImage: "images/Full Kit.jpg",
        category: "starter-kits"
    },
    {
        name: "Premium Magic Pipe",
        price: 29.99,
        image: "images/magic_pipe.jpg",
        hoverImage: "images/magic_pipe_hover.jpg",
        category: "accessories"
    },
    {
        name: "Enchanted Grinder",
        price: 19.99,
        image: "images/grinder.jpg",
        hoverImage: "images/grinder_hover.jpg",
        category: "accessories"
    }
];

// Get reference to product grid
const productGrid = document.getElementById('product-grid');

// Load cart from localStorage or initialize an empty array if it doesn't exist
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render products dynamically
function renderProducts() {
    products.forEach(product => {
        const productItem = `
            <div class="product-item">
                <a href="product-details.html" class="product-link">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" class="main-image">
                        <img src="${product.hoverImage}" alt="${product.name} Hover" class="hover-image">
                    </div>
                </a>
                <p>${product.name} - $${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            </div>
        `;
        productGrid.innerHTML += productItem;
    });

    // Attach event listeners to Add-to-Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent the anchor tag from redirecting to the product details page
            e.preventDefault();

            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            addToCart(productName, productPrice);
        });
    });
}


// Update cart count in navigation
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// Initialize shop page by rendering products and updating the cart count
window.onload = function() {
    renderProducts();
    updateCartCount(); // Ensure the cart count is updated on page load
};
