function evalExpr(input, values) {
   let lexems = lexical(input);
   let poland = toPoland(lexems);
   let result = evalPoland(poland, ops, values);
   return result;
}

function evalConst(input) {
   if (input.indexOf(',') != -1 || input.indexOf('/') != -1) {
      let rows = input.split("/").filter(r => r.trim());
      let v = rows.map(r => r.split(',').map(x => new Complex(x)));
      return v; 
   }   
   return new Complex(input);       
}
