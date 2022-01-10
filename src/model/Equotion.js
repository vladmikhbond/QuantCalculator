class Equotion {
   constructor(idx, lvalue, rvalue, values) {
     this.idx = idx;
     this.left = lvalue;
     this.right = rvalue;
     this.value = this.calc(values);
     values[this.left] = this.value;
   }
 
   calc(values) {
     const isTerm = line => /\d/.test(line);
 
     if (!this.left || !this.right) 
        return;
     if (isTerm(this.right)) {
       return evalConst(this.right);
     } 
     return evalExpr(this.right, values); 
   }
      
 }
 