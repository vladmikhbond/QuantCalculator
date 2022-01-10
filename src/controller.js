
let $parent = document.getElementById('parent');

btnGo.addEventListener('click',  refresh);
btnAdd.addEventListener('click', addDiv);
btnRemove.addEventListener('click',  removeDiv);
btnClear.addEventListener('click',  removeAllDivs);

let equotions;

function refresh() 
{  
  equotions = makeEquotions();
  show(equotions); 
  save(equotions);    
}

function makeEquotions() 
{
  const values = new Map();
  let equotions = [];
  for (let i = 0; ; i++) {
    if (!document.getElementById("name"+i))
        break;
    let lvalue = document.getElementById("name"+i).value.trim();
    let rvalue = document.getElementById("value"+i).value.trim();
    let eq = new Equotion(i, lvalue, rvalue, values);
    equotions.push(eq);
  }
  return equotions;
}

function save(es) {
  let line = ""
  for (let i = 0; i < es.length; i++) {
    line += `${es[i].left} = ${es[i].right}\n`;
  }
  let $saved = document.getElementById("saved")
  $saved.value = line;
  $saved.rows = line.split("\n").length;
}

//=====================================================

function removeDiv() {
  $parent.lastChild.remove();
}
function removeAllDivs() {
  $parent.innerHTML = "";
  setTimeout(addDiv, 100);
}

function addDiv() {
  let i = $parent.childElementCount;
  let div = document.createElement("div");
      div.className="v0";
      div.innerHTML = `
<input id="name${i}" class="v1" value="" onclick="drawValuesItem(${i}, equotions)">
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
<input id="name${i}" class="v1" value="${ds[i][0]}" onclick="drawValuesItem(${i}, equotions)">
<span class="v2">=</span> 
<input id="value${i}" class="v3" value="${ds[i][1]}">
<span id="info${i}" class="v4"></span>`;
      $parent.append(div);
  }
}

