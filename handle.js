const baseUrl = window.location.hostname.includes("localhost")
  ? "http://localhost/webshopschool"
  : "https://u230039.gluwebsite.nl";

document.addEventListener("DOMContentLoaded", function () {
  const profileContainer = document.querySelector(".profile");
  const sidebar = document.getElementById("sidebar");
  const header = document.querySelector("header");
  let profileImage = null;
  let selectedProductImage = "";

  updateLoginUI();

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
    }

    if (pageId === "products") {
      const productElements = document.querySelectorAll(".product");

      productElements.forEach((productElement, index) => {
        productElement.classList.remove("visible");

        setTimeout(() => {
          productElement.classList.add("visible");
        }, index * 350);

        // Add click event listener to each product card
        productElement.addEventListener("click", function () {
          // Store the image of the clicked product
          selectedProductImage = productElement.querySelector("img").src;
          // Navigate to orderForm page
          showPage("orderForm");
        });
      });
    }

    if (pageId === "orderForm") {
      const orderFormImage = document.querySelector("#orderForm img");
      if (orderFormImage) {
        orderFormImage.src = selectedProductImage; // Set the clicked product's image
      }
    }
  }

  function updateLoginUI() {
    profileContainer.innerHTML = "";

    profileImage = document.createElement("div");
    profileImage.classList.add("profileIcon");
    profileImage.style.width = "75px";
    profileImage.style.height = "75px";
    profileImage.style.borderRadius = "50%";
    profileImage.style.border = "none";
    profileImage.style.cursor = "pointer";
    profileImage.style.display = "flex";
    profileImage.style.alignItems = "center";
    profileImage.style.justifyContent = "center";
    profileImage.style.fontSize = "32px";
    profileImage.style.fontWeight = "bold";
    profileImage.style.color = "#fff";
    profileImage.style.backgroundColor = "#555";
    profileImage.innerHTML = `<img src="images/default.png" style="width: 100%; height: 100%; border-radius: 50%;">`;

    profileContainer.appendChild(profileImage);

    profileImage.addEventListener("click", function () {
      if (localStorage.getItem("loggedIn") === "true") {
        toggleSidebar();
      } else {
        showPage("login");
      }
    });

    if (localStorage.getItem("loggedIn") === "true") {
      let username = localStorage.getItem("username");
      let role = localStorage.getItem("role");

      // Check if the admin link already exists
      let adminLink = document.getElementById("adminLink");
      if (!adminLink) {
        adminLink = document.createElement("a");
        adminLink.id = "adminLink";
        adminLink.href = "admin.html";
        adminLink.innerText = "Admin Panel";
        adminLink.style.display = role === "admin" ? "block" : "none"; // Show only for admins

        let profileSection = document.getElementById("profile");
        profileSection.appendChild(adminLink);
      }
    }
  }

  function toggleSidebar() {
    if (!sidebar) return;

    sidebar.classList.toggle("open");

    if (sidebar.classList.contains("open")) {
      sidebarContainer.innerHTML = "";

      const profileContainer = document.createElement("div");
      profileContainer.classList.add("profileContainer");

      const profileIcon = document.createElement("div");
      profileIcon.classList.add("profileIcon", "profileButton");

      let username = localStorage.getItem("username") || "Guest";
      const firstLetter = username !== "Guest" ? username.charAt(0).toUpperCase() : "?";

      profileIcon.innerHTML = `<div class="profile-letter">${firstLetter}</div>`;

      const usernameContainer = document.createElement("div");
      usernameContainer.classList.add("usernameContainer");

      const usernameText = document.createElement("div");
      usernameText.classList.add("username");
      usernameText.textContent = username;

      const usernameLine = document.createElement("div");
      usernameLine.classList.add("usernameLine");

      usernameContainer.appendChild(usernameText);
      usernameContainer.appendChild(usernameLine);

      profileContainer.appendChild(profileIcon);
      profileContainer.appendChild(usernameContainer);

      sidebarContainer.appendChild(profileContainer);

      profileIcon.addEventListener("click", function () {
        showPage("profile");
        closeSidebar();
      });
    }
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarContainer.innerHTML = "";
  }

  async function registerUser() {
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    const response = await fetch(`${baseUrl}/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${username}&password=${password}`,
    });

    const result = await response.text();
    document.getElementById("registerStatus").innerText = result;
  }

  async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${baseUrl}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${username}&password=${password}`,
      });

      const result = await response.json(); // Expecting a JSON response
      console.log(result);

      if (result.success) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("role", result.role); // Save role in localStorage
        updateLoginUI();
        showPage("profile");
      }

      document.getElementById("loginStatus").innerText = result.message;
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  async function logoutUser() {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    updateLoginUI();

    // Remove the admin link if it exists
    let adminLink = document.getElementById("adminLink");
    if (adminLink) {
      adminLink.remove();
    }
  }

  showPage("home");
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("logoutBtn")) {
      showPage("logout");
    }
    if (event.target.classList.contains("LOGOUT")) {
      logoutUser();
      closeSidebar();
      showPage("home");
    }
    if (event.target.classList.contains("LOGIN")) {
      loginUser();
      showPage("profile");
    }
    if (event.target.classList.contains("REGISTER")) {
      registerUser();
    }
  });

  document.querySelectorAll("nav a").forEach(function(link) {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      const targetSection = this.getAttribute("href").substring(1);
      showPage(targetSection);
    });
  });

  fetch(`${baseUrl}/getProducts.php`)
    .then(response => response.text()) // Get raw response first (not JSON yet)
    .then(data => {
      console.log("Raw Response:", data); // Check what’s actually returned
      return JSON.parse(data); // Then parse JSON
    })
    .then(products => {
      console.log("Parsed Products:", products); // Check if parsing works

      const productContainer = document.querySelector(".products");

      if (!productContainer) {
        console.error("ERROR: .products container not found in DOM!");
        return;
      }

      productContainer.innerHTML = "";

      products.forEach(product => {
        const productElement = document.createElement("li");
        productElement.classList.add("product");
        productElement.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><strong>$${product.price}</strong></p>
        `;
        productContainer.appendChild(productElement);

        productElement.addEventListener("click", function () {
          selectedProductImage = product.image;
          showPage("orderForm");
        });
      });

      console.log("Products loaded successfully!");
    })
    .catch(error => console.error("ERROR loading products:", error));

});