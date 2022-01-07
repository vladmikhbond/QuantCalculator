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
   if (rvalue.indexOf(',') != -1 || rvalue.indexOf('/') != -1) {
      let rows = rvalue.split("/").filter(r => r.trim());
      let v = rows.map(r => r.split(',').map(x => new Complex(x)));
      return v; 
   }   
   return new Complex(rvalue);       
}

function evalExpr(expr, values) {
   let lexems = lexical(expr);
   let poland = toPoland(lexems);
   let result = evalPoland(poland, ops, values);
   return result;
}
     

function beautifyResult(result) {
   let str = result instanceof Array ? JSON.stringify(result) : result.toString();
   // заменяем комп числа строками:  {"re": 0.5, "im": -1.2} -> "0.5-1.2i"
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

