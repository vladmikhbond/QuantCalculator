const ERMIT="'", NORM="~", BRA="<", PROB="^", MUL="*", KRON="#", ADD="+", SUB="-", DIRAK="|"  ;
const OPERATORS = [ERMIT, NORM, BRA, PROB, MUL, KRON, ADD, SUB, DIRAK].join('');

//
function lexical (inputStr) {
   // remove spaces
   let str = [...inputStr].filter(c => c != ' ').join(''); 
   str.replace(/i/g, '\1');

   const regName = /[A-Za-hj-zα-ω_][A-Za-hj-zα-ω_\d]*/g;    
   let matches1 = [...regName[Symbol.matchAll](str)];
   str = str.replace(regName, 'n');

   const regComplex = /([\+-]?[\d]+(\.)?[\d]*)(([\+-]([\d]+\.)?[\d]*)?i)?/g;
   let matches2 = [...regComplex[Symbol.matchAll](str)];
   str = str.replace(regComplex, 'c');
   
   let result = [...str];
   if (matches1.length) {
        let i = 0;
        result = result.map(c => c == 'n' ? matches1[i++][0] : c);
    }
    if (matches2.length) {
        let j = 0;
        result = result.map(c => c == 'c' ? matches2[j++][0] : c);
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
       else if (lex == '>') {
           // do nothing
       } else 
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
function assert(input, expected ) {
   let answer = lexical(input);
   answer = toPoland(answer).join('');
   return answer == expected;
}
console.log("parser tests");
console.log(assert("<a1+(2+3i)|a2-(3+4i)>", "a1<2+3i+a23+4i+|"));
console.log(assert("<a1+b1|a2+b2>", "a1<b1+a2b2+|"));
console.log(assert("<(a+b)|(c+d)>", "ab+<cd+|"));
console.log(assert("(<a)+b|c+d>", "a<b+cd+|"));
console.log(assert("<a|b|c>", "a<b|c|"));
console.log(assert("<a'#b|c>", "a<'b#c|"));
console.log(assert("a>#<b", "ab<#"));
console.log(assert("a>#b>", "ab#"));



