document.addEventListener("DOMContentLoaded", function () {
    const cartButton = document.getElementById("cartButton");
    const addToCartButtons = document.querySelectorAll(".book .ac button");
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartModal = document.querySelector(".modal");
    const closeModal = document.getElementById("closeModal");
    const checkoutButton = document.querySelector(".checkout-button");

    let cart = []; // Cart holds book objects with quantities

    // Open cart modal
    cartButton.addEventListener("click", () => {
        updateCartModal();
        cartModal.style.display = "flex";
    });

    // Close cart modal
    closeModal.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    // Add book to cart
    addToCartButtons.forEach((button) => {
        const bookCard = button.closest(".book");
        const bookName = bookCard.querySelector(".Book-name").textContent;
        const price = parseFloat(bookCard.querySelector(".price").textContent.slice(1));

        button.addEventListener("click", () => {
            let bookInCart = cart.find(item => item.name === bookName);
            
            if (!bookInCart) {
                cart.push({ name: bookName, price, quantity: 1 });
                alert(`${bookName} added to your cart!`);
            } else {
                bookInCart.quantity++;
                alert(`Increased quantity of ${bookName} in your cart!`);
            }

            updateCartDisplay();
            updateCartModal();
        });
    });

    // Update cart display with quantity buttons
    function updateCartDisplay() {
        addToCartButtons.forEach(button => {
            const bookCard = button.closest(".book");
            const bookName = bookCard.querySelector(".Book-name").textContent;
            let bookInCart = cart.find(item => item.name === bookName);

            if (bookInCart) {
                button.textContent = "In Cart";
                button.disabled = true; // Disable Add to Cart button when it's in the cart

                // Check if quantity controls already exist
                let quantityDiv = button.closest(".ac").querySelector(".quantity-controls");

                if (!quantityDiv) {
                    quantityDiv = document.createElement("div");
                    quantityDiv.classList.add("quantity-controls");

                    quantityDiv.innerHTML = `
                        <button class="decrease" aria-label="Decrease quantity">-</button> 
                        <input type='text' value="${bookInCart.quantity}" readonly aria-label="Quantity" />
                        <button class='increase' aria-label="Increase quantity">+</button>`;

                    button.closest(".ac").appendChild(quantityDiv);

                    // Decrease button logic
                    quantityDiv.querySelector(".decrease").addEventListener("click", () => {
                        if (bookInCart.quantity > 1) {
                            bookInCart.quantity--;
                            updateCartModal();
                            updateCartDisplay(); // Update the UI
                        }
                    });

                    // Increase button logic
                    quantityDiv.querySelector(".increase").addEventListener("click", () => {
                        bookInCart.quantity++;
                        updateCartModal();
                        updateCartDisplay(); // Update the UI
                    });
                }

                // Update the quantity input field with the latest quantity
                quantityDiv.querySelector("input").value = bookInCart.quantity;
            }
        });
    }

    // Update cart modal content with total price and item details
    function updateCartModal() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        let totalPrice = 0;

        cart.forEach(item => {
            totalPrice += item.price * item.quantity;

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <span>${item.name}</span> 
                <span>$${item.price}</span> 
                <input type='text' value="${item.quantity}" readonly aria-label="Quantity" />`;

            cartItemsContainer.appendChild(itemDiv);
            
            // Attach event listeners to quantity controls in the modal
            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.setAttribute('aria-label', 'Decrease quantity');
            
            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.setAttribute('aria-label', 'Increase quantity');

            itemDiv.appendChild(decreaseButton);
            itemDiv.appendChild(increaseButton);

            decreaseButton.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    updateCartModal();
                    updateCartDisplay(); // Update product display
                }
            });

            increaseButton.addEventListener('click', () => {
                item.quantity++;
                updateCartModal();
                updateCartDisplay(); // Update product display
            });
        });

        // Update total price in the modal
        const totalPriceElement = document.querySelector(".modal-content .total-price");
        totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    }

    // Ensure cart modal closes when clicking outside the modal content
    cartModal.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = "none";
        }
    });
});
