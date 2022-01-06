// const { Complex } = require("complex.js");

const $btnGo = document.getElementById("btnGo");
const $expr = document.getElementById("expr");
const $exprRes = document.getElementById("exprRes");


$btnGo.addEventListener('click', refresh);

function refresh() {
  let values = valuesDict();
  let str = evalExpr($expr.value, values);
  str = beauty(str);
  $exprRes.innerHTML = str;       
}

function beauty(str) {
    let regex = /\{"re":(\-?\d*\.?\d*),"im":(\-?\d*\.?\d*)\}/g;
    str = str.replaceAll(regex, replacer );
    return str;
  
    function replacer(s, re, im) {
      if (re == 0 && im == 0) {
         return "0";
      }
      if (re != 0 && im == 0) {
         return re.toString();
      }
      if (re == 0 && im != 0) {
         return `${im}i`;
      }
      if (im < 0) {
        if (im == -1) return `${re}-i`;
        return `${re}-${-im}i`;
      }
      if (im == 1) return `${re}+i`;
      return `${re}+${im}i`;    
    }
  
}

function evalExpr(expr, values) {
  let lexems = lexical(expr);
  let poland = toPoland(lexems);
  let result = evalPoland(poland, ops, values);
  let str = result instanceof Array ? JSON.stringify(result) : result.toString();
  return str;
}

function valuesDict() {
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
