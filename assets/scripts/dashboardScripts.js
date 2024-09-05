// -------------------------------------------------------------
// -------------------SideBar-----------------------------------

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menu-btn");

const popupContainer = document.getElementById("popup-container");
const popupMessage = document.getElementById("popupMessage");

const closeModal = document.getElementById("close-modal");
closeModal.addEventListener("click", () => {
  sidebar.classList.add("hidden");
  sidebar.classList.remove("flex");
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("block");
  sidebar.classList.remove("hidden");

  sidebar.classList.remove("transform", "-translate-x-full");
  sidebar.classList.add("transform", "translate-x-0");
});

// --------------------------------------------------------------------------------
// -------------------Check user loggedin or not-----------------------------------
function logout() {
  sessionStorage.removeItem("loggedIn");
  window.location.href = "/index.html";
}

function checkLogin() {
  const loggedIn = sessionStorage.getItem("loggedIn");
  if (!loggedIn) {
    window.location.href = "/index.html";
  }
}

// -----------------------------------------------------------------------------------
// ----------------Expense form list create, update, delete and Data visulaization----------------------------------------------
let myChart = null;

document.getElementById("addExpense").addEventListener("click", function () {
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (description && !isNaN(amount)) {
    const expenses = getExpenses();
    const editingIndex = document.getElementById("editIndex").value;

    if (editingIndex !== "") {
      // Update existing expense
      expenses[editingIndex] = { description, amount, category };
      document.getElementById("editIndex").value = ""; // Reset the edit index

      // Show the message for updated existing expense
      popupContainer.style.display = "flex";
      popupMessage.innerText = "Your expense has been updated successfully.!";

      // Hide the message after 3 seconds
      setTimeout(() => {
        popupContainer.style.display = "none";
        popupMessage.innerText = "";
      }, 2000);
    } else {
      // Add new expense
      expenses.push({ description, amount, category });

      // Show the message for Added new expense
      popupContainer.style.display = "flex";
      popupMessage.innerText = "Your expense has been added successfully.!";

      // Hide the message after 3 seconds
      setTimeout(() => {
        popupContainer.style.display = "none";
        popupMessage.innerText = "";
      }, 2000);
    }

    saveExpenses(expenses);
    clearForm();
    renderExpenses();
    updateChart();
  }
});

function clearForm() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "Groceries";
}

function getExpenses() {
  const expenses = localStorage.getItem("expenses");
  return expenses ? JSON.parse(expenses) : [];
}

function saveExpenses(expenses) {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
  const expenseList = document.getElementById("expenseList");
  const expenses = getExpenses();
  expenseList.innerHTML = "";

  expenses.forEach((expense, index) => {
    expenseList.innerHTML += `
              <tr class="mb-2 text-center">
                <td>${expense.description}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>
                  <div class="">
                      <a href="#ExpenseForm">
                        <button class="edit-btn mb-2 bg-[#027d83] hover:bg-[#02696e] text-white px-2 rounded mr-2" data-index="${index}">Edit</button>
                      </a>
                    
                      <button class="delete-btn mb-2 bg-[#724b68] hover:bg-[#5c3953] text-white px-2 rounded" data-index="${index}">Delete</button>
                  </div>
                </td>
              </tr>
    `;
  });

  // Delete button functionality
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const expenses = getExpenses();
      expenses.splice(index, 1);
      saveExpenses(expenses);
      renderExpenses();
      updateChart();

      // Show the message for Added new expense
      popupContainer.style.display = "flex";
      popupMessage.innerText = "Your expense has been deleted successfully.!";

      // Hide the message after 3 seconds
      setTimeout(() => {
        popupContainer.style.display = "none";
        popupMessage.innerText = "";
      }, 2000);
    });
  });

  // Edit button functionality
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const expense = getExpenses()[index];
      document.getElementById("description").value = expense.description;
      document.getElementById("amount").value = expense.amount;
      document.getElementById("category").value = expense.category;
      document.getElementById("editIndex").value = index; // Set the current index as the editing index
    });
  });
}

// Data Visulaization Chart Update
function updateChart() {
  const expenses = getExpenses();
  const categories = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  // Data Visulaization Chart
  const chartData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          "#027d83",
          "#ff6384",
          "#724b68",
          "#36a2eb",
          "#ffcd56",
          "#4bc0c0",
        ],
      },
    ],
  };

  // Destroy the previous chart if it exists to avoid stacking charts on each update
  if (myChart) {
    myChart.destroy();
  }

  const ctx = document.getElementById("expenseChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "pie",
    data: chartData,
  });
}

// Delete all expense
document.getElementById("deleteAll").addEventListener("click", function () {
  localStorage.removeItem("expenses");
  renderExpenses();
  updateChart();

  // Show the message for Added new expense
  popupContainer.style.display = "flex";
  popupMessage.innerText = "Your all expense has been deleted successfully.!";

  // Hide the message after 3 seconds
  setTimeout(() => {
    popupContainer.style.display = "none";
    popupMessage.innerText = "";
  }, 2000);
});

// Initialize the app
(function initialize() {
  renderExpenses();
  updateChart();
})();

// -----------------------------------------------------------------------------
// ----------------------Calculate Tax------------------------------------------
function calculateTax() {
  const income = parseFloat(document.getElementById("income").value) || 0;
  let taxRate = 0;
  let taxToPay = 0;

  if (income > 1000000) {
    taxRate = 20;
  } else if (income > 700000) {
    taxRate = 15;
  } else if (income > 500000) {
    taxRate = 10;
  } else if (income > 300000) {
    taxRate = 5;
  }

  taxToPay = income * (taxRate / 100);
  const amountLeft = income - taxToPay;

  document.getElementById("totalIncome").textContent = income.toFixed(2);
  document.getElementById("taxRate").textContent = taxRate;
  document.getElementById("taxToPay").textContent = taxToPay.toFixed(2);
  document.getElementById("amountLeft").textContent = amountLeft.toFixed(2);
  document.getElementById("income").value = "";
}

// -------------------------------------------------------------------------------

//---> Check Finance AI Advisor functionalities is in path (./script/financialAdvisorAiScript.js) file.
//---> Check Payment Integration functionalities is in path (./pages/paymentGateway/paymentScript.js) file.
//---> Check Sticky Notes functionalities is in path (./pages/expenseStickyNotes/notesScript.js) file.
