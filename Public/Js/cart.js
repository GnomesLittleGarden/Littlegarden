// Set and get cookies functions with localStorage fallback
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    localStorage.setItem(name, value);  // Fallback to localStorage
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return localStorage.getItem(name);  // Fallback if cookie isn't available
}

// Confirm before removing an item with fade-out animation
function removeItem(index) {
    if (!confirm("Are you sure you want to remove this item?")) return;

    const cartItemsContainer = document.querySelectorAll('.cart-item')[index];
    cartItemsContainer.style.transition = "opacity 0.5s";
    cartItemsContainer.style.opacity = 0;

    setTimeout(() => {
        let cart = getCookie('cart');
        cart = cart ? JSON.parse(cart) : [];
        cart.splice(index, 1); // Remove the item at the given index
        setCookie('cart', JSON.stringify(cart), 7); // Update cookie
        loadCart(); // Refresh the cart display
    }, 500); // Wait for the animation to finish
}

// Update the quantity of an item in the cart
function updateQuantity(index, change) {
    let cart = getCookie('cart');
    cart = cart ? JSON.parse(cart) : [];
    cart[index].quantity += change;

    // Ensure quantity doesn't go below 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }

    setCookie('cart', JSON.stringify(cart), 7); // Update cookie
    loadCart(); // Refresh the cart display
}

// Load and display the cart items on the cart page
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');

    // Retrieve the cart from cookies
    let cart = getCookie('cart');
    cart = cart ? JSON.parse(cart) : [];

    cartItemsContainer.innerHTML = ''; // Clear existing items
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: 
                    <button onclick="updateQuantity(${index}, -1)" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                    ${item.quantity}
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
                <button onclick="removeItem(${index})">Remove</button>
                <hr>
            </div>
        `;
        cartItemsContainer.innerHTML += itemElement;
    });

    cartTotalContainer.textContent = total.toFixed(2);
    
    // Store the total in cookies so it can be passed to the checkout page
    setCookie('cartTotal', total.toFixed(2), 7); // Update total in cookies
    
    // Update cart count in the navbar
    updateCartCount(cart.length);
}

// Load and display the cart items on the checkout page
function loadCheckoutCart() {
    const checkoutItemsContainer = document.getElementById('checkout-cart-items');
    const checkoutTotalContainer = document.getElementById('checkout-cart-total');

    let cart = getCookie('cart');
    cart = cart ? JSON.parse(cart) : [];

    checkoutItemsContainer.innerHTML = ''; // Clear existing items
    let total = 0;

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = `
            <div class="checkout-item">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
                <hr>
            </div>
        `;
        checkoutItemsContainer.innerHTML += itemElement;
    });

    // Display total from cart or use the previously stored total
    const storedTotal = getCookie('cartTotal');
    if (storedTotal) {
        total = parseFloat(storedTotal);
    }

    checkoutTotalContainer.textContent = total.toFixed(2);
}

// Function to update the cart count dynamically
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Load the correct cart data on the appropriate page
window.onload = function () {
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    } else if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutCart();
    }
};
function applyCoupon() {
    const couponInput = document.getElementById('coupon').value.trim();
    const coupons = {
        'DISCOUNT10': 0.10,
        'DISCOUNT20': 0.20,
        'SAVE5': 5.00
    };

    if (couponInput in coupons) {
        let discount = coupons[couponInput];
        let currentTotal = parseFloat(document.getElementById('cart-total').textContent);

        if (discount < 1) {
            currentTotal = currentTotal - (currentTotal * discount);
        } else {
            currentTotal = currentTotal - discount;
        }

        if (currentTotal < 0) {
            currentTotal = 0;
        }

        document.getElementById('cart-total').textContent = currentTotal.toFixed(2);

        // Save the applied coupon in cookies
        setCookie('appliedCoupon', couponInput, 7); // Save for 7 days

        alert(`Coupon applied! Your new total is $${currentTotal.toFixed(2)}.`);
    } else {
        alert('Invalid coupon code. Please try again.');
    }
}

// Check if a coupon was applied previously and apply it again
function checkAppliedCoupon() {
    const appliedCoupon = getCookie('appliedCoupon');
    if (appliedCoupon) {
        document.getElementById('coupon').value = appliedCoupon;
        applyCoupon(); // Reapply the coupon
    }
}

window.onload = function() {
    loadCart();
    checkAppliedCoupon(); // Check if a coupon was previously applied
};
// Function to apply a coupon
function applyCoupon() {
    const couponInput = document.getElementById('coupon').value.trim();
    
    // Define valid coupon codes and their discounts
    const coupons = {
        'DISCOUNT10': 0.10, // 10% off
        'DISCOUNT20': 0.20, // 20% off
        'SAVE5': 5.00 // $5 off
    };

    // Check if the entered coupon is valid
    if (couponInput in coupons) {
        let discount = coupons[couponInput];
        let currentTotal = parseFloat(document.getElementById('cart-total').textContent);

        // If the coupon is a percentage discount
        if (discount < 1) {
            currentTotal = currentTotal - (currentTotal * discount);
        } else {
            // If the coupon is a fixed discount
            currentTotal = currentTotal - discount;
        }

        // Ensure the total doesn't go below zero
        if (currentTotal < 0) {
            currentTotal = 0;
        }

        // Update the cart total with the discounted amount
        document.getElementById('cart-total').textContent = currentTotal.toFixed(2);

        alert(`Coupon applied! Your new total is $${currentTotal.toFixed(2)}.`);
    } else {
        alert('Invalid coupon code. Please try again.');
    }
}
