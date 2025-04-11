const baseUrl = window.location.href.includes("localhost") 
  ? "http://localhost/webshopschool"
  : window.location.origin;

// Add a placeholder SVG for images that fail to load
const placeholderSVG = `data:image/svg+xml;base64,${btoa('<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 115.19 123.38" style="enable-background:new 0 0 115.19 123.38" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;stroke:#000000;stroke-width:0.5;stroke-miterlimit:2.6131;}</style><g><path class="st0" d="M93.13,79.5c12.05,0,21.82,9.77,21.82,21.82c0,12.05-9.77,21.82-21.82,21.82c-12.05,0-21.82-9.77-21.82-21.82 C71.31,89.27,81.08,79.5,93.13,79.5L93.13,79.5z M8.08,0.25h95.28c2.17,0,4.11,0.89,5.53,2.3c1.42,1.42,2.3,3.39,2.3,5.53v70.01 c-2.46-1.91-5.24-3.44-8.25-4.48V9.98c0-0.43-0.16-0.79-0.46-1.05c-0.26-0.26-0.66-0.46-1.05-0.46H9.94 c-0.43,0-0.79,0.16-1.05,0.46C8.63,9.19,8.43,9.58,8.43,9.98v70.02h0.03l31.97-30.61c1.28-1.18,3.29-1.05,4.44,0.23 c0.03,0.03,0.03,0.07,0.07,0.07l26.88,31.8c-4.73,5.18-7.62,12.08-7.62,19.65c0,3.29,0.55,6.45,1.55,9.4H8.08 c-2.17,0-4.11-0.89-5.53-2.3s-2.3-3.39-2.3-5.53V8.08c0-2.17,0.89-4.11,2.3-5.53S5.94,0.25,8.08,0.25L8.08,0.25z M73.98,79.35 l3.71-22.79c0.3-1.71,1.91-2.9,3.62-2.6c0.66,0.1,1.25,0.43,1.71,0.86l17.1,17.97c-2.18-0.52-4.44-0.79-6.78-0.79 C85.91,71.99,79.13,74.77,73.98,79.35L73.98,79.35z M81.98,18.19c3.13,0,5.99,1.28,8.03,3.32c2.07,2.07,3.32,4.9,3.32,8.03 c0,3.13-1.28,5.99-3.32,8.03c-2.07,2.07-4.9,3.32-8.03,3.32c-3.13,0-5.99-1.28-8.03-3.32c-2.07-2.07-3.32-4.9-3.32-8.03 c0-3.13,1.28-5.99,3.32-8.03C76.02,19.44,78.86,18.19,81.98,18.19L81.98,18.19z M85.82,88.05l19.96,21.6 c1.58-2.39,2.5-5.25,2.5-8.33c0-8.36-6.78-15.14-15.14-15.14C90.48,86.17,87.99,86.85,85.82,88.05L85.82,88.05z M100.44,114.58 l-19.96-21.6c-1.58,2.39-2.5,5.25-2.5,8.33c0,8.36,6.78,15.14,15.14,15.14C95.78,116.46,98.27,115.78,100.44,114.58L100.44,114.58z"/></g></svg>')}`;

// Load the products CSS file
function loadProductsCSS() {
  const linkElem = document.createElement('link');
  linkElem.rel = 'stylesheet';
  linkElem.href = 'styling/products.css';
  document.head.appendChild(linkElem);
}

// Create the mobile product modal container
function createProductModal() {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'productModal';
  document.body.appendChild(modalContainer);
  return modalContainer;
}

// Show product modal on mobile devices
function showProductModal(product, cart) {
  // Only show modal on mobile devices
  if (window.innerWidth > 768) return;
  
  const modalContainer = document.getElementById('productModal');
  
  // Get the product's main image
  const mainImage = product.image;
  
  // For now, create placeholder images for demonstration
  // In a real scenario, these would come from your database
  const additionalImages = [
    mainImage, // First thumbnail is the main image
    product.additionalImage1 || placeholderSVG, // Use SVG placeholder for missing images
    product.additionalImage2 || placeholderSVG,
    product.additionalImage3 || placeholderSVG
  ];
  
  modalContainer.innerHTML = `
    <button class="closeModal" style="position:absolute;right:10px;top:10px;font-size:24px;border:none;background:none;color:black;padding:10px;cursor:pointer;">&times;</button>
    <div style="display:flex;flex-direction:column;height:100%;padding-top:10px;overflow-y:auto;">
      <div class="modal-product-image" style="text-align:center;margin-bottom:5px;">
        <img src="${mainImage}" alt="${product.name}" id="modal-main-image" style="max-height:35%;object-fit:contain;max-width:100%;" onerror="this.src='${placeholderSVG}'">
      </div>
      
      <div class="modal-thumbnails" style="display:flex;justify-content:center;gap:8px;margin:10px 0;">
        ${additionalImages.map((img, index) => `
          <div class="modal-thumbnail ${index === 0 ? 'active' : ''}" data-src="${img}" style="width:50px;height:50px;border:2px solid ${index === 0 ? '#4CAF50' : '#ddd'};padding:2px;cursor:pointer;border-radius:4px;">
            <img src="${img}" alt="${product.name} thumbnail ${index+1}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${placeholderSVG}'">
          </div>
        `).join('')}
      </div>
      
      <h2 style="margin:10px 0;font-size:1.2em;">${product.name}</h2>
      <p style="font-size:1.2em;font-weight:bold;color:#2c3e50;margin:5px 0;">$${product.price}</p>
      <div style="flex-grow:1;overflow-y:auto;margin:10px 0;font-size:0.9em;">${product.description}</div>
      <button class="addToCart" style="background-color:#4CAF50;color:white;border:none;padding:12px 24px;border-radius:4px;cursor:pointer;font-size:1em;margin-top:10px;align-self:flex-start;">Add to Cart</button>
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
  
  // Set up thumbnail click events in modal
  modalContainer.querySelectorAll('.modal-thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update main image
      document.getElementById('modal-main-image').src = thumb.dataset.src;
      
      // Update active state
      modalContainer.querySelectorAll('.modal-thumbnail').forEach(t => {
        t.style.borderColor = '#ddd';
      });
      thumb.style.borderColor = '#4CAF50';
    });
  });
}

// Hide product modal
function hideProductModal() {
  const modalContainer = document.getElementById('productModal');
  if (modalContainer) {
    modalContainer.style.transform = 'translateY(100%)';
    setTimeout(() => {
      modalContainer.style.display = 'none';
    }, 300);
  }
}

// Load products from API
async function loadProducts(showPageFn, showProductViewFn, cart, retries = 3) {
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
        <img src="${product.image}" alt="${product.name}" onerror="this.src='${placeholderSVG}'">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price"><strong>$${product.price}</strong></p>
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
      
      // Add click handler for the entire product card
      productElement.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          // Show modal on mobile
          showProductModal(product, cart);
        } else {
          // Show product view page on desktop
          showProductViewFn(product);
        }
      });

      productContainer.appendChild(productElement);
      
      setTimeout(() => productElement.classList.add("visible"), 100);
    });

  } catch (error) {
    console.error("ERROR loading products:", error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      setTimeout(() => loadProducts(showPageFn, showProductViewFn, cart, retries - 1), 2000);
    } else {
      productContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
  }
}

// Show detailed product view
function showProductView(product, showPageFn, cart) {
  const productviewContainer = document.getElementById("productview-container");
  
  if (!productviewContainer) return;
  
  // Get the product's main image
  const mainImage = product.image;
  
  // For now, create placeholder images for demonstration
  // In a real scenario, these would come from your database
  const additionalImages = [
    mainImage, // First thumbnail is the main image
    product.additionalImage1 || placeholderSVG, // Use SVG placeholder for missing images
    product.additionalImage2 || placeholderSVG,
    product.additionalImage3 || placeholderSVG
  ];
  
  productviewContainer.innerHTML = `
    <div class="product-detail">
      <div class="product-image-container">
        <div class="product-image">
          <img src="${mainImage}" alt="${product.name}" id="main-product-image" onerror="this.src='${placeholderSVG}'">
        </div>
        <div class="product-thumbnails">
          ${additionalImages.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-src="${img}">
              <img src="${img}" alt="${product.name} thumbnail ${index+1}" onerror="this.src='${placeholderSVG}'">
            </div>
          `).join('')}
        </div>
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p class="product-price">$${product.price}</p>
        <div class="product-description">${product.description}</div>
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  `;
  
  // Set up thumbnail click events
  productviewContainer.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update main image
      document.getElementById('main-product-image').src = thumb.dataset.src;
      
      // Update active state
      productviewContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
  
  // Add event listener to the add to cart button
  productviewContainer.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    cart.addItem(product);
  });
  
  // Add event listener to back button
  document.getElementById('back-to-products').addEventListener('click', () => {
    showPageFn('products');
    loadProducts(showPageFn, product => showProductView(product, showPageFn, cart), cart);
  });
  
  showPageFn("productview");
}

// Initialize product functionality
function initializeProducts() {
  loadProductsCSS();
  createProductModal();
  
  // Add escape key handler to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideProductModal();
    }
  });
}

export { 
  initializeProducts, 
  loadProducts, 
  showProductView, 
  showProductModal, 
  hideProductModal,
  placeholderSVG
};
