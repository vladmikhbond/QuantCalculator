// const { Complex } = require("complex.js");

const $btnGo = document.getElementById("btnGo");
const $expr = document.getElementById("expr");
const $exprRes = document.getElementById("exprRes");


$btnGo.addEventListener('click', refresh);

function refresh() {
  let values = defineValues();

  let lexems = lexical($expr.value);
  let poland = toPoland(lexems);
  let result = evalPoland(poland, ops, values);
  let str = result instanceof Array ? JSON.stringify(result) : result.toString();
  $exprRes.innerHTML = str;       
}

function defineValues() {
  let values = new Map();
  for (let i = 0; i < 3; i++) {
    let name = document.getElementById("name"+i).value;
    let value = document.getElementById("value"+i).value;
    if (value.indexOf('[') != -1) {
      value = JSON.parse(value);
    } else {
      value = new Complex(value);
    }     
    values[name] = value;
  }
  return values;
}
