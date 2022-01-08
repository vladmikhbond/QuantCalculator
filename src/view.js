// result - или одно комп.число, или двумерный массив чисел

function beautifyResult(result) {
   let str = result instanceof Array ? JSON.stringify(result) : result.toString();
   // заменяем комп.числа в виде объектов строками:  {"re": 0.5, "im": -1.2} -> "0.5-1.2i"
   let regex = /\{"re":(\-?\d*\.?\d*),"im":(\-?\d*\.?\d*)\}/g;
   str = str.replaceAll(regex, replacer );
   // ставим пробел после запятой
   str = str.replaceAll(",", ", " );
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


function draw(result) {
   const ctx = canvas.getContext("2d");
   ctx.clearRect(0, 0, canvas.width, canvas.height); 
   ctx.font = '20px arial';
   ctx.textAlign = "right";
   const D = 20;
   

   // complex
   if (result instanceof Complex) {
      str = result.toString();
      let x = (canvas.width - ctx.measureText(str).width) / 2;
      let y = canvas.height / 2;
      ctx.fillText(str, x, y); 
      return;
   }
   // matrix
   let maxWidth = result.reduce((a, r) => 
         Math.max(a, Math.max(...(r.map(c => ctx.measureText(c + "").width)))), 
         0);
   let sizeX = result[0].length * 2*D + maxWidth;
   let sizeY = result.length * D;
   let left = (canvas.width - sizeX) / 2;
   let top = (canvas.height - sizeY) / 2;
   
   y = top;
   for (let row of result) {
      x = left;
      for (let c of row) {
         ctx.fillText(c.toString(), x, y); 
         x += 2*D + maxWidth;        
      } 
      y += D;
   }
     
}
