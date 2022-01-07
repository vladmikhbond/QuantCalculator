// const { Complex } = require("complex.js");

const $btnGo = document.getElementById("btnGo");
const $expr = document.getElementById("expr");
const $exprRes = document.getElementById("exprRes");

$btnGo.addEventListener('click', refresh);

function refresh() {
  let str = null;
  try {
    let values = fillValuesDict(5);
    str = evalExpr($expr.value, values);
    str = beautifyResult(str);
  } catch(e) {
    str = e.message
  }
  $exprRes.innerHTML = str;       
}
