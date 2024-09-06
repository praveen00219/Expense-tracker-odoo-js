// Toggle Modal Functionality
const authToggle = document.getElementById("auth-toggle");
const authModal = document.getElementById("auth-modal");
const closeModal = document.getElementById("close-modal");
const signInContainer = document.getElementById("signInContainer");
const signUpContainer = document.getElementById("signUpContainer");
const toggleAuth = document.getElementById("toggle-auth");
const signInNav = document.getElementById("signInNav");
const startFree = document.getElementById("startFree");
const authToggleStart = document.getElementById("auth-toggle-start");

// popup message container
const popupContainer = document.getElementById("popup-container");
const popupMessage = document.getElementById("popupMessage");

const authTitle = document.getElementById("auth-title");

authToggle.addEventListener("click", () => {
  authModal.classList.remove("hidden");
  authModal.classList.add("flex");
  signInContainer.classList.remove("hidden");
  signUpContainer.classList.add("hidden");
});

closeModal.addEventListener("click", () => {
  authModal.classList.add("hidden");
  authModal.classList.remove("flex");
});

toggleAuth.addEventListener("click", () => {
  signInContainer.classList.toggle("hidden");
  signUpContainer.classList.toggle("hidden");
  authTitle.textContent = signUpContainer.classList.contains("hidden")
    ? "Sign In"
    : "Sign Up";
});

signInNav.addEventListener("click", () => {
  authModal.classList.remove("hidden");
  authModal.classList.add("flex");
  signInContainer.classList.remove("hidden");
  signUpContainer.classList.add("hidden");
});

startFree.addEventListener("click", () => {
  authModal.classList.remove("hidden");
  authModal.classList.add("flex");
  signInContainer.classList.remove("hidden");
  signUpContainer.classList.add("hidden");
});

authToggleStart.addEventListener("click", () => {
  authModal.classList.remove("hidden");
  authModal.classList.add("flex");
  signInContainer.classList.remove("hidden");
  signUpContainer.classList.add("hidden");
});

// Sign In Form Submission
document.getElementById("signInForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;

  // Retrieve user data from local storage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    // Successful login
    sessionStorage.setItem("loggedIn", "true");
    window.location.href = "/assets/pages/dashboard.html"; // Redirect to a logged home page
  } else {
    alert("Invalid email or password");
  }
});

// Sign Up Form Submission
document.getElementById("signUpForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Basic validation
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((user) => user.email === email)) {
    alert("User already exists");
    return;
  }

  // Add new user
  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert(`${username} have successfully created account !`);
  // Switch to Sign In form
  signInContainer.classList.remove("hidden");
  signUpContainer.classList.add("hidden");
  authTitle.textContent = "Sign In";
});

// payment integration event
document
  .getElementById("paymentIntegration")
  .addEventListener("click", (event) => {
    event.preventDefault();

    // Show the message for updated existing expense
    popupContainer.style.display = "flex";
    popupMessage.innerText = "You have to sign in first !";

    // Hide the message after 3 seconds
    setTimeout(() => {
      popupContainer.style.display = "none";
      popupMessage.innerText = "";
    }, 2000);
  });
