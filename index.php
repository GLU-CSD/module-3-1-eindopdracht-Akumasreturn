<?php include 'header.php'; ?>

<section id="home">
    <h2>Welcome to PS5 Accessories Shop</h2>
    <p>Your one-stop shop for the best PS5 controller accessories.</p>
</section>

<section id="products">
    <h1>Our Products</h1>
    <div class="Dispage">
        <ul class="products">
        
        </ul>
    </div>
</section>

<section id="about">
    <h2>About Us</h2>
    <p>We provide high-quality accessories to enhance your gaming experience.</p>
</section>

<section id="contact">
    <h2>Contact Us</h2>
    <p>Reach out to us for any inquiries or support.</p>
</section>

<section id="productview">
    <div id="product-back-container">
        <button id="back-to-products">← Back to Products</button>
    </div>
    <div id="productview-container">
        <!-- Will be populated dynamically -->
    </div>
</section>

<section id="Cart">
    <h2>Shopping Cart</h2>
    <p>Review your items before proceeding to checkout.</p>
    <div id="cart-display"></div>
    <div class="cart-actions" style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
        <button class="ContinueShopping" style="padding: 10px 20px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Continue Shopping</button>
        <button class="ClearCart" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear Cart</button>
        <button class="ProceedToCheckout" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Proceed to Checkout</button>
    </div>
</section>

<section id="profile">
    <h2>Profile</h2>
    <p>View your account details.</p>
    <div>
        <p id="profileUsername"></p>
        <div id="adminPanelLinkContainer"></div> 
        <button class="logoutBtn">Logout</button>
    </div>
</section>

<section id="Checkout">
    <h2>Checkout</h2>
    <p>Proceed with your payment.</p>
    <div id="paypal-button-container"></div>
    <button class="Cancel">Cancel</button>
</section>

<section id="login">
    <h2>Login</h2>
    <div>
        <input
            class="logfrm"
            type="text"
            id="username"
            placeholder="Username"
        >
        <input
            class="logfrm"
            type="password"
            id="password"
            placeholder="Password"
        >
    </div>
    <div class="logbtns">
        <button class="LOGIN">Login</button>
        <button class="registerBtn">Register</button>
        <p id="loginStatus"></p>
    </div>
</section>

<section id="register">
    <h2>Register</h2>
    <div>
        <input
            class="regfrm"
            type="text"
            id="newUsername"
            placeholder="Username"
        >
        <input
            class="regfrm"
            type="password"
            id="newPassword"
            placeholder="Password"
        >
        <input
            class="regfrm"
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
        >
    </div>
    <div class="logbtns">
        <button class="REGISTER">Register</button>
        <button class="loginPage">Back</button>
        <p id="registerStatus"></p>
    </div>
</section>

<section id="logout">
    <h2>Logout</h2>
    <p>Are you sure you want to logout?</p>
    <div>
        <button class="LOGOUT">Yes</button>
        <button class="Cancel">No</button>
    </div>
</section>

<section id="orderForm">
    <div class="formcontainer">
        <div id="orderData"></div>
    </div>
</section>

<?php include 'footer.php'; ?>
