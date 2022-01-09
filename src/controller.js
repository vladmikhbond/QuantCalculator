// const { Complex } = require("complex.js");

const $btnGo = document.getElementById("btnGo");
const N = 8;


$btnGo.addEventListener('click', refresh);


function refresh() {
  evalAll();
}

function evalAll() {
  let values = new Map();
  for (let i = 0; i < N; i++) {
    let lvalue = document.getElementById("name"+i).value.trim();
    let rvalue = document.getElementById("value"+i).value.trim();
    let info = document.getElementById("info"+i);

    if (lvalue && rvalue) {
      if (isConst(rvalue)) {
        values[lvalue] = evalConst(rvalue);
      } else {
        values[lvalue] = evalExpr(rvalue, values);
      }
      info.innerHTML = beautifyResult(values[lvalue]);
    }
  }      
}

function isConst(input) {
  return /\d/.test(input);
}

//=====================================================

function createInputDivs(n) {
  let father = document.getElementById('father');
  for (let i = 0; i < n; i++) {
      let div = document.createElement("div");
      div.className="v0";
      div.innerHTML = `
<input id="name${i}" class="v1" value="${fillData(i)[0]}">
<span class="v2">=</span> 
<input id="value${i}" class="v3" value="${fillData(i)[1]}">
<span id="info${i}" class="v4"></span>`;
      father.append(div);
  }
}

function fillData(i) {
  let data = `
  x = 1,2,3
  y = 4,5,6
  z = x' + y'
  `;
  let ds = data.split('\n').filter(x => x.trim()).map(eq => eq.split('='));
  if (i < ds.length)
     return [ds[i][0].trim(), ds[i][1].trim()];
  return ["", ""];
}

createInputDivs(N);    
