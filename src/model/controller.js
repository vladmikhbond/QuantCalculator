// const { Complex } = require("complex.js");

const $btnGo = document.getElementById("btnGo");
const $expr = document.getElementById("expr");
const $exprRes = document.getElementById("exprRes");

$btnGo.addEventListener('click', refresh);

function refresh() {
  let str = null;
  try {
    let values = fillValuesDict(5);
    for (let i = 0; i < 5; i++) {
      let lvalue = document.getElementById("name"+i).value.trim();
      let info = document.getElementById("info"+i);
      if (values[lvalue]) {
         info.innerHTML = beautifyResult(values[lvalue]);
      }
    }
    let res = evalExpr($expr.value, values);
    str = beautifyResult(res);
  } catch(e) {
    str = e.message;
    throw e;
  }
  $exprRes.innerHTML = str;       
}
