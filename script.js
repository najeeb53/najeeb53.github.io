// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedCategory = '';

// Get DOM elements
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const categoryGrid = document.getElementById('category-grid');
const currentDate = document.getElementById('current-date');

// Set current date and time (04:28 PM IST, July 21, 2025)
currentDate.textContent = new Date('2025-07-21T16:28:00+05:30').toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
});

// Define updated categories with icons (using placeholders; replace with images if available)
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

// Display expenses
function displayExpenses() {
    expenseList.innerHTML = '';
    const todayExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        const today = new Date('2025-07-21T16:28:00+05:30');
        return expDate.toDateString() === today.toDateString();
    });
    if (todayExpenses.length === 0) {
        expenseList.innerHTML = '<li>No expenses recorded today</li>';
    } else {
        todayExpenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expense.title} - ₹${expense.amount.toFixed(2)} (${expense.category})</span>
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
        title: 'Expense', // Default title; add <input> for custom title if needed
        amount: parseFloat(document.getElementById('amount').value) || 0,
        date: new Date('2025-07-21T16:28:00+05:30').toISOString(),
        category: selectedCategory,
        description: document.getElementById('description').value || ''
    };
    expenses.push(expense);
    saveExpenses();
    displayExpenses();
    form.reset();
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
    selectedCategory = '';
});

// Delete expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpenses();
    displayExpenses();
}

// Initial display
displayExpenses();