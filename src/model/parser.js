// const Complex = require('complex.js');
// const Matrix = require("./Matrix.js");

const ERMIT="^", CONJ="'", MUL="*", DIRAK="|", ADD="+", SUB="-", PROB="!";
const OPERATORS = [ERMIT, CONJ, MUL, DIRAK, ADD, SUB, PROB].join('');

// знаки > и < не должны отделяться пробелом от имени
// x> всегда означает вектор-столбец,  <x всегда означает вектор-строку,    <x = x>^
//
function lexical (str) {
   str = str + " stop";
   let regEx = /<?([\wψ])+>?/g;
   let matches = [...regEx[Symbol.matchAll](str)];
   let gap0 = str.slice(0, matches[0].index);
   let result = gap0.split('').filter(c => c != ' ');
   for (let i = 0; i < matches.length - 1; i++) {
      let m = matches[i], n = matches[i+1];
      let start = m.index + m[0].length;

      let gap = str.slice(start, n.index);
      let cs = gap.split('').filter(c => c != ' ');
      
      result.push(m[0]);
      result.push(...cs);
   }
   return result;
}

// [string] => [string]
//
function toPoland(input) {
   const isBracketOrOperator = x => (OPERATORS+"()").indexOf(x) > -1;
   
   let output = [], stack = [];
   for (let lex of input) {
       let p = getPriority(lex);
       if (isBracketOrOperator(lex)) 
       {
           if (lex == ')') 
           {
               while (priorityInTop(stack) != 0 ) {
                   output.push(stack.pop());
               }
               stack.pop();  // remove '('
           } 
           else if (p == 0 || p > priorityInTop(stack)) 
           {
              stack.push(lex);
           } 
           else 
           {
               while (priorityInTop(stack) >= p ) {
                   output.push(stack.pop());
               }
               stack.push(lex);
           }          
       } 
       else 
       {
          output.push(lex);
       }       
   }
   //
   while(stack.length) {
       output.push(stack.pop());
   }
   return output;
}

function getPriority(op) {
   switch(op) {
       case ERMIT: case CONJ: case PROB: return 5;
       case MUL: case DIRAK: return 4;
       case ADD: case SUB: return 3;
       case ')':  return 1;
       case '(':  return 0;     
   }
}
function priorityInTop(stack) {
   if (stack.length == 0) 
       return -1;
   return getPriority(stack[stack.length - 1]);
}


function evalPoland(poland, ops, vals) {
   const stack = [];
   for (let lex of poland) {
      switch(lex) {
         case ERMIT: case CONJ: case PROB:
         let c = stack.pop();
         if (!c) throw new Error("wrong poland expression 1 ")
         let op1 = ops[lex];
         stack.push(op1(c)); 
         break;

         case ADD: case SUB:case MUL: case DIRAK: 
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
//=======================================================


const ops = {
   [CONJ]: _conj,
   [ERMIT]: _ermit,
   [ADD]: _add,
   [SUB]: _sub,
   [MUL]: _mul,
   [DIRAK]: _dirak,
   [PROB]: _prob,
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

// <x|y> - скалярное произведение 
// (|)x>|y> - тензорное произведение 

// <x|n , n|y>  - умножение вектора на число n
// <x|a , A|y> - умножение матриц x*A или A*y
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
