import Auth from './auth.js';
import Cart from './cart.js';

const baseUrl = window.location.href.includes("localhost") 
  ? "http://localhost/webshopschool"
  : window.location.origin;

document.addEventListener("DOMContentLoaded", function () {
  const profileContainer = document.querySelector(".profile");
  const sidebar = document.getElementById("sidebar");
  const sidebarContainer = document.getElementById("sidebarContainer");
  const header = document.querySelector("header");
  let selectedProductImage = "";
  const cart = new Cart();

  // Add modal container after existing declarations
  const modalContainer = document.createElement('div');
  modalContainer.id = 'productModal';
  modalContainer.style.display = 'none';
  modalContainer.style.position = 'fixed';
  modalContainer.style.bottom = '0';
  modalContainer.style.left = '0';
  modalContainer.style.width = '100%';
  modalContainer.style.height = '60vh';
  modalContainer.style.backgroundColor = 'white';
  modalContainer.style.zIndex = '1000';
  modalContainer.style.padding = '20px';
  modalContainer.style.boxSizing = 'border-box';
  modalContainer.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.2)';
  modalContainer.style.borderRadius = '20px 20px 0 0';
  modalContainer.style.transition = 'transform 0.3s ease-out';
  modalContainer.style.transform = 'translateY(100%)';
  document.body.appendChild(modalContainer);

  // Add modal functions
  function showProductModal(product) {
    // Only show modal on mobile devices
    if (window.innerWidth > 768) return;

    modalContainer.innerHTML = `
      <button class="closeModal" style="position:absolute;right:10px;top:10px;font-size:24px;border:none;background:none;color:black;padding:10px;cursor:pointer;">&times;</button>
      <div style="display:flex;flex-direction:column;height:100%;gap:10px;padding-top:20px;">
        <img src="${product.image}" alt="${product.name}" style="max-height:35%;object-fit:contain;">
        <h2 style="margin:0;font-size:1.2em;">${product.name}</h2>
        <p style="flex-grow:1;overflow-y:auto;margin:0;font-size:0.9em;">${product.description}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;">
          <strong style="font-size:1.2em;">$${product.price}</strong>
          <button class="addToCart" style="padding:8px 16px;">Add to Cart</button>
        </div>
      </div>
    `;
    
    modalContainer.style.display = 'block';
    // Allow animation to start
    setTimeout(() => {
      modalContainer.style.transform = 'translateY(0)';
    }, 10);
    
    modalContainer.querySelector('.closeModal').addEventListener('click', hideProductModal);
    modalContainer.querySelector('.addToCart').addEventListener('click', (e) => {
      e.stopPropagation();
      cart.addItem(product);
    });
  }

  function hideProductModal() {
    modalContainer.style.transform = 'translateY(100%)';
    setTimeout(() => {
      modalContainer.style.display = 'none';
    }, 300);
  }

  // Initialize UI and get profileImage element
  const profileImage = Auth.updateLoginUI(profileContainer);
  profileImage.addEventListener("click", function () {
    if (localStorage.getItem("loggedIn") === "true") {
      toggleSidebar();
    } else {
      showPage("login");
    }
  });

  // Function to apply sideshadows to selected section
  function applySideShadows(section) {
    let leftShadow = section.querySelector(".sideshadowL");
    let rightShadow = section.querySelector(".sideshadowR");

    if (!leftShadow || !rightShadow) {
      leftShadow = document.createElement("div");
      leftShadow.classList.add("sideshadowL");
      section.appendChild(leftShadow);

      rightShadow = document.createElement("div");
      rightShadow.classList.add("sideshadowR");
      section.appendChild(rightShadow);
    }

    leftShadow.style.transition = "none";
    rightShadow.style.transition = "none";
    leftShadow.style.width = "0%";
    rightShadow.style.width = "0%";

    setTimeout(() => {
      leftShadow.style.transition = "width 0.5s ease-in-out";
      rightShadow.style.transition = "width 0.5s ease-in-out";
      leftShadow.style.width = "30%";
      rightShadow.style.width = "30%";

      setTimeout(() => {
        leftShadow.style.transition = "width 0.5s ease-in-out";
        rightShadow.style.transition = "width 0.5s ease-in-out";
        leftShadow.style.width = "20%";
        rightShadow.style.width = "20%";
      }, 500);
    }, 50);
  }

  function showPage(pageId) {
    const currentSection = document.querySelector(
      'section[style="display: block;"]'
    );

    if (currentSection && currentSection.id === pageId) {
      return;
    }

    const allSections = document.querySelectorAll("section");
    allSections.forEach((section) => {
      section.style.display = "none";
    });

    const selectedSection = document.getElementById(pageId);
    if (selectedSection) {
      selectedSection.style.display = "block";
      applySideShadows(selectedSection);

      if (pageId === "orderForm") {
        cart.displayOrderForm();
      }
    }
  }

  function toggleSidebar() {
    if (!sidebar) return;

    sidebar.classList.toggle("open");

    if (sidebar.classList.contains("open")) {
      sidebarContainer.innerHTML = `
            <button class="closeBtn">&times;</button>
            <div class="profileContainer">
                <div class="profileIcon profileButton">
                    <div class="profile-letter">${(localStorage.getItem("username") || "Guest").charAt(0).toUpperCase()}</div>
                </div>
                <div class="usernameContainer">
                    <div class="username">${localStorage.getItem("username") || "Guest"}</div>
                </div>
            </div>
            <hr class="divider">
            <div id="cartList">
                <h3>Shopping Cart</h3>
                <ul id="cartItems"></ul>
            </div>
            <button id="orderButton">Order</button>
        `;

      // Add event listeners
      sidebarContainer.querySelector('.closeBtn').addEventListener('click', closeSidebar);
      sidebarContainer.querySelector('#orderButton').addEventListener('click', () => {
        showPage("orderForm");
        closeSidebar();
      });

      // Add profile navigation
      sidebarContainer.querySelector('.profileContainer').addEventListener('click', () => {
        showPage("profile");
        closeSidebar();
      });

      cart.updateCart();
    }
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarContainer.innerHTML = "";
  }

  async function loadProducts(retries = 3) {
    const productContainer = document.querySelector(".products");

    if (!productContainer) {
      console.error("ERROR: .products container not found in DOM!");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/getProducts.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      let products;
      try {
        products = JSON.parse(text);
      } catch (e) {
        console.error("Server response:", text);
        throw new Error("Invalid JSON response from server");
      }

      productContainer.innerHTML = "";
      
      if (!Array.isArray(products)) {
        throw new Error("Expected array of products");
      }

      products.forEach(product => {
        const productElement = document.createElement("li");
        productElement.classList.add("product");
        productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price"><strong>$${product.price}</strong></p>
                <button class="addToCart">Add to Cart</button>
            `;
            
        // Add style constraints
        const description = productElement.querySelector('.product-description');
        description.style.overflow = 'hidden';
        description.style.display = '-webkit-box';
        description.style.webkitLineClamp = '3';
        description.style.webkitBoxOrient = 'vertical';
        description.style.width = '100%';
        description.style.wordWrap = 'break-word';
        
        const productName = productElement.querySelector('.product-name');
        productName.style.overflow = 'hidden';
        productName.style.width = '100%';
        productName.style.wordWrap = 'break-word';
        productName.style.whiteSpace = 'normal'; 
        productName.style.maxHeight = '2.4em';
        productName.style.lineHeight = '1.2';
            
        const addButton = productElement.querySelector('.addToCart');
        addButton.addEventListener('click', (e) => {
          e.stopPropagation();
          cart.addItem(product);
        });

        // Add click handler for the entire product card
        productElement.addEventListener('click', () => showProductModal(product));

        productContainer.appendChild(productElement);
        
        setTimeout(() => productElement.classList.add("visible"), 100);
      });

    } catch (error) {
      console.error("ERROR loading products:", error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => loadProducts(retries - 1), 2000);
      } else {
        productContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
      }
    }
  }

  // Event Listeners
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("logoutBtn")) showPage("logout");
    if (event.target.classList.contains("LOGOUT")) {
      Auth.logoutUser();
      cart.clear();
      closeSidebar();
      showPage("home");
      // Refresh the profile UI after logout
      const newProfileImage = Auth.updateLoginUI(profileContainer);
      setupProfileImageListener(newProfileImage);
    }
    if (event.target.classList.contains("LOGIN")) {
      const success = await Auth.loginUser();
      if (success) {
        const newProfileImage = Auth.updateLoginUI(profileContainer);
        setupProfileImageListener(newProfileImage);
        showPage("profile");
        Auth.setupAdminPanel(); // Add this line to setup admin panel
      }
    }
    if (event.target.classList.contains("REGISTER")) {
      Auth.registerUser();
    }
  });

  // Helper function to setup profile image click listener
  function setupProfileImageListener(profileImage) {
    profileImage.addEventListener("click", function () {
      if (localStorage.getItem("loggedIn") === "true") {
        toggleSidebar();
      } else {
        showPage("login");
      }
    });
  }

  document.querySelectorAll("nav a").forEach(function(link) {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      const targetSection = this.getAttribute("href").substring(1);
      showPage(targetSection);
      if(targetSection === "products") {
        loadProducts();
      }
    });
  });

  // Add escape key handler to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideProductModal();
    }
  });

  // Initialize
  showPage("home");
});