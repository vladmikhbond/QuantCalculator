// const { Complex } = require("complex.js");

const $btnGo = document.getElementById("btnGo");
const $expr = document.getElementById("expr");
const $exprRes = document.getElementById("exprRes");

$btnGo.addEventListener('click', refresh);

function refresh() {
  let values = valuesDict(5);
  let str = evalExpr($expr.value, values);
  str = beautifyResult(str);
  $exprRes.innerHTML = str;       
}
