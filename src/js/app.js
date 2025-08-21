document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Mobile Menu
    // ==========================================================================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // ==========================================================================
    // Carousel
    // ==========================================================================
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (carouselSlide && carouselItems.length > 0 && prevButton && nextButton) {
        let currentIndex = 0;

        const updateCarousel = () => {
            carouselSlide.style.transform = `translateX(${-currentIndex * 100}%)`;
        };

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    }

    // ==========================================================================
    // Cart
    // ==========================================================================
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon');
    const closeSidebarButton = document.getElementById('close-sidebar-btn');
    const checkoutButton = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutButton = document.querySelector('.close-checkout-btn');

    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.getElementById('total-price');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Cart Sidebar --- //
    if (cartIcon && cartSidebar && closeSidebarButton) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });

        closeSidebarButton.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    // --- Checkout Modal --- //
    if (checkoutButton && checkoutModal && closeCheckoutButton) {
        checkoutButton.addEventListener('click', () => {
            cartSidebar.classList.remove('open'); // Close cart sidebar
            checkoutModal.style.display = 'block';
        });

        closeCheckoutButton.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == checkoutModal) {
                checkoutModal.style.display = 'none';
            }
        });
    }

    // --- Cart Logic --- //
    const updateCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    };

    const displayCartItems = () => {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;

            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('flex', 'justify-between', 'items-center', 'mb-4');
                cartItem.innerHTML = `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">${item.name}</h3>
                        <p class="text-gray-600">$${item.price}</p>
                    </div>
                    <div class="flex items-center">
                        <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 minus-btn" data-index="${index}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 plus-btn" data-index="${index}">+</button>
                        <button class="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 delete-btn" data-index="${index}">Delete</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
                totalPrice += parseFloat(item.price) * item.quantity;
            });

            if (totalPriceElement) {
                totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
            }
        }
    };

    const updateCartCount = () => {
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    };

    const addToCart = (productName, productPrice) => {
        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        updateCart();
    };

    if (cartButtons) {
        cartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productName = button.dataset.productName;
                const productPrice = button.dataset.productPrice;
                addToCart(productName, productPrice);
            });
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const index = target.dataset.index;

            if (target.classList.contains('plus-btn')) {
                cart[index].quantity++;
                updateCart();
            } else if (target.classList.contains('minus-btn')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            } else if (target.classList.contains('delete-btn')) {
                cart.splice(index, 1);
                updateCart();
            }
        });
    }

    // Initial setup
    displayCartItems();
    updateCartCount();
});