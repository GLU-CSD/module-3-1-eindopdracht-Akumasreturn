const baseUrl = window.location.href.includes("localhost") 
  ? "http://localhost/webshopschool"
  : window.location.origin;

class Auth {
  static updateLoginUI(profileContainer) {
    profileContainer.innerHTML = "";
    const profileImage = document.createElement("div");
    profileImage.classList.add("profileIcon");
    Object.assign(profileImage.style, {
      width: "75px",
      height: "75px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#555"
    });

    profileImage.innerHTML = `<img src="images/default.png" style="width: 100%; height: 100%; border-radius: 50%;">`;
    profileContainer.appendChild(profileImage);

    // Setup admin panel if user is logged in
    if (localStorage.getItem("loggedIn") === "true") {
      this.setupAdminPanel();
    }

    return profileImage;
  }

  static setupAdminPanel() {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    
    // Update profile username
    const profileUsername = document.getElementById("profileUsername");
    if (profileUsername) {
      profileUsername.textContent = username;
    }

    // Setup admin panel link
    let adminLink = document.getElementById("adminLink");
    const adminPanelContainer = document.getElementById("adminPanelLinkContainer");

    if (role === "admin" && adminPanelContainer) {
      if (!adminLink) {
        adminLink = document.createElement("a");
        adminLink.id = "adminLink";
        adminLink.href = "admin.html";
        adminLink.innerText = "Admin Panel";
        adminPanelContainer.appendChild(adminLink);
      }
      adminLink.style.display = "block";
    }
  }

  static async registerUser() {
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

  static async loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${baseUrl}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${username}&password=${password}`,
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("role", result.role);
        return true;
      }

      document.getElementById("loginStatus").innerText = result.message || "Login failed";
      return false;
    } catch (error) {
      console.error("Error logging in:", error);
      document.getElementById("loginStatus").innerText = "Login failed. Please try again.";
      return false;
    }
  }

  static logoutUser() {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    
    const adminLink = document.getElementById("adminLink");
    if (adminLink) {
      adminLink.remove();
    }
  }
}

export default Auth;
