class Equotion {
   constructor(idx, lvalue, rvalue, values) {
     this.idx = idx;
     this.left = lvalue;
     this.right = rvalue;
     [this.value, this.error] = this.calc(values);
     values[this.left] = this.value;
   }
 
   calc(values) {
     let res = evalConst(this.right);
     try {
        if (!res) res = evalExpr(this.right, values);
     } catch (error) {
        return [null, error];
     }
     return [res, null];
   }      
 }
 