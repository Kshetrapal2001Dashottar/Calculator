import React, { useState } from 'react'
import './index.css'

const App = () => {

  const [expression, setExpression] = useState("");
  const operator = ["/", "*", "-", "+", ".", "%"];
  const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  const handleClick = (val) => {

    if (number.includes(val)) {

      if (val == 0) {
        if (expression.length == 1 && expression[0] == 0) return
        else if (expression[expression.length - 1] == 0 && operator.includes(expression[expression.length - 2]) && expression[expression.length - 2] != ".") return
      }
      if (expression[expression.length - 1] == 0 && operator.includes(expression[expression.length - 2]) && expression[expression.length - 2] != ".") return
      if (expression.length == 1 && expression[0] == 0) return
      if (expression[expression.length - 1] === "%") return
      if (expression === 'Error') {
        setExpression(val)
      }
      else {
        setExpression(expression.concat(val))
      }

    }

    else {
      if (expression == "" && val == ".") {
        setExpression(expression.concat("0" + val))
      }
      else if (expression === "") return
      else if (val === "%" && expression[expression.length - 1] === "%") return
      else if (operator.includes(expression[expression.length - 1]) && expression[expression.length - 1] !== "%") {
        return
      }
      else if (val == ".") {

        for (let i = expression.length - 1; i >= 0; i--) {
          if (operator.includes(expression[i])) {
            if (expression[i] === ".") return
            setExpression(expression.concat(val))
          }
        }
        setExpression(expression.concat(val))
      }
      else if (operator.includes(val)) {
        setExpression(expression.concat(val))
      }
    }

  }

  const clear = () => setExpression("")

  const backspace = () => {

    if (expression == "Error") {
      setExpression("")
    }
    else if (expression == Infinity) {
      setExpression("")
    }
    else {
      setExpression(expression.slice(0, expression.length - 1))
    }
  }

  const calculate = () => {
    try {
      if (expression.includes("%")) {
        let tempIndex = []
        let smallArry = ""
        for (let i = 0; i < expression.length; i++) {
          smallArry += expression[i]
          if (expression[i] == "%") {
            tempIndex.push(smallArry)
            smallArry = ""
          }
        }
        if (smallArry !== "") tempIndex.push(smallArry)
        let tempResult = 0
        let remainingString = ""
        let continueExpression = ""
        let continueStr = ""
        for (let i = 0; i < tempIndex.length; i++) {
          let firstExpression = tempIndex[i]
          let tempOperator = ""
          let count = 0
          if (firstExpression[firstExpression.length - 1] === "%") {
            let percentNumber = ""
            for (let j = firstExpression.length - 2; j >= 0; j--) {
              if (operator.includes(firstExpression[j]) && firstExpression[j] !== ".") {
                count++
                if (count === 1) {
                  tempOperator = firstExpression[j]
                  continue
                }
              }
              if (count === 0) {
                percentNumber += firstExpression[j]
              } else {
                remainingString += firstExpression[j]
              }
            }
            if (count == 0) {
              percentNumber = [...percentNumber].reverse().join("")
              continueExpression = (percentNumber / 100).toString()
              continue;
            } else {
              percentNumber = [...percentNumber].reverse().join("")
              continueExpression += [...remainingString].reverse().join("")
              continueExpression = eval(continueExpression)
              tempResult = (continueExpression * percentNumber) / 100
              tempResult = tempResult.toString()
              if (tempOperator === "*") {

                let additionString = [...remainingString].reverse().join("")
                let operationNumber = ""
                let count = 0
                let operationOperator = ""
                let remainingStr = ""

                for (let i = additionString.length - 1; i >= 0; i--) {
                  if (operator.includes(additionString[i]) && additionString[i] !== ".") {
                    count++
                    if (count === 1) {
                      operationOperator = additionString[i]
                      continue
                    }
                  }
                  if (count === 0) {
                    operationNumber += additionString[i]
                  } else {

                    remainingStr += additionString[i]
                  }
                }
                if (remainingStr == "") {
                  let foo = [...operationNumber].reverse().join("").toString()

                  continueStr = eval(continueStr.concat(operationOperator).concat(eval((foo * percentNumber) / 100)))
                  continueStr = continueStr.toString()

                  continueExpression = continueStr

                }
                else {

                  remainingStr = eval([...remainingStr].reverse().join(""))
                  operationNumber = [...operationNumber].reverse().join("")

                  tempResult = (operationNumber * percentNumber) / 100
                  remainingStr = eval(remainingStr.toString().concat(operationOperator).concat(tempResult)).toString()
                  continueStr = remainingStr.toString()
                  continueStr += continueExpression

                  remainingStr = ""
                }
              } else {
                tempResult = eval(continueExpression.toString().concat(tempOperator).concat(tempResult.toString()))
                continueExpression = tempResult.toString()
                continueStr += continueExpression
              }
              remainingString = ""
            }

          } else {
            remainingString += firstExpression
          }
        }
        setExpression(eval(continueExpression.toString().concat(remainingString)).toFixed(2).toString())
        continueStr = ""
        return

      }
      else if (isNaN(eval(expression).toString())) {
        setExpression("Error")
      }
      else {
        setExpression(eval(expression).toFixed(2).toString());
      }
    }
    catch (err) {
      setExpression("Error");
    }

  }

  return (
    <>

      <div className='body' onKeyDown={(e) => {
        if (e.key === "Enter") {
          calculate()
        }
        else if (e.key === "Backspace") {
          backspace()
        }
        else if (e.key === "Delete") {
          setExpression("");
        }
        handleClick(e.key)
      }
      }>
        <div className='container'>
          <form>
            <textarea type='text' value={expression} onChange={(text) => setExpression(text.target.value)} readOnly className='error' />
          </form>
          <div className='keypad'>
            <button id='clear' onClick={clear} className='gray'>A/C</button>
            <button id='backspace' onClick={backspace} className='gray'>CLR</button>
            <button onClick={() => handleClick("%")} className='gray'>%</button>
            <button onClick={() => handleClick("/")} className='gold'>&divide;</button>
            <button onClick={() => handleClick("7")}>7</button>
            <button onClick={() => handleClick("8")}>8</button>
            <button onClick={() => handleClick("9")}>9</button>
            <button onClick={() => handleClick("*")} className='gold'>&times;</button>
            <button onClick={() => handleClick("4")}>4</button>
            <button onClick={() => handleClick("5")}>5</button>
            <button onClick={() => handleClick("6")}>6</button>
            <button onClick={() => handleClick("-")} className='gold'>&ndash;</button>
            <button onClick={() => handleClick("1")}>1</button>
            <button onClick={() => handleClick("2")}>2</button>
            <button onClick={() => handleClick("3")}>3</button>
            <button onClick={() => handleClick("+")} className='gold'>+</button>
            <button onClick={() => handleClick("0")}>0</button>
            <button onClick={() => handleClick(".")}>.</button>
            <button onClick={() => calculate("=")} id='result' >=</button>
          </div>
        </div>
      </div>

    </>
  )
}

export default App