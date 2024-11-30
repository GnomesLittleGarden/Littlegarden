// Function to get cookie by name
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to retrieve the cart data from cookies
function getCartFromCookies() {
    const cartCookie = getCookie('cart');
    console.log('Cart cookie content:', cartCookie); // Debugging log
    return cartCookie ? JSON.parse(cartCookie) : [];
}

document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('checkout-cart-items');
    const cartTotalElement = document.getElementById('checkout-cart-total');

    function updateCartSummary() {
        const cartItems = getCartFromCookies(); // Use cookies to get cart data
        console.log('Cart items:', cartItems);  // Debugging log

        // Clear existing items
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalElement.textContent = '$0.00'; // Update the total to $0.00 if cart is empty
            return;
        }

        // Loop through cart items and create HTML for each
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');

            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h2>${item.name}</h2>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
            `;

            cartItemsContainer.appendChild(itemDiv);
        });

        // Update the total in the <span id="checkout-cart-total">
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        console.log('Total price:', total.toFixed(2));  // Debugging log
    }

    // Update cart summary on load
    updateCartSummary();
});

// Function to display cart items and calculate the total price
function displayCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutCartItemsDiv = document.getElementById('checkout-cart-items');
    checkoutCartItemsDiv.innerHTML = ''; // Clear previous items

    let total = 0;

    if (cart.length === 0) {
        checkoutCartItemsDiv.innerHTML = "<p>Your cart is empty!</p>";
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('checkout-item');
            div.textContent = `${item.productName} - $${item.price.toFixed(2)} x ${item.quantity}`;
            checkoutCartItemsDiv.appendChild(div);

            total += item.price * item.quantity;
        });

        // Retrieve discounted total from cookies if any
        const discountedTotal = getCookie('discountedTotal');
        if (discountedTotal) {
            total = parseFloat(discountedTotal); // Apply discounted total if available
        }

        // Update total price in the checkout summary
        document.getElementById('checkout-cart-total').textContent = `$${total.toFixed(2)}`;

        // Trigger shipping cost calculation
        calculateShipping(total);
    }
}

// Function to calculate and display shipping cost
function calculateShipping(cartTotal) {
    const countrySelect = document.getElementById('country');
    const shippingMethodSelect = document.getElementById('shipping-method');
    const shippingCostElem = document.getElementById('shipping-cost');
    const grandTotalElem = document.getElementById('grand-total');

    function updateShipping() {
        const selectedCountry = countrySelect.options[countrySelect.selectedIndex];
        const shippingCost = parseFloat(selectedCountry.getAttribute('data-shipping')) || 0;

        const selectedMethod = shippingMethodSelect.options[shippingMethodSelect.selectedIndex];
        const methodMultiplier = parseFloat(selectedMethod.getAttribute('data-multiplier')) || 1;

        const finalShippingCost = shippingCost * methodMultiplier;
        const grandTotal = cartTotal + finalShippingCost;

        shippingCostElem.textContent = `$${finalShippingCost.toFixed(2)}`;
        grandTotalElem.textContent = `$${grandTotal.toFixed(2)}`;
    }

    countrySelect.addEventListener('change', updateShipping);
    shippingMethodSelect.addEventListener('change', updateShipping);

    // Initial call to update shipping cost when the page loads
    updateShipping();
}

// Show or hide payment fields based on the selected payment method
document.addEventListener('DOMContentLoaded', () => {
    const paymentButtons = document.querySelectorAll('.payment-method-button');
    paymentButtons.forEach(button => {
        button.addEventListener('click', function () {
            paymentButtons.forEach(btn => btn.classList.remove('active-method'));
            this.classList.add('active-method');

            const method = this.getAttribute('data-method');
            document.querySelectorAll('.payment-info').forEach(info => info.classList.remove('visible'));
            document.getElementById(`${method}-info`).classList.add('visible');
        });
    });
});

// Display cart items and shipping when the page loads
document.addEventListener('DOMContentLoaded', displayCheckoutItems);
document.addEventListener('DOMContentLoaded', () => {
    const paymentButtons = document.querySelectorAll('.payment-method-button');
    const paymentInfoSections = document.querySelectorAll('.payment-info');
    const completePurchaseButton = document.getElementById('complete-purchase');

    // Handle Payment Method Switching
    paymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Clear all active states
            paymentButtons.forEach(btn => btn.classList.remove('active-method'));
            paymentInfoSections.forEach(section => section.classList.remove('visible'));

            // Set current active method
            this.classList.add('active-method');
            const selectedMethod = this.getAttribute('data-method');
            document.getElementById(`${selectedMethod}-info`).classList.add('visible');
        });
    });

    // Enable "Complete Purchase" button only after validation
    document.getElementById('checkout-form').addEventListener('input', function() {
        const formValid = this.checkValidity();
        completePurchaseButton.disabled = !formValid;
    });
});
// Real-time validation function
function validateField(field) {
    if (!field.validity.valid) {
        field.style.border = '1px solid red'; // Indicate invalid fields
    } else {
        field.style.border = ''; // Clear border if valid
    }
}

// Apply validation to specific fields
const fieldsToValidate = ['card-number', 'card-expiry', 'card-cvc', 'phone', 'zip'];
fieldsToValidate.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field.addEventListener('input', () => validateField(field));
});
// Show a loading spinner when processing the payment
completePurchaseButton.addEventListener('click', function() {
    completePurchaseButton.disabled = true; // Disable button to prevent multiple clicks
    completePurchaseButton.innerHTML = 'Processing... <span class="spinner"></span>'; // Show spinner
});
// Auto-format Credit Card Number (e.g., 1234 5678 9101 1121)
document.getElementById('card-number').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits
    e.target.value = value;
});

// Auto-format Expiry Date (e.g., MM/YY)
document.getElementById('card-expiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2); // Add slash between MM and YY
    }
    e.target.value = value;
});