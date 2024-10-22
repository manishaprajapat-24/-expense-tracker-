let expenses = JSON.parse(localStorage.getItem('expenses')) || [];   
let isEditing = false;
let editingId = null;

document.addEventListener('DOMContentLoaded', function() {
    displayExpenses();   
    calculateTotal();
});

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('expense-name').value;
    const amount = document.getElementById('expense-amount').value;
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

     const currentDate = new Date();  
    const enteredDate = new Date(date);  

     if (name === '' || amount <= 0 || date === '' || enteredDate > currentDate) {
        alert('Please enter valid expense details. The date cannot be in the future.');
        return;
    }

    if (isEditing) {
        expenses = expenses.map(expense => {
            if (expense.id === editingId) {
                return {
                    id: editingId,
                    name,
                    amount: parseFloat(amount),
                    category,
                    date
                };
            }
            return expense;
        });

        isEditing = false;
        editingId = null;
        document.querySelector('button[type="submit"]').innerText = 'Add Expense';

    } else {
        const expense = {
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category,
            date
        };

        expenses.push(expense);
    }

    document.getElementById('expense-form').reset();

    saveExpensesToLocalStorage();  
    displayExpenses();
    calculateTotal();
});

 function displayExpenses() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';  

    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = ` 
        <div class="listcss">
            <strong>${expense.name}</strong> - Rs. ${expense.amount} (${expense.category})<br>
            <small>${expense.date}</small>
        </div>
        <button class="edit-btn" onclick="editExpense(${expense.id})">
            <i class="fas fa-edit"></i> Edit
        </button>
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">
            <i class="fas fa-trash-alt"></i> Delete
        </button>`;

        expenseList.appendChild(expenseItem);
    });
}

 function editExpense(id) {
    const expenseToEdit = expenses.find(expense => expense.id === id);

    document.getElementById('expense-name').value = expenseToEdit.name;
    document.getElementById('expense-amount').value = expenseToEdit.amount;
    document.getElementById('expense-category').value = expenseToEdit.category;
    document.getElementById('expense-date').value = expenseToEdit.date;

    isEditing = true;
    editingId = id;

    document.querySelector('button[type="submit"]').innerText = 'Update Expense';
}

 function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    
    saveExpensesToLocalStorage();  
    displayExpenses();
    calculateTotal();
}

 function calculateTotal() {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    document.getElementById('total-expense').innerText = `Total: Rs.${total}`;
}

 function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));   
 }

