document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.querySelector('.expense-form');
    const expenseList = document.querySelector('.expense-list');
    
    // Load existing expenses from localStorage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const category = expenseForm.querySelector('input[type="text"]').value;
        const amount = parseFloat(expenseForm.querySelector('input[type="number"]').value);
        const date = expenseForm.querySelector('input[type="date"]').value;
        const description = expenseForm.querySelector('textarea').value;

        // Create new expense object
        const newExpense = {
            category,
            amount,
            date,
            description
        };

        // Add to expenses array
        expenses.push(newExpense);
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));

        // Add to UI
        displayExpense(newExpense);
        updateTotal();
        
        // Reset form
        expenseForm.reset();
    });

    function displayExpense(expense) {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        
        expenseItem.innerHTML = `
            <div class="expense-item-description">
                <h3>${expense.category}</h3>
                <p>${expense.description || 'No description'}</p>
            </div>
            <div class="expense-item-amount">
                <h3>$${expense.amount.toFixed(2)}</h3>
                <small>${expense.date}</small>
            </div>
        `;

        // Add to expense list
        expenseList.appendChild(expenseItem);
    }

    function updateTotal() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Create or update total element
        let totalElement = document.querySelector('.expense-total');
        if (!totalElement) {
            totalElement = document.createElement('div');
            totalElement.className = 'expense-total';
            expenseList.appendChild(totalElement);
        }
        
        totalElement.innerHTML = `
            <h3>Total Expenses</h3>
            <h2>$${total.toFixed(2)}</h2>
        `;
    }

    // Load existing expenses on page load
    expenses.forEach(expense => displayExpense(expense));
    updateTotal();
});