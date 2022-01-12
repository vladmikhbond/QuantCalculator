class Equotion {
   constructor(idx, lvalue, rvalue, dict) {
     this.idx = idx;
     this.left = lvalue;
     this.right = rvalue;
     try {
       this.value = evalExpr(this.right, dict);
       dict[this.left] = this.value;
     } catch (error) {
       this.error = error;
     }  
   }
   
  }
  

// evalExpr:: string -> dict -> (Array Complex | Complex)
//
function evalExpr(rvalue, dict) {
   let lexemas = lexical(rvalue); 
   if (lexemas.some(lex => lex.isName)) {
      let poland = toPoland(lexemas);
      return evalPoland(poland, ops, dict);
   } else {
      return evalConst(rvalue);
   }
}

// все числа пишутся без пробелов
// | 11 22 33    - кет вектор нормированный (начин. с |)   |0 1>
// < 11 22 32   - бра вектор нормированный (начин. с <)
// 11 22 33 / 44 55 66 - матрица (есть пробелы?)
// 11+22i - комп число (нет пробелов?)  
//
// evalConst:: string -> (Array Complex | Complex)
//
function evalConst(rvalue) {
   rvalue = rvalue.trim();
   switch(rvalue[0]) {
      case ">": case "|":  // ket
         rvalue = rvalue.slice(1).trim();
         let ket = rvalue.split(' ').filter(x => x.trim() != "");
         return new Matrix(ket.map(x => [x])).normalize().arr;
      case "<":            // bra
         rvalue = rvalue.slice(1).trim();
         let bra = rvalue.split(' ').filter(x => x.trim() != "");
         return new Matrix([bra]).normalize().arr;
      default:          
         if (rvalue.indexOf(' ') > 0) // matrix
         {
            let rows = rvalue.split("/").filter(r => r.trim());
            let v = rows.map(r => r.split(' ')
               .map(x => x.trim())
               .filter(x => x != "")
               .map(x => new Complex(x)));
            return v;
         } 
         else                         // complex      
         {
            return new Complex(rvalue);
         }          
   }  
}


function evalPoland(poland, ops, vals) 
{
   poland.forEach(lex => {
      if (lex.k == 'n') 
      {
         lex.v = vals[lex.v];
         if (!lex.v) 
             throw new Error("wrong poland expression V");
      } 
      else if (lex.k == 'c') 
      {
         lex.v = new Complex(lex.v);      
      }
   })

   const vStack = []; // в стеке только значения
   for (let lex of poland) {
      if (lex.isUnaryOp) 
      {
         let v = vStack.pop();
         if (!v) throw new Error("wrong poland expression 1 ")
         let unaryOp = ops[lex.v];
         vStack.push(unaryOp(v)); 
      } 
      else if (lex.isBinaryOp) 
      {
         let v2 = vStack.pop();
         let v1 = vStack.pop();
         if (!v1 || !v2) throw new Error("wrong poland expression 2")
         let binaryOp = ops[lex.v];
         vStack.push(binaryOp(v1, v2)); 
      }
      else {         
         vStack.push(lex.v);
      }
   }
   if (vStack.length != 1) 
      throw new Error("wrong poland expression 3") 

   return vStack[0];
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
   // c+c -> c
   if (x instanceof Complex && y instanceof Complex) {
      return x.add(y);
   }
   // c+a -> c
   if (x instanceof Complex && y instanceof Array) {
      return new Matrix(y).add(x).arr;
   }
   // a+c -> a
   if (x instanceof Array && y instanceof Complex) {
      return new Matrix(x).add(y).arr;
   }
   // a+a->a 
   if (x instanceof Array && y instanceof Array) {
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

function assign2(input, expected) {
   let res = evalConst(input);
   return complexArrayEquals(res, expected);
}

console.log("evaluator tests");

console.log(assign2("< 0 1 ", [[new Complex(0), new Complex(1)]]));
console.log(assign2("| 0 1 ", [[new Complex(0)], [new Complex(1)]]));
console.log(assign2("10 / 20 ", [[new Complex(10)], [new Complex(20)]]));
console.log(assign2("| 3 4 ", [[new Complex(0.6)], [new Complex(0.8)]]));

console.log(assign("x + (2i)", [[new Complex(1,2), new Complex(2,2)]], {"x": [[1,2]]}))
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
