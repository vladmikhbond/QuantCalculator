class Equotion {
  constructor(idx, lvalue, rvalue, values) {
    this.idx = idx;
    this.left = lvalue;
    this.right = rvalue;
    this.value = calc(values);
    values[this.left] = this.value;
  }

  calc(values) {
    const isTerm = line => 
        /\d/.test(line);

    if (!this.left || !this.right) 
       return;
    if (isTerm(this.right)) {
      return evalConst(this.right);
    } 
    return evalExpr(this.right, values); 
  }

     
}

let $parent = document.getElementById('parent');

btnGo.addEventListener('click',  refresh);
btnAdd.addEventListener('click', addDiv);
btnRemove.addEventListener('click',  removeDiv);
const values = new Map();

function refresh() 
{
  const isTerm = line => /\d/.test(line);
  values.clear();
  for (let i = 0; ; i++) {
    if (!document.getElementById("name"+i))
        break;
    let lvalue = document.getElementById("name"+i).value.trim();
    let rvalue = document.getElementById("value"+i).value.trim();
    let info = document.getElementById("info"+i);
    


    if (lvalue && rvalue) {
      if (isTerm(rvalue)) {
        values[lvalue] = evalConst(rvalue);
      } else {
        values[lvalue] = evalExpr(rvalue, values);
      }
      let str = beautifyResult(values[lvalue]);
      info.title = str;
      // обрезаем длину
      if (str.length > 25) 
        str = str.slice(0, 25) + "...";
      info.innerHTML = str;
    }
  }      
}



//=====================================================

function removeDiv() {
   $parent.lastChild.remove();
}

function addDiv() {
  let i = $parent.childElementCount;
  let div = document.createElement("div");
      div.className="v0";
      div.innerHTML = `
<input id="name${i}" class="v1" value="" onclick="drawValuesItem(${i})">
<span class="v2">=</span> 
<input id="value${i}" class="v3" value="">
<span id="info${i}" class="v4"></span>`;
      $parent.append(div);
}

function createDivsFromData(dataStr) {
  let ds = dataStr.split('\n')
    .map(x => x.trim())
    .map(line => line == "" ? ["", ""] : line.split('=').map(x => x.trim())); 
  
    $parent.innerHTML = '';
  for (let i = 0; i < ds.length; i++) {
      let div = document.createElement("div");
      div.className="v0";
      div.innerHTML = `
<input id="name${i}" class="v1" value="${ds[i][0]}" onclick="drawValuesItem(${i})">
<span class="v2">=</span> 
<input id="value${i}" class="v3" value="${ds[i][1]}">
<span id="info${i}" class="v4"></span>`;
      $parent.append(div);
  }
}

