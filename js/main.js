(function () {

  let appState = {
    numberOfProblems: 30,
    minNumDigits: 1,
    maxNumDigits: 1,
    allowBorrowing: false,
    operatorType: '+'
  }


  const numberOfProblemsEl = document.getElementById('numberOfProblems')
  const minDigitsEl = document.getElementById('minDigits')
  const maxDigitsEl = document.getElementById('maxDigits')
  const generateSheetEl = document.getElementById('generateSheet')
  const allowBorrowingEl = document.getElementById('allowBorrowing')
  const operatorTypeEl = document.querySelectorAll('input[type="radio"][name="operatorType"]')
  const subtractionOperatorEl = document.getElementById('subtraction')
  const allowBorrowingLabelEl = document.getElementById('allowBorrowingLabel')

  function generateProblems() {
    let problemArray = [];
    let problem = {}
    
    for (let i = 0; i < appState.numberOfProblems; i++) {    
      problem = generateProblem()
      problemArray.push(problem)
    }

    return problemArray;
  }

  function generateProblem() {
    let operand1 = 0
    let operand2 = 0
    let difference = 0

    let operand1String = ""
    let operand2String = ""

    setDigitLimits()
    
    let numDigits = getRandomInt(appState.minNumDigits, appState.maxNumDigits)
    
    for (let i = 0; i < numDigits; i++) {
      operand1 = getRandomInt(0, 9)
      operand2 = (subtractionOperatorEl.checked && appState.allowBorrowing) ? getRandomInt(0, 9) :  getRandomInt(0, operand1)

      operand1String += operand1
      operand2String += operand2
    }

    return {
      operand1: parseInt(operand1String, 10),
      operand2: parseInt(operand2String, 10),
      result: operand1 - operand2
    }
  }
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1; // make max inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function addListeners() {

    document.addEventListener('change', (event) => {
      console.log(event.target)
      serializeAppState()
    })
    
    minDigitsEl.addEventListener("change", () => {
      if (minDigitsEl.value > maxDigitsEl.value) {
        maxDigitsEl.value = minDigitsEl.value
        setDigitLimits()
      }
    })
    
    minDigitsEl.addEventListener("oninput", () => {
      if (minDigitsEl.value > maxDigitsEl.value) {
        maxDigitsEl.value = minDigitsEl.value
        setDigitLimits()
      }
    })

    
    maxDigitsEl.addEventListener("change", () => {
      if (minDigitsEl.value > maxDigitsEl.value) {
        minDigitsEl.value = maxDigitsEl.value
        setDigitLimits()
      }
    })

    maxDigitsEl.addEventListener("oninput", () => {
      if (minDigitsEl.value > maxDigitsEl.value) {
        minDigitsEl.value = maxDigitsEl.value
        setDigitLimits()
      }
    })

    generateSheetEl.addEventListener("click", () => {
      renderProblems(generateProblems())
      return false;
    })

    operatorTypeEl.forEach((radioButton) => {
      radioButton.addEventListener('change', (event) => {
        setOperatorType(event.target.value)
        toggleAllowBorrowing()
      })
    })

    numberOfProblemsEl.addEventListener('change', (event) => {
      setNumberOfProblems(event.target.value)
    })
  }

  function serializeAppState() {
    console.log('serializeAppState', localStorage.getItem('appState'));
    let jsonAppStateString = JSON.stringify(appState)
    console.log('jsonAppStateString:', jsonAppStateString) 
    localStorage.setItem('appState', jsonAppStateString)
    
  }

  function restoreAppState() {
    console.log('restoreAppState', localStorage.getItem('appState'));
    if (localStorage.getItem('appState')) {

      let jsonAppStateString = localStorage.getItem('appState')
      appState = JSON.parse(jsonAppStateString)

      numberOfProblemsEl.value = appState.numberOfProblems
      minDigitsEl.value = appState.minNumDigits
      maxDigitsEl.value = appState.maxNumDigits
      allowBorrowing.checked = appState.allowBorrowing

      operatorTypeEl.forEach((radioButton) => {
        if (radioButton.value === appState.operatorType) {
          debugger;
          radioButton.checked = true
        }
      })

    } else {
      serializeAppState()
    }
  }
  
  function toggleAllowBorrowing() {
    if (subtractionOperatorEl.checked) {
      allowBorrowingLabelEl.classList.remove('hide')
    } else {
      allowBorrowingLabelEl.classList.add('hide')
    }
  }

  function renderProblems(problemArray) {
    let frag = document.createDocumentFragment()
    document.getElementById('problemList').innerHTML = ''
    
    problemArray.forEach((item) => {

      let problemEl = document.createElement('span')
      let operand1El = document.createElement('div')
      let operand2El = document.createElement('div')
      let operatorEl = document.createElement('div')

      problemEl.classList.add('ws_problem')
      operatorEl.classList.add('ws_operator')
      
      operand1El.innerHTML = item.operand1
      operand2El.innerHTML = item.operand2
      operatorEl.innerHTML = appState.operatorType

      problemEl.appendChild(operand1El)
      problemEl.appendChild(operatorEl)
      problemEl.appendChild(operand2El)

      frag.appendChild(problemEl)
      
    })

    document.getElementById('problemList').appendChild(frag)
  }

  function setDigitLimits() {
    appState.maxNumDigits = parseInt(maxDigitsEl.value, 10)
    appState.maxNumDigits = appState.maxNumDigits > 6 ? 6 : appState.maxNumDigits
    appState.minNumDigits = parseInt(minDigitsEl.value, 10)
  }
  
  function setOperatorType(value) {
    appState.operatorType = value
    operatorTypeEl.forEach((radioButton) => {
      if (radioButton.value === value) {
        radioButton.checked = true
      }
    })
  }

  function setNumberOfProblems(value) {
    console.log('value:', value)
    value = value > 500 ? 500 : value
    appState.numberOfProblems = value
  }
  
  function init() {
    restoreAppState()
    addListeners()
    setOperatorType('-')
    toggleAllowBorrowing()
  }

  init();
})()
