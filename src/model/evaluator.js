
function evalExpr(expr, values) {
   let lexems = lexical(expr);
   let poland = toPoland(lexems);
   let result = evalPoland(poland, ops, values);
   return result;
}
     
const ops = {
   [CONJ]: _conj,
   [ERMIT]: _ermit,
   [ADD]: _add,
   [SUB]: _sub,
   [MUL]: _mul,
   [DIRAK]: _dirak,
   [PROB]: _prob,
   [KRON]: _kron,
}

function _conj(com) {
   return com.conjugate();
}

function _ermit(m) {
   return new Matrix(m).ermit().arr;
}

function _prob(x) {
   if (x instanceof Complex)
      return x.abs()**2;
   if (x instanceof Array) {
      return new Matrix(x).normalize().norma;
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


// (|)x>|y> - тензорное произведение 
// <x|y> - скалярное произведение 
// <x|n , n|y>  - умножение вектора на число n
// <x|A , A|y> - умножение матриц x*A или A*y
//
function _dirak(x, y) {
   const error = () => console.error(x, y);

   let xm = x instanceof Array ? new Matrix(x) : null;
   let ym = y instanceof Array ? new Matrix(y) : null;

   if (xm && xm.isBra) { 
      if (ym && ym.isKet) {
         // <x|y>
         return xm.bracket(ym);
      }   
      if (ym) {
         // <x|a
         return xm.mul(ym).arr;
      }
      if (y instanceof Complex) {
         // <x|n
         return xm.mul(y).arr;
      }
      error();
   }
   if (xm && xm.isKet) { 
      if (ym && ym.isKet) {
         // x>|y>
         return xm.kronКetКet(ym).arr;
      } 
   }
   if (xm) {
      if (ym && ym.isKet) {
         // A|y>
         return xm.mul(ym).arr;
      } 
      error();
   }
   if (x instanceof Complex) {
      if (ym && ym.isKet) {
         // n|y>
         return ym.mul(x).arr;
      }
      error();
   }
   error();  
}

// A # B 
function _kron(x, y) {
   return new Matrix(x).kron(new Matrix(y)).arr;
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
   console.log(complexArrayEquals(res, expected));
}
// все числа комплексные
const vals = {
   "c1": new Complex(1),
   "c2": new Complex(2),
   "e1>": [[1],[2]],
   "e2>": [[2],[3]],
   "x": [["i","2i","3i"]]
}

// assign("e1>^", [[1,2]], {"e1>": [[1],[2]]});
// assign("e1>^^", [[1,2]], {"e1>": [[1,2]]});
// assign("e1'", new Complex(1, 2), {"e1": new Complex(1, -2)});

// assign("e1>+e1>", [[2,4]], {"e1>": [[1,2]]});
// assign("e1>-e1>", [[0,0]], {"e1>": [[1,2]]});
// assign("e1>*e1>^", [[5]], {"e1>": [[1,2]]});
// assign("A*e1>",  [[1],[2]], {"e1>": [[1],[2]], "A": [[1,0], [0,1]]});
// assign("A|e1>",  [[1],[2]], {"e1>": [[1],[2]], "A": [[1,0], [0,1]]});
// assign("n|e1>",  [[1],[2]], {"e1>": [[1],[2]], "n": new Complex(1)});
// assign("<x|y>",  5, {"<x": [[1, 2]], "y>": [[1],[2]]});
// assign("<x|I|y>",  5, {"<x": [[1, 2]], "y>": [[1],[2]], "I": [[1,0], [0,1]] });

assign("<u|l>",  0.7, {"<u": [[1, 0]], "l>": [[0.7],[0.7]] });
