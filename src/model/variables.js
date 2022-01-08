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



