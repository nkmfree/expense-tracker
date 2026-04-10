const express = require('express');
const { execSync } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SPREADSHEET_NAME = "expense-spend";

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to run gog commands
function runGogCommand(command) {
    try {
        const result = execSync(command, { encoding: 'utf8' });
        return result.trim();
    } catch (error) {
        throw new Error(`gog command failed: ${error.message}`);
    }
}

// Helper function to get or create the expense-spend spreadsheet
async function getOrCreateSpreadsheet() {
    try {
        // First, try to find the spreadsheet by name
        const searchResult = runGogCommand(`gog drive search "name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet'" --json`);
        const files = JSON.parse(searchResult);
        
        if (files.files && files.files.length > 0) {
            // Spreadsheet exists, return its ID
            return files.files[0].id;
        }
        
        // Spreadsheet doesn't exist, create it
        console.log(`Creating new Google Sheet: ${SPREADSHEET_NAME}`);
        const createResult = runGogCommand(`gog sheets create "${SPREADSHEET_NAME}" --json`);
        const spreadsheetInfo = JSON.parse(createResult);
        return spreadsheetInfo.spreadsheetId;
    } catch (error) {
        throw new Error(`Failed to get or create spreadsheet: ${error.message}`);
    }
}

// Helper function to get all expenses from Google Sheet
async function getExpensesFromSheet() {
    try {
        const spreadsheetId = await getOrCreateSpreadsheet();
        
        // Get values from the first sheet, assuming headers: Description, Amount, Date
        const range = "Sheet1!A:D"; // Adjust if your sheet has different structure
        const result = runGogCommand(`gog sheets get ${spreadsheetId} "${range}" --json`);
        const data = JSON.parse(result);
        
        // Skip header row and convert to expense objects
        if (!data.values || data.values.length <= 1) {
            return [];
        }
        
        const expenses = [];
        // Start from index 1 to skip header row
        for (let i = 1; i < data.values.length; i++) {
            const row = data.values[i];
            if (row.length >= 3) { // Need at least Description, Amount, Date
                const [description, amount, date] = row;
                if (description && amount !== undefined && date) {
                    expenses.push({
                        id: Date.now() + i, // Temporary ID based on row index
                        description: String(description),
                        amount: parseFloat(amount),
                        date: String(date)
                    });
                }
            }
        }
        
        return expenses;
    } catch (error) {
        console.error('Error reading from Google Sheet:', error);
        // Return empty array on error to prevent app crash
        return [];
    }
}

// Helper function to save expenses to Google Sheet
async function saveExpensesToSheet(expenses) {
    try {
        const spreadsheetId = await getOrCreateSpreadsheet();
        
        // Prepare data: header row + expense rows
        const rows = [
            ["Description", "Amount", "Date"] // Header
        ];
        
        // Add expense data
        expenses.forEach(expense => {
            rows.push([
                expense.description,
                expense.amount,
                expense.date
            ]);
        });
        
        // Clear the sheet and write new data
        // First, clear existing data
        runGogCommand(`gog sheets clear ${spreadsheetId} "Sheet1!A:D"`);
        
        // Then update with new data (starting from A1)
        const updateCommand = `gog sheets update ${spreadsheetId} "Sheet1!A1" ${JSON.stringify(rows)}`;
        runGogCommand(updateCommand);
        
        return true;
    } catch (error) {
        console.error('Error writing to Google Sheet:', error);
        throw error;
    }
}

// GET all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await getExpensesFromSheet();
        res.json(expenses);
    } catch (error) {
        console.error('Failed to read expenses:', error);
        res.status(500).json({ error: 'Failed to read expenses from Google Sheet' });
    }
});

// POST new expense
app.post('/api/expenses', async (req, res) => {
    try {
        const { description, amount, date } = req.body;
        
        if (!description || amount === undefined || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Get current expenses
        let expenses = await getExpensesFromSheet();
        
        // Add new expense
        const newExpense = {
            id: Date.now() + Math.random(), // Unique ID
            description,
            amount: parseFloat(amount),
            date
        };
        
        expenses.push(newExpense);
        
        // Save back to Google Sheet
        await saveExpensesToSheet(expenses);
        
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Failed to save expense:', error);
        res.status(500).json({ error: 'Failed to save expense to Google Sheet' });
    }
});

// DELETE expense by ID
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const id = parseFloat(req.params.id);
        
        // Get current expenses
        let expenses = await getExpensesFromSheet();
        const initialLength = expenses.length;
        
        // Filter out the expense to delete
        expenses = expenses.filter(expense => expense.id !== id);
        
        if (expenses.length === initialLength) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        // Save back to Google Sheet
        await saveExpensesToSheet(expenses);
        
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Failed to delete expense:', error);
        res.status(500).json({ error: 'Failed to delete expense from Google Sheet' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        storage: 'google-sheets',
        spreadsheetName: SPREADSHEET_NAME
    });
});

// Serve static files (your React/Vue/HTML app)
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Data stored in Google Sheet: ${SPREADSHEET_NAME}`);
    console.log(`🔐 Using existing gog authentication for Google Sheets access`);
});

module.exports = app;
