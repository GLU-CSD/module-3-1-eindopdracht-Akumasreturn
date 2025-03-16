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
    const counts = this.getItemCounts();
    return this.items.reduce((total, item) => {
      const quantity = counts[`${item.id}-${item.name}`] || 1;
      return total + (parseFloat(item.price) * quantity);
    }, 0).toFixed(2);
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
