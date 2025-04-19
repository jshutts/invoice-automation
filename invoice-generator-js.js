document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    document.getElementById('invoiceDate').valueAsDate = today;
    
    // Set due date (default: today + 30 days)
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);
    document.getElementById('dueDate').valueAsDate = dueDate;
    
    // Generate a random invoice number
    document.getElementById('invoiceNumber').value = 'INV-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // Event listeners
    document.getElementById('processButton').addEventListener('click', processWorkDescription);
    document.getElementById('addLineItemButton').addEventListener('click', addLineItem);
    document.getElementById('generatePdfButton').addEventListener('click', generatePDF);
    document.getElementById('taxRate').addEventListener('input', updateTotals);
});

// Simple AI processing function (placeholder for more advanced processing)
function processWorkDescription() {
    const workDescriptionText = document.getElementById('workDescription').value.trim();
    
    if (!workDescriptionText) {
        alert('Please enter a description of the work completed.');
        return;
    }
    
    // Very basic NLP extraction (will be replaced with more intelligent processing)
    const extractedData = extractInvoiceData(workDescriptionText);
    
    // Populate the invoice form with extracted data
    populateInvoiceForm(extractedData);
    
    // Show the invoice preview section
    document.getElementById('invoicePreview').classList.remove('hidden');
}

// Simplistic data extraction (placeholder for AI implementation)
function extractInvoiceData(text) {
    // This is a very basic implementation
    // In a real app, we would use a more sophisticated NLP model or API
    
    const data = {
        clientName: '',
        lineItems: [],
        notes: ''
    };
    
    // Attempt to extract client name (looking for "client" or "for" followed by potential name)
    const clientRegex = /(?:client|for)\s+([A-Za-z0-9\s]+)(?:,|\.|$)/i;
    const clientMatch = text.match(clientRegex);
    if (clientMatch && clientMatch[1]) {
        data.clientName = clientMatch[1].trim();
    }
    
    // Attempt to extract hours and rates
    const hourRegex = /(\d+)\s*hours?/i;
    const rateRegex = /\$([\d.]+)(?:\s*\/\s*hour|\/hr|per hour)/i;
    
    const hourMatch = text.match(hourRegex);
    const rateMatch = text.match(rateRegex);
    
    if (hourMatch && hourMatch[1] && rateMatch && rateMatch[1]) {
        const hours = parseInt(hourMatch[1]);
        const rate = parseFloat(rateMatch[1]);
        
        data.lineItems.push({
            description: 'Professional Services',
            quantity: hours,
            unitPrice: rate,
            amount: hours * rate
        });
    } else {
        // Add a default line item if specific data can't be extracted
        data.lineItems.push({
            description: 'Professional Services',
            quantity: 1,
            unitPrice: 0,
            amount: 0
        });
    }
    
    // Set the original description as notes
    data.notes = "Based on work description: " + text;
    
    return data;
}

// Populate the invoice form with the extracted data
function populateInvoiceForm(data) {
    // Set client name
    document.getElementById('clientName').value = data.clientName;
    
    // Clear existing line items
    const lineItemsContainer = document.getElementById('lineItemsContainer');
    lineItemsContainer.innerHTML = '';
    
    // Add line items
    data.lineItems.forEach(item => {
        addLineItem(item);
    });
    
    // Set notes
    document.getElementById('notes').value = data.notes;
    
    // Update totals
    updateTotals();
}

// Add a new line item to the invoice
function addLineItem(itemData = null) {
    const lineItemsContainer = document.getElementById('lineItemsContainer');
    const lineItemIndex = lineItemsContainer.children.length;
    
    const lineItemDiv = document.createElement('div');
    lineItemDiv.className = 'line-item card mb-2';
    lineItemDiv.innerHTML = `
        <div class="card-body p-2">
            <div class="row">
                <div class="col-md-5">
                    <input type="text" class="form-control form-control-sm item-description" 
                           placeholder="Description" value="${itemData ? itemData.description : ''}">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control form-control-sm item-quantity" 
                           placeholder="Qty" value="${itemData ? itemData.quantity : 1}" min="1" step="1">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control form-control-sm item-unit-price" 
                           placeholder="Price" value="${itemData ? itemData.unitPrice : 0}" min="0" step="0.01">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control form-control-sm item-amount" 
                           placeholder="Amount" value="${itemData ? itemData.amount : 0}" readonly>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-sm btn-outline-danger remove-item">×</button>
                </div>
            </div>
        </div>
    `;
    
    lineItemsContainer.appendChild(lineItemDiv);
    
    // Add event listeners to the new line item
    const quantityInput = lineItemDiv.querySelector('.item-quantity');
    const unitPriceInput = lineItemDiv.querySelector('.item-unit-price');
    const removeButton = lineItemDiv.querySelector('.remove-item');
    
    quantityInput.addEventListener('input', () => {
        updateLineItemAmount(lineItemDiv);
        updateTotals();
    });
    
    unitPriceInput.addEventListener('input', () => {
        updateLineItemAmount(lineItemDiv);
        updateTotals();
    });
    
    removeButton.addEventListener('click', () => {
        lineItemDiv.remove();
        updateTotals();
    });
    
    // If we're adding a line item programmatically, update its amount
    if (itemData) {
        updateLineItemAmount(lineItemDiv);
    }
    
    return lineItemDiv;
}

// Update the amount for a specific line item
function updateLineItemAmount(lineItemDiv) {
    const quantity = parseFloat(lineItemDiv.querySelector('.item-quantity').value) || 0;
    const unitPrice = parseFloat(lineItemDiv.querySelector('.item-unit-price').value) || 0;
    const amount = quantity * unitPrice;
    
    lineItemDiv.querySelector('.item-amount').value = amount.toFixed(2);
}

// Update subtotal, tax, and total
function updateTotals() {
    const lineItems = document.querySelectorAll('.line-item');
    let subtotal = 0;
    
    lineItems.forEach(item => {
        subtotal += parseFloat(item.querySelector('.item-amount').value) || 0;
    });
    
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    document.getElementById('subtotal').value = subtotal.toFixed(2);
    document.getElementById('taxAmount').value = taxAmount.toFixed(2);
    document.getElementById('total').value = total.toFixed(2);
}

// Generate PDF invoice
function generatePDF() {
    // Make sure jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        alert('PDF generation library not loaded. Please check your internet connection.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Invoice header
    doc.setFontSize(22);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Your company info
    doc.setFontSize(10);
    doc.text('Your Company Name', 20, 30);
    doc.text('Your Address Line 1', 20, 35);
    doc.text('City, State ZIP', 20, 40);
    doc.text('Phone: (123) 456-7890', 20, 45);
    doc.text('Email: your@email.com', 20, 50);
    
    // Client info
    const clientName = document.getElementById('clientName').value || 'Client Name';
    doc.text('Bill To:', 120, 30);
    doc.text(clientName, 120, 35);
    doc.text('Client Address Line 1', 120, 40);
    doc.text('Client City, State ZIP', 120, 45);
    
    // Invoice details
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const dueDate = document.getElementById('dueDate').value;
    
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 65);
    doc.text(`Date: ${invoiceDate}`, 20, 70);
    doc.text(`Due Date: ${dueDate}`, 20, 75);
    
    // Line items
    const lineItems = document.querySelectorAll('.line-item');
    const tableData = [];
    
    lineItems.forEach(item => {
        const description = item.querySelector('.item-description').value;
        const quantity = item.querySelector('.item-quantity').value;
        const unitPrice = parseFloat(item.querySelector('.item-unit-price').value).toFixed(2);
        const amount = parseFloat(item.querySelector('.item-amount').value).toFixed(2);
        
        tableData.push([description, quantity, `$${unitPrice}`, `$${amount}`]);
    });
    
    // Add table with line items
    doc.autoTable({
        startY: 85,
        head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
    });
    
    // Get the y position after the table
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Add totals
    const subtotal = document.getElementById('subtotal').value;
    const taxRate = document.getElementById('taxRate').value;
    const taxAmount = document.getElementById('taxAmount').value;
    const total = document.getElementById('total').value;
    
    doc.text(`Subtotal: $${subtotal}`, 150, finalY, { align: 'right' });
    doc.text(`Tax (${taxRate}%): $${taxAmount}`, 150, finalY + 5, { align: 'right' });
    doc.text(`Total: $${total}`, 150, finalY + 10, { align: 'right' });
    
    // Notes
    const notes = document.getElementById('notes').value;
    if (notes) {
        doc.text('Notes:', 20, finalY + 20);
        const splitNotes = doc.splitTextToSize(notes, 170);
        doc.text(splitNotes, 20, finalY + 25);
    }
    
    // Save the PDF
    doc.save(`Invoice_${invoiceNumber}.pdf`);
}
