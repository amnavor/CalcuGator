(function () {
  "use strict";

  var OPERATORS = "+-*/";

  var currentInput = "";
  var equation = "";
  var display = "";

  var displayEl = document.querySelector(".words");

  function updateDisplay(value) {
    display = value;
    displayEl.textContent = display;
  }

  // Safely evaluate a math expression without eval()
  function safeEvaluate(expr) {
    // Tokenize: split into numbers and operators
    var tokens = [];
    var numBuffer = "";

    for (var i = 0; i < expr.length; i++) {
      var ch = expr[i];

      // Handle negative numbers at start or after an operator
      if (ch === "-" && (i === 0 || OPERATORS.indexOf(expr[i - 1]) !== -1)) {
        numBuffer += ch;
      } else if (OPERATORS.indexOf(ch) !== -1) {
        if (numBuffer) {
          tokens.push(parseFloat(numBuffer));
          numBuffer = "";
        }
        tokens.push(ch);
      } else {
        numBuffer += ch;
      }
    }
    if (numBuffer) {
      tokens.push(parseFloat(numBuffer));
    }

    // First pass: handle * and /
    var simplified = [tokens[0]];
    for (var j = 1; j < tokens.length; j += 2) {
      var op = tokens[j];
      var next = tokens[j + 1];
      if (op === "*") {
        simplified[simplified.length - 1] *= next;
      } else if (op === "/") {
        simplified[simplified.length - 1] /= next;
      } else {
        simplified.push(op);
        simplified.push(next);
      }
    }

    // Second pass: handle + and -
    var result = simplified[0];
    for (var k = 1; k < simplified.length; k += 2) {
      var addOp = simplified[k];
      var addNext = simplified[k + 1];
      if (addOp === "+") {
        result += addNext;
      } else if (addOp === "-") {
        result -= addNext;
      }
    }

    return result;
  }

  function handleInput(value) {
    if (value === "AC") {
      currentInput = "";
      equation = "";
      updateDisplay("");
      return;
    }

    if (value === "CE") {
      currentInput = "";
      updateDisplay("");
      return;
    }

    if (!isNaN(Number(value))) {
      // Avoid leading zeros (e.g. "007")
      if (currentInput === "0" && value !== "0") {
        currentInput = value;
      } else if (currentInput === "0" && value === "0") {
        // do nothing, already "0"
      } else {
        currentInput += value;
      }
      updateDisplay(currentInput);
      return;
    }

    if (value === ".") {
      if (currentInput.indexOf(".") === -1) {
        currentInput += value;
        updateDisplay(currentInput);
      }
      return;
    }

    if (value === "=") {
      if (!currentInput && !equation) return;
      equation += currentInput;
      currentInput = "";

      if (equation.indexOf("/0") !== -1) {
        updateDisplay("Error: /0");
        equation = "";
      } else {
        var result = safeEvaluate(equation);
        updateDisplay(result);
        equation = String(result);
      }
      return;
    }

    // Operator pressed
    if (OPERATORS.indexOf(value) !== -1) {
      equation += currentInput;
      currentInput = "";

      // Prevent consecutive operators — replace the last one
      var lastChar = equation[equation.length - 1];
      if (OPERATORS.indexOf(lastChar) !== -1) {
        equation = equation.slice(0, -1);
      }
      equation += value;
    }
  }

  document.querySelector(".whole").addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      handleInput(e.target.getAttribute("data-value"));
    }
  });
})();
