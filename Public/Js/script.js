// Sticky Navigation Bar with Background Transition
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.top-nav');
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Smooth Scrolling for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// FAQ Accordion Functionality
document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
        let content = item.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight ? null : `${content.scrollHeight}px`;
    });
});

// Scroll to Top Button
(() => {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerText = '↑';
    scrollToTopBtn.classList.add('scroll-to-top');
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
})();

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img.lazy');

    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));
    } else {
        const lazyLoad = () => {
            lazyImages.forEach(lazyImage => {
                if (lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) {
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                }
            });
        };

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
});

// Remove duplicate Add to Cart functionality (handled in shop.js) and update cart page functionality

// Function to display cart items on the cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Update the total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// If you're on the cart page, display the cart items
if (window.location.pathname.endsWith('cart.html')) {
    displayCartItems();
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    // JSON.stringify and path, no URI encoding to simplify storage/retrieval
    document.cookie = `${name}=${JSON.stringify(value)};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return JSON.parse(value || '[]'); // Use JSON.parse directly
    }
    return [];
}

function addToCart(name, price, image) {
    let cartItems = getCookie('cartItems') || [];
    const existingItem = cartItems.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name, price, quantity: 1, image });
    }

    setCookie('cartItems', cartItems, 7); // 7-day expiry with path
    console.log("Item added to cart:", cartItems); // Log to check
    alert(`${name} added to cart!`);
}

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = getCookie("cartItems"); // Retrieve items directly from cookie
    console.log("Loaded cart items from cookie:", cartItems); // Log to confirm
    const cartContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    function loadCart() {
        cartContainer.innerHTML = "";
        let total = 0;

        if (cartItems.length === 0) {
            document.getElementById("empty-cart").style.display = "block";
            document.getElementById("cart-summary").style.display = "none";
        } else {
            document.getElementById("empty-cart").style.display = "none";
            document.getElementById("cart-summary").style.display = "block";

            cartItems.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemHTML = `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
                        <div class="cart-item-info">
                            <h3>${item.name}</h3>
                            <p>Price: $${item.price.toFixed(2)}</p>
                            <div class="cart-item-controls">
                                <button onclick="changeQuantity(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="changeQuantity(${index}, 1)">+</button>
                            </div>
                            <p>Total: $${itemTotal.toFixed(2)}</p>
                            <button onclick="removeItem(${index})">Remove</button>
                        </div>
                    </div>`;
                cartContainer.innerHTML += cartItemHTML;
            });
        }

        cartTotalElement.textContent = total.toFixed(2);
    }

    loadCart();
});

