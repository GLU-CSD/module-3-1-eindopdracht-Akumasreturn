class Cart {
  constructor() {
    this.items = [];
  }

  getItemCounts() {
    const counts = {};
    this.items.forEach(item => {
      const key = `${item.id}-${item.name}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  updateCart() {
    const cartItems = document.getElementById("cartItems");
    if (!cartItems) return;
    
    cartItems.innerHTML = "";
    const counts = this.getItemCounts();
    const displayedItems = new Set();

    this.items.forEach((item) => {
      const key = `${item.id}-${item.name}`;
      if (displayedItems.has(key)) return;
      displayedItems.add(key);

      const quantity = counts[key];
      const cartItem = document.createElement("li");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
        <span>${item.name} ${quantity > 1 ? `(${quantity}x)` : ''}</span>
        <span>$${(item.price * quantity).toFixed(2)}</span>
        <button class="removeItem" data-id="${item.id}" data-name="${item.name}">Remove</button>
      `;
      cartItems.appendChild(cartItem);
    });

    this.setupRemoveButtons();
  }

  setupRemoveButtons() {
    document.querySelectorAll(".removeItem").forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        this.removeItem(id, name);
      });
    });
  }

  calculateTotal() {
    // Option 1: Simply sum all items (since duplicates are already in the items array)
    return this.items.reduce((total, item) => {
      return total + parseFloat(item.price);
    }, 0).toFixed(2);

    // Option 2 (alternative approach): Use a Set to calculate based on unique items and their counts
    /*
    const counts = this.getItemCounts();
    const processedItems = new Set();
    let total = 0;
    
    this.items.forEach(item => {
      const key = `${item.id}-${item.name}`;
      if (!processedItems.has(key)) {
        processedItems.add(key);
        const quantity = counts[key];
        total += parseFloat(item.price) * quantity;
      }
    });
    
    return total.toFixed(2);
    */
  }

  displayOrderForm() {
    const orderData = document.getElementById("orderData");
    if (!orderData) return;

    orderData.innerHTML = "<h2>Order Summary</h2>";
    orderData.style.backgroundColor = "rgb(163 163 163)";
    orderData.style.padding = "20px";
    orderData.style.borderRadius = "8px";

    if (this.items.length === 0) {
      orderData.innerHTML += "<p>No items in cart</p>";
      return;
    }

    const cartList = document.createElement("ul");
    cartList.style.listStyle = "none";
    cartList.style.padding = "0";
    cartList.style.marginBottom = "20px";

    const counts = this.getItemCounts();
    const displayedItems = new Set();

    this.items.forEach(item => {
      const key = `${item.id}-${item.name}`;
      if (displayedItems.has(key)) return;
      displayedItems.add(key);

      const quantity = counts[key];
      const cartItem = document.createElement("li");
      Object.assign(cartItem.style, {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px"
      });

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
        <span style="flex: 1;">${item.name} ${quantity > 1 ? `(${quantity}x)` : ''}</span>
        <span>$${(item.price * quantity).toFixed(2)}</span>
      `;
      cartList.appendChild(cartItem);
    });

    orderData.appendChild(cartList);

    const totalDiv = document.createElement("div");
    Object.assign(totalDiv.style, {
      textAlign: "right",
      fontWeight: "bold",
      fontSize: "1.2em",
      marginBottom: "20px"
    });
    totalDiv.innerHTML = `Total: $${this.calculateTotal()}`;
    orderData.appendChild(totalDiv);

    // Add the order form
    const formHTML = `
      <form action="Startorder.php" method="post">
        <table>
          <tr>
            <td class="td1"><label>Aanhef:</label></td>
            <td class="td2">
              <input type="radio" name="aanhef" value="Dhr." required> Dhr.
              <input type="radio" name="aanhef" value="Mevr." required> Mevr.
              <input type="radio" name="aanhef" value="Other." required> Other.
            </td>
          </tr>
          <tr>
            <td class="td1"><label>Voornaam:</label></td>
            <td class="td2"><input type="text" name="voornaam" placeholder="Voornaam" required></td>
          </tr>
          <tr>
            <td class="td1"><label>Tussenvoegsel:</label></td>
            <td class="td2"><input type="text" name="tussenvoegsel" placeholder="Tussenvoegsel"></td>
          </tr>
          <tr>
            <td class="td1"><label>Achternaam:</label></td>
            <td class="td2"><input type="text" name="achternaam" placeholder="Achternaam" required></td>
          </tr>
          <tr>
            <td class="td1"><label>Straatnaam:</label></td>
            <td class="td2"><input type="text" name="straatnaam" id="straatnaam" placeholder="Straatnaam" required></td>
          </tr>
          <tr>
            <td class="td1"><label>Huisnummer:</label></td>
            <td class="td2"><input type="number" name="huisnummer" id="huisnummer" placeholder="Nr." required></td>
          </tr>
          <tr>
            <td class="td1"><label>Postcode:</label></td>
            <td class="td2"><input type="text" name="postcode" id="postcode" placeholder="1234AB" required></td>
          </tr>
          <tr>
            <td class="td1"><label>Land:</label></td>
            <td class="td2">
              <select name="land" required>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="td1"><label>E-mailadres:</label></td>
            <td class="td2"><input type="email" name="email" required></td>
          </tr>
          <tr>
            <td class="td1"><label>Telefoonnummer:</label></td>
            <td class="td2"><input type="tel" name="telefoon" required></td>
          </tr>
          <tr>
            <td class="td1"><label>Geboortedatum:</label></td>
            <td class="td2"><input type="date" name="geboortedatum" required></td>
          </tr>
          <tr>
            <td class="td1"><label>Algemene voorwaarden:</label></td>
            <td class="td2"><input type="checkbox" name="voorwaarden" required> Ik ga akkoord met de algemene voorwaarden</td>
          </tr>
          <tr>
            <td></td>
            <td><input type="submit" value="Verder"></td>
          </tr>
        </table>
      </form>
    `;
    orderData.insertAdjacentHTML('beforeend', formHTML);
  }

  displayCartPage() {
    const cartDisplay = document.getElementById("cart-display");
    if (!cartDisplay) return;

    cartDisplay.innerHTML = "";

    if (this.items.length === 0) {
      cartDisplay.innerHTML = "<p class='empty-cart-message'>Your cart is empty</p>";
      return;
    }

    const cartTable = document.createElement("table");
    cartTable.classList.add("cart-table");
    Object.assign(cartTable.style, {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      overflow: "hidden"
    });

    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML = `
      <tr style="background-color: #f8f9fa;">
        <th style="text-align: left; padding: 15px;">Product</th>
        <th style="text-align: center; padding: 15px;">Quantity</th>
        <th style="text-align: right; padding: 15px;">Price</th>
        <th style="text-align: right; padding: 15px;">Actions</th>
      </tr>
    `;
    cartTable.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");
    const counts = this.getItemCounts();
    const displayedItems = new Set();

    this.items.forEach(item => {
      const key = `${item.id}-${item.name}`;
      if (displayedItems.has(key)) return;
      displayedItems.add(key);

      const quantity = counts[key];
      const row = document.createElement("tr");
      row.classList.add("cart-item-row");
      row.innerHTML = `
        <td style="padding: 15px; border-top: 1px solid #ddd;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
            <span style="font-weight: 500;">${item.name}</span>
          </div>
        </td>
        <td style="text-align: center; padding: 15px; border-top: 1px solid #ddd;">
          <div class="quantity-control" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <button class="quantity-btn decrease" data-id="${item.id}" data-name="${item.name}">-</button>
            <input type="number" class="quantity-input" value="${quantity}" min="1" max="99" data-id="${item.id}" data-name="${item.name}" style="width: 40px; text-align: center; border: 1px solid #ddd; border-radius: 4px; padding: 5px;">
            <button class="quantity-btn increase" data-id="${item.id}" data-name="${item.name}">+</button>
          </div>
        </td>
        <td style="text-align: right; padding: 15px; border-top: 1px solid #ddd;">$${(item.price * quantity).toFixed(2)}</td>
        <td style="text-align: right; padding: 15px; border-top: 1px solid #ddd;">
          <button class="removeItem" data-id="${item.id}" data-name="${item.name}" style="background-color: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Remove</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    cartTable.appendChild(tableBody);

    // Add total row
    const totalRow = document.createElement("tr");
    totalRow.classList.add("cart-total-row");
    totalRow.innerHTML = `
      <td colspan="2" style="text-align: right; padding: 15px; font-weight: bold; border-top: 2px solid #ddd;">Total:</td>
      <td style="text-align: right; padding: 15px; font-weight: bold; border-top: 2px solid #ddd; font-size: 1.1em;">$${this.calculateTotal()}</td>
      <td style="border-top: 2px solid #ddd;"></td>
    `;
    tableBody.appendChild(totalRow);

    cartDisplay.appendChild(cartTable);
    
    this.setupRemoveButtons();
    this.setupQuantityControls();
  }

  setupQuantityControls() {
    // Handle quantity decrease buttons
    document.querySelectorAll(".quantity-btn.decrease").forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const inputElement = e.target.parentElement.querySelector(".quantity-input");
        const currentValue = parseInt(inputElement.value);
        if (currentValue > 1) {
          inputElement.value = currentValue - 1;
          this.updateItemQuantity(id, name, currentValue - 1);
        }
      });
    });

    // Handle quantity increase buttons
    document.querySelectorAll(".quantity-btn.increase").forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const inputElement = e.target.parentElement.querySelector(".quantity-input");
        const currentValue = parseInt(inputElement.value);
        if (currentValue < 99) {
          inputElement.value = currentValue + 1;
          this.updateItemQuantity(id, name, currentValue + 1);
        }
      });
    });

    // Handle direct input changes
    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        let value = parseInt(e.target.value);
        
        // Validate input
        if (isNaN(value) || value < 1) {
          value = 1;
          e.target.value = 1;
        } else if (value > 99) {
          value = 99;
          e.target.value = 99;
        }
        
        this.updateItemQuantity(id, name, value);
      });
    });
  }

  updateItemQuantity(id, name, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(id, name);
      return;
    }

    const key = `${id}-${name}`;
    const currentItems = this.items.filter(item => `${item.id}-${item.name}` === key);
    const currentQuantity = currentItems.length;

    if (newQuantity > currentQuantity) {
      // Add more items
      const itemToAdd = currentItems[0]; // Use the first matching item as template
      for (let i = 0; i < newQuantity - currentQuantity; i++) {
        this.items.push({...itemToAdd});
      }
    } else if (newQuantity < currentQuantity) {
      // Remove excess items
      const removeCount = currentQuantity - newQuantity;
      let removed = 0;
      this.items = this.items.filter(item => {
        if (`${item.id}-${item.name}` === key && removed < removeCount) {
          removed++;
          return false;
        }
        return true;
      });
    }

    this.updateCart();
    
    // If cart page is displayed, update it
    const cartSection = document.getElementById('Cart');
    if (cartSection && cartSection.style.display === 'block') {
      this.displayCartPage();
    }
  }

  addItem(product) {
    this.items.push(product);
    this.updateCart();
  }

  removeItem(id, name) {
    this.items = this.items.filter(item => !(item.id === id && item.name === name));
    this.updateCart();
  }

  clear() {
    this.items = [];
    this.updateCart();
  }
}

export default Cart;
