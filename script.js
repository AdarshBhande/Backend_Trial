// This is the form submission code you already have
document.getElementById('customerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    // ... (Your existing form submission code is perfect, no changes needed here)
});


// --- NEW CODE STARTS HERE ---

// 1. Get references to the button and table body
const loadCustomersBtn = document.getElementById('loadCustomersBtn');
const customerTableBody = document.getElementById('customerTableBody');

// 2. Add a click event listener to the button
loadCustomersBtn.addEventListener('click', async function() {
    try {
        // 3. Fetch data from your API's GET endpoint
        const response = await fetch('http://localhost:3000/customers');
        const customers = await response.json();

        // Clear the table body of any old data
        customerTableBody.innerHTML = '';

        // 4. Loop through each customer and create a table row
        customers.forEach(customer => {
            const row = document.createElement('tr'); // Create a <tr> element

            // Create a cell for the ID
            const idCell = document.createElement('td');
            idCell.textContent = customer.id;
            row.appendChild(idCell);

            // Create a cell for the Name
            const nameCell = document.createElement('td');
            nameCell.textContent = customer.name;
            row.appendChild(nameCell);
            
            // Create a cell for the Email
            const emailCell = document.createElement('td');
            emailCell.textContent = customer.email;
            row.appendChild(emailCell);

            // 5. Add the completed row to the table body
            customerTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Failed to load customers:', error);
        alert('Could not load customer data.');
    }
});