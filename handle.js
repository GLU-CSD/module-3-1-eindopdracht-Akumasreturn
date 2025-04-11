import Auth from './auth.js';
import Cart from './cart.js';
import { 
  initializeProducts, 
  loadProducts, 
  showProductView, 
  showProductModal, 
  hideProductModal 
} from './products.js';

const baseUrl = window.location.href.includes("localhost") 
  ? "http://localhost/webshopschool"
  : window.location.origin;

document.addEventListener("DOMContentLoaded", function () {
  const profileContainer = document.querySelector(".profile");
  const sidebar = document.getElementById("sidebar");
  const sidebarContainer = document.getElementById("sidebarContainer");
  const cart = new Cart();

  // Initialize product functionality
  initializeProducts();

  // Load the handle.css file
  const linkElem = document.createElement('link');
  linkElem.rel = 'stylesheet';
  linkElem.href = 'styling/handle.css';
  document.head.appendChild(linkElem);

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
            <button id="orderButton">View Cart</button>
        `;

      // Add event listeners
      sidebarContainer.querySelector('.closeBtn').addEventListener('click', closeSidebar);
      sidebarContainer.querySelector('#orderButton').addEventListener('click', () => {
        showPage("Cart");
        cart.displayCartPage();
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
    
    if (event.target.classList.contains("ProceedToCheckout")) {
      showPage("orderForm");
      cart.displayOrderForm();
    }
    
    if (event.target.classList.contains("ContinueShopping")) {
      showPage("products");
      loadProducts();
    }
    
    if (event.target.classList.contains("ClearCart")) {
      cart.clear();
      cart.displayCartPage();
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
        loadProducts(
          showPage, 
          product => showProductView(product, showPage, cart), 
          cart
        );
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