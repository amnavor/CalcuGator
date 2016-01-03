$(document).ready(function() {

  var current = '';
  var operations = "*-+/";
  var equation = "";
  var show = '';

  function f(val) {
    if (val == "x") {
      val = "*";
    }
    if (val == 'AC') {
      current = '';
      show = '';
      equation = '';
    } else if (val == 'CE') {
      current = '';
      show = '';

    } else if (!isNaN(Number(val))) {
      if (current == 0) {
        current = val;
      } else {
        current = current + val;
      }
      show = current;
    } else if (val == ".") {
      if (current.indexOf(".") == -1) {
        current = current + val;
        show = current;
      }
    } else if (val == "=") {
      equation += current;
      current = '';
      if (equation.indexOf("/0") > -1) {
        show = "Error: /0";
      } else {
        show = eval(equation);
        equation = show;
      }
    } else if (operations.indexOf(val) > -1) {
      equation += current;
      current = "";
      var last = equation[equation.length - 1];
      if (operations.indexOf(last) == -1) {
        equation += val;
      }
    }

    $(".words").text(show);

  }

  $("button").on("click", function() {
    f($(this).text())
  });
});