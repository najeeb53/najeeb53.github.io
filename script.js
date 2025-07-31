// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedCategory = '';

// Get DOM elements
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const categoryGrid = document.getElementById('category-grid');
const currentDate = document.getElementById('current-date');
const expenseSummary = document.getElementById('expense-summary');

// Update date and time dynamically
function updateDateTime() {
    currentDate.textContent = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });
}
// Initial update and set interval to refresh every minute
updateDateTime();
setInterval(updateDateTime, 60000); // Updates every 60 seconds

// Define categories with icons
const categories = [
    { name: 'Food', icon: '🍽️' },
    { name: 'Grocery', icon: '🛒' },
    { name: 'Medical', icon: '❤️' },
    { name: 'Clothes', icon: '👕' },
    { name: 'Petrol', icon: '⛽' },
    { name: 'Doctor', icon: '👨‍⚕️' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Other', icon: '...' }
];

// Populate category grid
categories.forEach(category => {
    const btn = document.createElement('div');
    btn.className = 'category-btn';
    btn.innerHTML = `<span>${category.icon}</span><span>${category.name}</span>`;
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
        btn.classList.add('selected');
        selectedCategory = category.name;
    });
    categoryGrid.appendChild(btn);
});

// NEW: Calculate and display summary totals
function updateSummary() {
    const today = new Date().toDateString();
    const todayExpenses = expenses.filter(exp => new Date(exp.date).toDateString() === today);
    
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const overallTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Make sure the summary element exists before trying to update it
    if (expenseSummary) {
         expenseSummary.innerHTML = `
            <div style="text-align:center; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Total Today:</strong> ₹${todayTotal.toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Overall Total:</strong> ₹${overallTotal.toFixed(2)}</p>
            </div>
        `;
    }
}

// Display all expenses
function displayAllExpenses() {
    expenseList.innerHTML = '';
    if (expenses.length === 0) {
        expenseList.innerHTML = '<li>No expenses recorded</li>';
    } else {
        // Display in reverse chronological order (newest first)
        [...expenses].reverse().forEach(expense => {
            const expDate = new Date(expense.date).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            const li = document.createElement('li');
            // MODIFIED: Use data-id for the delete button instead of an inline onclick
            li.innerHTML = `
                <span>${expense.category}: <b>₹${expense.amount.toFixed(2)}</b><br><small>${expense.description || ''} - <i>${expDate}</i></small></span>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }
    
    // Update summary totals
    updateSummary();

    // Add export button after showing expenses (if it doesn't exist)
    if (!document.getElementById('export-button')) {
        const exportButton = document.createElement('button');
        exportButton.id = 'export-button';
        exportButton.textContent = 'Export Expenses';
        exportButton.style.margin = '20px 0 10px 0'; // Adjusted margin
        exportButton.style.backgroundColor = '#28a745';
        // Applying styles from the stylesheet to be consistent
        exportButton.style.width = '100%';
        exportButton.style.padding = '10px';
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '5px';
        exportButton.style.fontSize = '16px';
        exportButton.style.cursor = 'pointer';

        exportButton.addEventListener('click', () => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(expenses, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', 'expenses_' + new Date().toISOString().split('T')[0] + '.json');
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            document.body.removeChild(downloadAnchorNode);
        });
        // Insert the button before the form
        form.parentNode.insertBefore(exportButton, form);
    }
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Add expense
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amountInput = document.getElementById('amount');
    
    if (!selectedCategory) {
        alert('Please select a category');
        return;
    }
    if (!amountInput.value || parseFloat(amountInput.value) <= 0) {
        alert('Please enter a valid amount greater than zero.');
        return;
    }

    const expense = {
        id: Date.now(), // MODIFIED: Add a unique ID for safe deletion
        amount: parseFloat(amountInput.value) || 0,
        date: new Date().toISOString(),
        category: selectedCategory,
        description: document.getElementById('description').value.trim() || ''
    };
    expenses.push(expense);
    saveExpenses();
    displayAllExpenses(); // Re-render the full list to show the new expense at the top
    form.reset(); // This clears amount and description
    
    // MODIFIED: Category selection is no longer reset, for easier multi-entry
    // document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
    // selectedCategory = '';
});

// MODIFIED: Delete expense by unique ID instead of index
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    displayAllExpenses(); // Re-render the list
}

// NEW: Use Event Delegation for delete buttons for better performance
expenseList.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-btn')) {
        const expenseId = parseInt(event.target.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(expenseId);
        }
    }
});


// Add button to show all expenses
const showAllButton = document.createElement('button');
showAllButton.textContent = 'Show All Expenses';
showAllButton.style.width = '100%';
showAllButton.style.margin = '10px 0';
showAllButton.style.padding = '10px';
showAllButton.style.backgroundColor = '#4a90e2';
showAllButton.style.color = 'white';
showAllButton.style.border = 'none';
showAllButton.style.borderRadius = '5px';
showAllButton.style.cursor = 'pointer';
showAllButton.addEventListener('click', displayAllExpenses);
document.querySelector('.container').insertBefore(showAllButton, form);


// Initial display (show today's expenses by default)
function displayTodaysExpenses() {
    expenseList.innerHTML = '';
    const today = new Date();
    const todayExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.toDateString() === today.toDateString();
    });

    if (todayExpenses.length === 0) {
        expenseList.innerHTML = '<li>No expenses recorded today</li>';
    } else {
        // Display in reverse chronological order
        todayExpenses.reverse().forEach(expense => {
            const expDate = new Date(expense.date).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            const li = document.createElement('li');
            // MODIFIED: Use data-id for the delete button
            li.innerHTML = `
                <span>${expense.category}: <b>₹${expense.amount.toFixed(2)}</b><br><small>${expense.description || ''} - <i>${expDate}</i></small></span>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }
    // Update summary totals on initial load
    updateSummary();
}

// Perform initial display on page load
displayTodaysExpenses();
