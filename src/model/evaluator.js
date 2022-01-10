function evalExpr(input, values) {
   let lexems = lexical(input);
   let poland = toPoland(lexems);
   let result = evalPoland(poland, ops, values);
   return result;
}

function evalConst(input) {
   try {
      if (input.indexOf(',') != -1 || input.indexOf('/') != -1) {
         let rows = input.split("/").filter(r => r.trim());
         let v = rows.map(r => r.split(',').map(x => new Complex(x)));
         return v; 
      } else {
         return new Complex(input);   
      }  
   } catch {
      return null;   
   }    
}


function evalPoland(poland, ops, vals) {
   const stack = [];
   for (let lex of poland) {
      switch(lex) {
         // unaries
         case ERMIT: case NORM: case BRA: case PROB:
         let c = stack.pop();
         if (!c) throw new Error("wrong poland expression 1 ")
         let op1 = ops[lex];
         stack.push(op1(c)); 
         break;
         // binaries
         case ADD: case SUB:case MUL: case DIRAK: case KRON: 
         let c2 = stack.pop();
         let c1 = stack.pop();
         if (!c1 || !c2) throw new Error("wrong poland expression 2")
         let op2 = ops[lex];
         stack.push(op2(c1, c2)); 
         break;

         default:
            if (!vals[lex]) throw new Error("wrong poland expression V")
            stack.push(vals[lex]);
      }      
   }
          
   return stack[0];
}


const ops = {
   //[CONJ]: _conj,
   [ERMIT]: _ermit,
   [BRA]: _ermit,
   [ADD]: _add,
   [SUB]: _sub,
   [MUL]: _mul,
   [DIRAK]: _dirak,
   [KRON]: _kron,
   [NORM]: _norm,
    [PROB]: _prob,
}

function _prob(x) {
   if (x instanceof Complex)
      return x.abs()**2;
   throw new Error("Type error");
}

function _norm(m) {
   return new Matrix(m).normalize().arr;
}

function _conj(com) {
   return com.conjugate();
}

function _ermit(x) {
   if (x instanceof Array) {
       return new Matrix(x).ermit().arr;
   }
   if (x instanceof Complex) {
       return x.conjugate();
   }
   throw new Error("Type error");
}

// c+c->c,  a+c->a, c+a->a, a+a->a     // a - array, c - complex
function _add(x, y) {
   // c+c->c
   if (x instanceof Complex && y instanceof Complex) {
      return x.add(y);
   }
   // c+a = a+c
   if (x instanceof Complex && y instanceof Array) {
      [x, y] = [y, x];
   }
   // a+c->a, a+a->a 
   if (x instanceof Array) {
      return new Matrix(x).add(new Matrix(y)).arr;
   }
   throw new Error("Type error");
}

function _sub(x, y) {
   // обращаем число
   if (y instanceof Complex) {
      y = y.neg();
   // обращаем матрицу
   } else if (y instanceof Array) {
      y = new Matrix(y).mul(new Complex(-1)).arr;
   }
   return _add(x, y)
}

// c*c->c,  a*c->a, c*a->a, a*a->a     // a - array, c - complex
function _mul(x, y) {
   // c*c->c
   if (x instanceof Complex && y instanceof Complex) {
      return x.mul(y);
   }
   // c*a = a
   if (x instanceof Complex && y instanceof Array) {
      return new Matrix(y).mul(x).arr;
   }
   // a*c = a
   if (x instanceof Array && y instanceof Complex) {
      return new Matrix(x).mul(y).arr;
   }
   // a*a->a 
   if (x instanceof Array) {
      return new Matrix(x).mul(new Matrix(y)).arr;
   }
   throw new Error("Type error");
}



// <x|y> - скалярное произведение 
// x>|y> - тензорное произведение 
// <x|c , c|y>  - умножение вектора на число c
// <x|A , A|y> - умножение матриц x*A или A*y
//
function _dirak(x, y) {
   const error = () => console.error(x, y);

   let xm = x instanceof Array ? new Matrix(x) : null;
   let ym = y instanceof Array ? new Matrix(y) : null;

   // <x|y>
   if (xm && xm.isBra && ym && ym.isKet) {    
      return xm.bracket(ym);
   } 
   // x>|y>
   if (xm && xm.isKet && ym && ym.isKet) {    
      return xm.kronecker(ym).arr;
   }   
   // <x|A , A|y>
   if (xm && ym) {
      return xm.mul(ym).arr;
   }
   // <x|c
   if (xm && y instanceof Complex) {
      return xm.mul(y).arr;
   }
   // c|y> 
   if (x instanceof Complex && ym) {
      return ym.mul(x).arr;
   }    
   error();  
}

// A # B - тензорное произведение 
function _kron(x, y) {
   return new Matrix(x).kronecker(new Matrix(y)).arr;
}

//========================= TEST ===============================

function complexArrayEquals(a1, a2) {
   if (a1 instanceof Complex) {
      return a1.equals(new Complex(a2)); 
   } 
   return a1.every((x, i) => complexArrayEquals(x, a2[i]));
}   

function assign(input, expected, values) {
   let lexems = lexical(input);
   let poland = toPoland(lexems);
   let res = evalPoland(poland, ops, values);
   return complexArrayEquals(res, expected);
}

console.log("evaluator tests");
console.log(assign("e1'", [[1,2]], {"e1": [[1],[2]]}))
console.log(assign("<e1", [[1,2]], {"e1": [[1],[2]]}))
console.log(assign("e1''", [[1,2]], {"e1": [[1,2]]}))
console.log(assign("e1'", new Complex(1, 2), {"e1": new Complex(1, -2)}))
console.log(assign("e1+e1", [[2,4]], {"e1": [[1,2]]}))
console.log(assign("e1-e1>", [[0,0]], {"e1": [[1,2]]}))
console.log(assign("e1>*e1>'", [[5]], {"e1": [[1,2]]}))
console.log(assign("A*e1>",  [[1],[2]], {"e1": [[1],[2]], "A": [[1,0], [0,1]]}))
console.log(assign("A|e1>",  [[1],[2]], {"e1": [[1],[2]], "A": [[1,0], [0,1]]}))
console.log(assign("c|e1>",  [[1],[2]], {"e1": [[1],[2]], "c": new Complex(1)}))
console.log(assign("<x|y>",  5, {"x": [[1], [2]], "y": [[1],[2]]}))
console.log(assign("<x|I|y>",  5, {"x": [[1], [2]], "y": [[1],[2]], "I": [[1,0], [0,1]] }))
console.log(assign("<u|l>",  0.7, {"u": [[1], [0]], "l": [[0.7],[0.7]] }))
