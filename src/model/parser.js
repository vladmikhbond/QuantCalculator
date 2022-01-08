const ERMIT="'", NORM="~", BRA="<", PROB="!", MUL="*", KRON="#", ADD="+", SUB="-", DIRAK="|"  ;
const OPERATORS = [ERMIT, NORM, BRA, PROB, MUL, KRON, ADD, SUB, DIRAK].join('');


//
function lexical (str) {
   str = str + " stop";
   let regExForName = /[\wψ]+/g;
   let matches = [...regExForName[Symbol.matchAll](str)];
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
       else if (lex != '>') 
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
       case ERMIT: case NORM: case PROB: case BRA: return 5;
       case MUL: case KRON: return 4;
       case ADD: case SUB: return 3;
       case DIRAK: 2
       case ')':  return 1;
       case '(':  return 0;     
   }
}
function priorityInTop(stack) {
   if (stack.length == 0) 
       return -1;
   return getPriority(stack[stack.length - 1]);
}


//===================== TEST ================================
function assert(input, exp ) {
   let ans = lexical(input);
   ans = toPoland(ans).join('');
   console.log(ans == exp);
}
console.log("parser tests");
assert("<a+b|c+d>", "a<b+cd+|");
assert("<(a+b)|(c+d)>", "ab+<cd+|");
assert("(<a)+b|c+d>", "a<b+cd+|");
assert("<a|b|c>", "a<b|c|");
assert("<a'#b|c>", "a<'b#c|");

assert("a>#<b", "ab<#");
assert("a>#b>", "ab#");



