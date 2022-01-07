function fillValuesDict(n) 
{
   let values = new Map();
   for (let i = 0; i < n; i++) {
      let lvalue = document.getElementById("name"+i).value.trim();
      let rvalue = document.getElementById("value"+i).value.trim();
      if (lvalue && rvalue) {
         values[lvalue] = getValue(lvalue, rvalue);
      }
   }
   return values;
}

function getValue(lvalue, rvalue) {
   // bra
   if (lvalue[0] =="<") {
      let v = rvalue.replace(/[\[\]]/g, "").split(",")
          .map(x => new Complex(x));
      return [v];
   }
   //ket
   if (lvalue.slice(-1) ==">") {
      let v = rvalue.replace(/[\[\]]/g, "").split(",")
          .map(x => new Complex(x));
      return v.map(x => [x]);
   }
   // matrix
   if (rvalue.indexOf('[') != -1) {
      return JSON.parse(rvalue); 
   } 
   if (rvalue.indexOf(',') != -1 || rvalue.indexOf(';') != -1) {
      let rows = rvalue.split(";").filter(r => r.trim());
      let v = rows.map(r => r.split(',').map(x => new Complex(x)));
      return v; 
   } 
   
   return new Complex(rvalue);       
}

function evalExpr(expr, values) {
   let lexems = lexical(expr);
   let poland = toPoland(lexems);
   let result = evalPoland(poland, ops, values);
   let str = result instanceof Array ? JSON.stringify(result) : result.toString();
   return str;
}
     

function beautifyResult(str) {
   // заменяем комп числа строеками:  {"re": 0.5, "im": -1.2} -> "0.5-1.2i"
   let regex = /\{"re":(\-?\d*\.?\d*),"im":(\-?\d*\.?\d*)\}/g;
   str = str.replaceAll(regex, replacer );
   // ставим пробел после запятой
   str = str.replaceAll(",", ", " );
   // убираем внешне скобки, если они есть
   // if (str[0] == '[' && str[str.length - 1] == ']') {
   //    str = str.slice(1, -1);
   // }
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

