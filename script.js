const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator-keys')
const display = calculator.querySelector('.calculator-display')

const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'add') return firstNum + secondNum
    if (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if (operator === 'divide') return firstNum / secondNum
}

const getKeyType = (key) => {
    const { action } = key.dataset
    if (!action) return 'number'
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) return 'operator'
    return action
}

const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    let {
      firstValue,
      modValue,
      operator,
      previousKeyType
    } = state
    
    if (keyType === 'number') {
      return displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
        ? keyContent
        : displayedNum + keyContent
    }

    if (keyType === 'decimal') {
        if (!displayedNum.includes('.')) return displayedNum + '.'
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
        return displayedNum
    }

    if (keyType === 'operator') {
        return firstValue &&
          operator &&
          previousKeyType !== 'operator' &&
          previousKeyType !== 'calculate'
          ? calculate(firstValue, operator, displayedNum)
          : displayedNum
    }

    if (keyType === 'clear') return 0

    if (keyType === 'calculate') {
        return firstValue
          ? previousKeyType === 'calculate'
            ? calculate(displayedNum, operator, modValue)
            : calculate(firstValue, operator, displayedNum)
          : displayedNum
    }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key)
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = calculator.dataset

    calculator.dataset.previousKeyType = keyType

    if (keyType === 'operator') {
        calculator.dataset.operator = key.dataset.action
        calculator.dataset.firstValue = firstValue &&
          operator &&
          previousKeyType !== 'operator' &&
          previousKeyType !== 'calculate'
          ? calculatedValue
          : displayedNum
    }

    if (keyType === 'clear' && key.textContent === 'AC') {
        calculator.dataset.firstValue = ''
        calculator.dataset.modValue = ''
        calculator.dataset.operator = ''
        calculator.dataset.previousKeyType = ''
    }

    if (keyType === 'clear' && key.textContent !== 'AC') {
        key.textContent = 'AC'
    }

    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]')
        clearButton.textContent = 'CE'
    }

    if (keyType === 'calculate') {
        calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
        ? modValue
        : displayedNum
    }
}

keys.addEventListener('click', e => {
    if (e.target.matches('button')){
        const key = e.target
        const displayedNum = display.textContent
        const resultString = createResultString(key, displayedNum, calculator.dataset)

        display.textContent = resultString
        updateCalculatorState(key, calculator, resultString, displayedNum)
    }
})