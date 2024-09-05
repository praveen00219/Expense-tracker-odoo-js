let paymentDetails = {};

// --------check user Sign in or not-------------
function checkLogin() {
  const loggedIn = sessionStorage.getItem("loggedIn");
  if (!loggedIn) {
    window.location.href = "/index.html";
  }
}

// Remove 'border-dark' from all plan elements and add it to the selected plan
function selectPlan(planType, planDetails) {
  // Remove the dark border from all plans
  document.querySelectorAll(".plan").forEach((plan) => {
    plan.classList.remove("border-dark");
  });

  // Add the dark border to the selected plan
  if (planType === "weekly") {
    document.getElementById("weeklyPlan").classList.add("border-dark");
  } else if (planType === "monthly") {
    document.getElementById("monthlyPlan").classList.add("border-dark");
  } else if (planType === "yearly") {
    document.getElementById("yearlyPlan").classList.add("border-dark");
  }

  paymentDetails.planType = planType;
  paymentDetails.planDetails = planDetails;
}

// Capture plan selection and store it in local storage
document.getElementById("weeklyPlan").addEventListener("click", function () {
  selectPlan("weekly", "INR 239.00 / week");
});

document.getElementById("monthlyPlan").addEventListener("click", function () {
  selectPlan("monthly", "INR 719.00 / month");
});

document.getElementById("yearlyPlan").addEventListener("click", function () {
  selectPlan("yearly", "INR 8970.00 / year");
});

// Handle form submission and save payment details
document
  .getElementById("payment-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const cardHolderName = document.getElementById("card-holder-name").value;
    const cardNo = document.getElementById("card-no").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;
    const saveDetails = document.getElementById("save-details").checked;

    paymentDetails.cardHolderName = cardHolderName;
    paymentDetails.cardNo = cardNo;
    paymentDetails.expiryDate = expiryDate;
    paymentDetails.cvv = cvv;

    if (saveDetails) {
      localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));
      alert("Payment details saved successfully!");
    }

    // Log the payment details and selected plan for confirmation
    console.log(paymentDetails);

    alert("Payment processed successfully!");

    window.location.href = "/assets/pages/dashboard.html"; // Redirect to a logged home page
  });
