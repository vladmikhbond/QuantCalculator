const FRACTION_DIGITS = 2; // точность чисел при печати

function show(equotions) {
   for (let i = 0; i < equotions.length; i++) 
   {
      const info = document.getElementById("info"+i);
      if (equotions[i].error) {
         info.style.color = 'red';
         info.innerHTML = equotions[i].error.message;
         continue;
      } 
      let str = beautifyResult(equotions[i].value);
      info.title = str;
      // обрезаем длину
      if (str.length > 25) 
      str = str.slice(0, 25) + "...";
      info.style.color = 'gray';
      info.innerHTML = str;
   } 
}



// result - или комп.число, или двумерный массив чисел
//
function beautifyResult(result) {
   if (!result) return "";
   let str = JSON.stringify(result); 
   // заменяем комп.числа в виде объектов строками:  {"re": 0.5, "im": -1.2} -> "0.5-1.2i"
   let regex = /\{"re":(\-?\d*\.?\d*),"im":(\-?\d*\.?\d*)\}/g;
   str = str.replaceAll(regex, replacer );
   // ставим пробел после запятой
   str = str.replaceAll(",", ", " );
   return str;
}

function replacer(_, re, im) {
   re = Number(re).toFixed(FRACTION_DIGITS);
   im = Number(im).toFixed(FRACTION_DIGITS);
  
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

function drawValuesItem(i, equotions) 
{
   function change(c) {
      let regex = /\{"re":(\-?\d*\.?\d*),"im":(\-?\d*\.?\d*)\}/g;
      let str = JSON.stringify(c);
      return str.replace(regex, replacer); 
   }

   if (!equotions || !equotions[i]) 
      return;

   let result = equotions[i].value;
   // перед отрисовкой заменяем все комп числа строками:  {"re": 0.5, "im": -1.2} -> "0.5-1.2i"
  
   // число
   if (result instanceof Complex) {
      result = change(result);
   } else if (result instanceof Array) {
      result = result.map(row => row.map(c => change(c)) );  
   } else {
      result = "";
   }
   draw(result);
}
// result - строка или массив строк
//
function draw(result) {
   const ctx = canvas.getContext("2d");
   ctx.clearRect(0, 0, canvas.width, canvas.height); 
   ctx.font = '16px arial';
   ctx.textAlign = "right";
   const D = 24;

   // complex
   if (typeof result == 'string') {
      let x = (canvas.width - ctx.measureText(result).width) / 2;
      let y = canvas.height / 2;
      ctx.fillText(result, x, y); 
      return;
   }
   // matrix
   let maxWidth = result.reduce((a, r) => 
         Math.max(a, Math.max(...(r.map(s => ctx.measureText(s).width)))), 
         0);
   let sizeX = result[0].length * D/2 + maxWidth;
   let sizeY = result.length * D;
   let left = (canvas.width - sizeX) / 2;
   let top = (canvas.height - sizeY) / 2;
   
   y = top;
   for (let row of result) {
      x = left;
      for (let c of row) {
         ctx.fillText(c.toString(), x, y); 
         x += D + maxWidth;        
      } 
      y += D;
   }
     
}
