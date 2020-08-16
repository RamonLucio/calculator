const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator-keys')
const display = calculator.querySelector('.calculator-display')

const calculate = (n1, operator, n2) => {
    let result = ''
    
    if (operator === 'add') {
      result = parseFloat(n1) + parseFloat(n2)
    } else if (operator === 'subtract') {
      result = parseFloat(n1) - parseFloat(n2)
    } else if (operator === 'multiply') {
      result = parseFloat(n1) * parseFloat(n2)
    } else if (operator === 'divide') {
      result = parseFloat(n1) / parseFloat(n2)
    }
    
    return result
}

keys.addEventListener('click', e => {
    const key = e.target
    const action = key.dataset.action
    const keyContent = key.textContent
    const displayedNum = display.textContent
    const previousKeyType = calculator.dataset.previousKeyType

    if (e.target.matches('button')) {

        if (!action) {
            if (displayedNum === '0' ||
                previousKeyType === 'operator' ||
                previousKeyType === 'calculate'
            ) {
                display.textContent = keyContent
            } else {
                display.textContent = displayedNum + keyContent
            }
            calculator.dataset.previousKeyType = 'number'
        }

        if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            const firstValue = calculator.dataset.firstValue
            const operator = calculator.dataset.operator
            const secondValue = displayedNum

            if (firstValue &&
                operator && 
                previousKeyType !== 'operator' &&
                previousKeyType !== 'calculate') {
                const calcValue = calculate(firstValue, operator, secondValue)
                display.textContent = calcValue
                calculator.dataset.firstValue = calcValue
            } else {
                calculator.dataset.firstValue = displayedNum
            }

            calculator.dataset.previousKeyType = 'operator'
            calculator.dataset.operator = action
        }

        if (action === 'decimal') {
            if (!displayedNum.includes('.')) {
                display.textContent = displayedNum + '.'
            } else if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = '0.'
            }
            calculator.dataset.previousKey = 'decimal'
        }

        if (action !== 'clear') {
            const clearButton = calculator.querySelector('[data-action=clear]')
            clearButton.textContent = 'CE'
        }
        
        if (action === 'clear') {
            if (key.textContent === 'AC') {
                calculator.dataset.firstValue = ''
                calculator.dataset.modValue = ''
                calculator.dataset.operator = ''
                calculator.dataset.previousKeyType = ''
            } else {
                key.textContent = 'AC'
            }
            display.textContent = 0
            calculator.dataset.previousKeyType = 'clear'
        }
        
        if (action === 'calculate') {
            let firstValue = calculator.dataset.firstValue
            const operator = calculator.dataset.operator
            let secondValue = displayedNum
            
            if (firstValue) {
                if (previousKeyType === 'calculate') {
                    firstValue = displayedNum
                    secondValue = calculator.dataset.modValue
                }
                display.textContent = calculate(firstValue, operator, secondValue)
            }
            calculator.dataset.modValue = secondValue
            calculator.dataset.previousKeyType = 'calculate'
          }
        }
    })