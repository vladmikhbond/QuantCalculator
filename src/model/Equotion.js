class Equotion {
   constructor(idx, lvalue, rvalue, values) {
     this.idx = idx;
     this.left = lvalue;
     this.right = rvalue;
     this.value = this.calc(values);
     values[this.left] = this.value;
   }
 
   calc(values) {
     let res = evalConst(this.right);
     if (!res) {
        res = evalExpr(this.right, values); 
     }
     return res;
   }
      
 }
 