# Daily Expense Tracker WebApp

A simple, client-side web application for tracking daily expenses. Built with HTML, CSS, and vanilla JavaScript.

## Features

- Add new expenses with description, amount, and date
- View list of all recorded expenses
- Delete individual expenses
- Automatic total calculation
- Data persistence using browser localStorage
- Responsive design for mobile and desktop
- Clean, modern interface

## How to Use

1. Open `index.html` in any modern web browser
2. Fill in the expense form:
   - Description: What the expense was for
   - Amount: The cost (in dollars, can include cents)
   - Date: When the expense occurred (defaults to today)
3. Click "Add Expense" to record it
4. View your expenses in the list below
5. Click "Delete" on any expense to remove it
6. See your total expenses automatically updated at the top

## Technical Details

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Storage:** Browser localStorage (data persists between sessions)
- **No backend required:** Purely client-side application
- **Responsive:** Works on mobile phones, tablets, and desktops
- **No dependencies:** Vanilla JavaScript - no frameworks or libraries needed

## File Structure

```
expense-tracker/
├── index.html          # Main application file
└── README.md           # This file
```

## How to Run

Simply open `index.html` in your web browser:
- Double-click the file in your file explorer, OR
- Right-click and "Open with" your preferred browser, OR
- Drag and drop the file into a browser window

## Data Privacy

All expense data is stored locally in your browser's localStorage. No data is sent to any server or external service.

## Customization

You can easily modify this app to:
- Change the currency (update the "$" symbols)
- Add expense categories
- Add expense editing functionality
- Export/import data
- Add charts or visualizations
- Connect to a backend for multi-device sync