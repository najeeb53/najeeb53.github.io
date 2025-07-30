// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedCategory = '';

// Get DOM elements
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const categoryGrid = document.getElementById('category-grid');
const currentDate = document.getElementById('current-date');

// Set current date and time (11:50 AM IST, July 30, 2025)
currentDate.textContent = new Date('2025-07-30T11:50:00+05:30').toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
});

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

// Display all expenses
function displayAllExpenses() {
    expenseList.innerHTML = '';
    if (expenses.length === 0) {
        expenseList.innerHTML = '<li>No expenses recorded</li>';
    } else {
        expenses.forEach((expense, index) => {
            const expDate = new Date(expense.date).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expense.title} - ₹${expense.amount.toFixed(2)} (${expense.category}, ${expDate})</span>
                <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Add expense
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedCategory) {
        alert('Please select a category');
        return;
    }
    const expense = {
        title: 'Expense',
        amount: parseFloat(document.getElementById('amount').value) || 0,
        date: new Date('2025-07-30T11:50:00+05:30').toISOString(),
        category: selectedCategory,
        description: document.getElementById('description').value || ''
    };
    expenses.push(expense);
    saveExpenses();
    displayAllExpenses();
    form.reset();
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
    selectedCategory = '';
});

// Delete expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpenses();
    displayAllExpenses();
}

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

// Initial display (show all expenses)
displayAllExpenses();
