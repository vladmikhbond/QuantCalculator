const ERMIT="^", CONJ="'", MUL="*", DIRAK="|", ADD="+", SUB="-", PROB="!", KRON="#";
const OPERATORS = [ERMIT, CONJ, MUL, DIRAK, ADD, SUB, PROB, KRON].join('');

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
       case MUL: case DIRAK: case KRON: return 4;
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
