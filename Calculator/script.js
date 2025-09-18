document.addEventListener('DOMContentLoaded', () => {
            const mainDisplay = document.getElementById('main-display');
            const historyDisplay = document.getElementById('history-display');
            const calcContainer = document.querySelector('.calculator-container');

            let expression = '';
            let openParenCount = 0;
            let isErrorState = false;
            let isResultDisplayed = false;

            const updateDisplay = () => {
                if (isErrorState) return;
                mainDisplay.textContent = expression.replace(/\*/g, '×').replace(/\//g, '÷') || '0';
            };

            const clearAll = () => {
                expression = '';
                openParenCount = 0;
                historyDisplay.textContent = '';
                mainDisplay.textContent = '0';
                isErrorState = false;
                isResultDisplayed = false;
            };

            calcContainer.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;

                const value = button.dataset.value;
                if (isErrorState && value !== 'C') return;
                if (isErrorState) clearAll();


                const lastChar = expression.slice(-1);
                const operators = ['+', '-', '*', '/'];

                switch (value) {
                    case 'C':
                        clearAll();
                        break;

                    case '⌫':
                        if (expression.length > 0) {
                            if (lastChar === '(') openParenCount--;
                            if (lastChar === ')') openParenCount++;
                            expression = expression.slice(0, -1);
                        }
                        isResultDisplayed = false;
                        updateDisplay();
                        break;

                    case '=':
                        if (expression && !operators.includes(lastChar) && lastChar !== '(') {
                            try {
                                while (openParenCount > 0) {
                                    expression += ')';
                                    openParenCount--;
                                }
                                
                                historyDisplay.textContent = formatExpressionForDisplay(expression) + '=';
                                
                                // Use Function constructor for safer evaluation than direct eval
                                const rawResult = new Function('return ' + expression)();

                                if (!isFinite(rawResult)) {
                                    throw new Error("Invalid operation");
                                }
                                
                                // Handle floating point inaccuracies
                                const result = parseFloat(rawResult.toPrecision(15));
                                
                                mainDisplay.textContent = result;
                                expression = result.toString();
                                isResultDisplayed = true;
                            } catch (error) {
                                mainDisplay.textContent = 'Error';
                                historyDisplay.textContent = '';
                                isErrorState = true;
                                expression = '';
                            }
                        }
                        break;

                    case '+':
                    case '*':
                    case '/':
                    case '-':
                        if (expression === '' && value === '-') {
                            expression += value;
                        } else if (expression !== '' && !operators.includes(lastChar) && lastChar !== '(') {
                            expression += value;
                        } else if (operators.includes(lastChar)) {
                            expression = expression.slice(0, -1) + value;
                        }
                        isResultDisplayed = false;
                        updateDisplay();
                        break;

                    case '.':
                        if (isResultDisplayed) {
                            expression = '0.';
                            isResultDisplayed = false;
                        } else {
                            const parts = expression.split(/[+\-*/()]/);
                            if (!parts[parts.length - 1].includes('.')) {
                                expression += value;
                            }
                        }
                        updateDisplay();
                        break;
                    
                    case 'paren':
                        isResultDisplayed = false;
                        // ** IMPROVED LOGIC **
                        // This logic now handles implicit multiplication, like converting 5( to 5*(
                        const isLastCharNumber = !isNaN(parseInt(lastChar));
                        if (isLastCharNumber || lastChar === ')') {
                             if (openParenCount > 0) {
                                expression += ')';
                                openParenCount--;
                             } else {
                                expression += '*(';
                                openParenCount++;
                             }
                        } else {
                            expression += '(';
                            openParenCount++;
                        }
                        updateDisplay();
                        break;
                    
                    case 'logo':
                        console.log('Calculator by you! ❤️');
                        break;

                    default: // Handle numbers
                        if (isResultDisplayed) {
                            expression = value;
                            isResultDisplayed = false;
                        } else {
                            expression += value;
                        }
                        updateDisplay();
                        break;
                }
            });

            // Bonus: Keyboard Support
            document.addEventListener('keydown', (e) => {
                const keyMap = { 'Enter': '=', 'Escape': 'C', 'Backspace': '⌫', '(': 'paren', ')': 'paren' };
                const key = keyMap[e.key] || e.key;
                const button = document.querySelector(`button[data-value="${key}"]`);
                if (button) {
                    e.preventDefault();
                    button.click();
                }
            });

            // Helper function to format expression for display
            const formatExpressionForDisplay = (exp) => {
                return exp.replace(/\*/g, '×').replace(/\//g, '÷');
            };
        });