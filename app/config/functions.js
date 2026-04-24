function getValidNumbers() {
  const inputs = document.querySelectorAll("input")

  const numbers = []
  let hasInvalidValue = false

  inputs.forEach(input => {
    const raw = input.value.trim()

    if (raw === "") return 

    const value = Number(raw)

    if (Number.isNaN(value)) {
      hasInvalidValue = true
    } else {
      numbers.push(value)
    }
  })

  return { numbers, hasInvalidValue }
}

export const functionRegistry = {
  addition: () => {
  const { numbers, hasInvalidValue } = getValidNumbers()

  const sum = numbers.reduce((acc, val) => acc + val, 0)

  if (hasInvalidValue) alert("Please enter valid numbers!")
  else alert(`Sum is ${sum}`)
},
  clearInputs: () => {
    document.querySelectorAll("input").forEach(input => input.value = "")
  },
  subtraction: () => {
  const { numbers, hasInvalidValue } = getValidNumbers()

  if (numbers.length === 0) {
    alert("No values entered!")
    return
  }

  const result = numbers.slice(1).reduce((acc, val) => acc - val, numbers[0])

  if (hasInvalidValue) alert("Please enter valid numbers!")
  else alert(`Result is ${result}`)
},

  multiplication: () => {
  const { numbers, hasInvalidValue } = getValidNumbers()

  const result = numbers.reduce((acc, val) => acc * val, 1)

  if (hasInvalidValue) alert("Please enter valid numbers!")
  else alert(`Result is ${result}`)
},  

  // __CUSTOM_FUNCTIONS_START__

  
  // fn:something
  something: () => {
    alert("something");
  },
  // end:something
  // fn:changeBg
  changeBg: () => {
    function changeBg(){
    document.body.style.backgroundColor='blue'}
  },
  // end:changeBg

  // fn:changeBlack
  changeBlack: () => {
    function changeBg(){
        document.body.style.backgroundColor='black'}
  },
  // end:changeBlack
  // fn:changePink
  changePink: () => {
    function changeBg(){
        document.querySelector('.canvas').style.backgroundColor='pink'}
  },
  // end:changePink
// __CUSTOM_FUNCTIONS_END__

}