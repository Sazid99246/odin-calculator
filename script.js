// --- 1. CORE ARITHMETIC FUNCTIONS ---

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) {
        return "ERROR: Not a chance!";
    }
    return a / b;
};

// --- 2. THE OPERATE FUNCTION ---

const operate = (operator, num1, num2) => {
    // Convert string inputs to numbers
    const a = Number(num1);
    const b = Number(num2);

    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return null; // Should not happen
    }
};

// --- 3. STATE VARIABLES ---

let firstNumber = '';
let operator = null;
let secondNumber = '';
let shouldResetDisplay = false; // Flag to clear display after operator or equals is pressed

const display = document.getElementById('display-text');
const buttons = document.querySelectorAll('button');

// --- 4. HELPER FUNCTIONS ---

const updateDisplay = (value) => {
    // Implement rounding for long decimals here (Gotcha: Rounding)
    if (typeof value === 'number') {
        value = Math.round(value * 1000) / 1000; // Rounds to 3 decimal places
    }
    display.textContent = value;
};

const clearAll = () => {
    // (Gotcha: Clearing) Wipes out all existing data
    firstNumber = '';
    operator = null;
    secondNumber = '';
    shouldResetDisplay = false;
    updateDisplay('0');
};

const evaluate = () => {
    // Prevent crash if '=' pressed too early (Gotcha: Missing numbers)
    if (!operator || firstNumber === '' || display.textContent === '0' && operator === '/') return; 

    secondNumber = display.textContent;
    let result = operate(operator, firstNumber, secondNumber);

    if (typeof result === 'string') { // Division by zero error
        updateDisplay(result);
        firstNumber = ''; // Clear state after error
        operator = null;
        shouldResetDisplay = true;
        return;
    }

    // Set up for chaining
    firstNumber = result; 
    operator = null;
    shouldResetDisplay = true;

    updateDisplay(result);
};

const handleOperator = (newOperator) => {
    // If no first number is set, store the current display value
    if (firstNumber === '') {
        firstNumber = display.textContent;
    } 
    // If a first number and an operator are already set, it's a chain operation
    else if (operator) {
        // (Gotcha: Chaining Operations) Perform the pending calculation first
        evaluate(); 
    }
    
    // (Gotcha: Consecutive Operators) Only update the operator
    operator = newOperator; 
    shouldResetDisplay = true;
};


// --- 5. EVENT LISTENERS ---

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('number')) {
            // (Gotcha: New calculation after result) Handle display reset
            if (display.textContent === '0' || shouldResetDisplay) {
                display.textContent = value;
                shouldResetDisplay = false;
            } else {
                // Limit display length to prevent overflow
                if (display.textContent.length < 15) { 
                    display.textContent += value;
                }
            }
        } 
        
        else if (button.dataset.operator) {
            handleOperator(button.dataset.operator);
        }
        
        else if (button.dataset.action === 'equals') {
            evaluate();
        }
        
        else if (button.dataset.action === 'clear') {
            clearAll();
        }
        
        // Extra Credit: Decimal logic
        else if (button.dataset.action === 'decimal') {
            if (shouldResetDisplay) {
                display.textContent = '0.';
                shouldResetDisplay = false;
            } else if (!display.textContent.includes('.')) {
                display.textContent += '.';
            }
        }

        // Extra Credit: Backspace logic
        else if (button.dataset.action === 'backspace') {
            // Do not backspace the error message
            if (display.textContent.includes('ERROR')) return; 

            if (display.textContent.length > 1) {
                display.textContent = display.textContent.slice(0, -1);
            } else {
                display.textContent = '0';
            }
        }
    });
});

// Extra Credit: Keyboard Support (You'll need to add this part!)