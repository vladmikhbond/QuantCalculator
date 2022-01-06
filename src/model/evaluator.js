function valuesDict(n) {
   let values = new Map();
   for (let i = 0; i < n; i++) {
      let name = document.getElementById("name"+i).value;
      let value = document.getElementById("value"+i).value;
      if (!name || !value) 
         continue;
      if (value.indexOf('[') != -1) {
         value = JSON.parse(value);  // TODO json временно
      } else {
         value = new Complex(value);
      }     
      values[name] = value;
   }
   return values;
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

