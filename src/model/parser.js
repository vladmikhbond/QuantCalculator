const ERMIT="'", NORM="~", BRA="<", PROB="^", MUL="*", KRON="#", ADD="+", SUB="-", DIRAK="|"  ;
const OPERATORS = "'~<^*#+-|";
const UNARY = "'~<^";
const BINARY = "*#+-|";

class Lex {
    constructor(k, v) {
        this.k = k;   // u`nary b`inary n`ame, c`omplex, '(', ')'
        this.v = v;
    }

    get isOperatorOrBracked() {
        return "ub()".includes(this.k)
    }

    get isCloseBracked() {
        return this.k == ')';
    }

    get isUnaryOp() {
        return this.k == 'u';
    }
    
    get isBinaryOp() {
        return this.k == 'b';
    }
}


// В именах не исп букву 'i'
// Комп числа писать в скобках (1i) (2+3i), перед i всегда число
//
function lexical (inputStr) {
   // remove spaces
   let str = [...inputStr].filter(c => c != ' ').join(''); 

   const regName = /[A-Za-hj-zα-ω_][A-Za-hj-zα-ω_\d]*/g;    
   let matches1 = [...regName[Symbol.matchAll](str)];
   str = str.replace(regName, 'n');

   const regComplex = /([\+-]?[\d]+(\.)?[\d]*)(([\+-]([\d]+\.)?[\d]*)?i)?/g;
   let matches2 = [...regComplex[Symbol.matchAll](str)];
   str = str.replace(regComplex, 'c');
   
   let result = [], i1 = 0, i2 = 0; 
   for (let c of str) {
      if (UNARY.includes(c)) 
         result.push(new Lex('u', c));
      else if (BINARY.includes(c)) 
         result.push(new Lex('b', c));   
      else if (c == 'n') 
         result.push(new Lex('n', matches1[i1++][0]));  
      else if (c == 'c') 
         result.push(new Lex('c', matches2[i2++][0]));
      else if (c == '(' || c == ')') 
         result.push(new Lex(c, c));         
   } 
   return result;
}

// toPoland:: [Lex] -> [Lex]
//
function toPoland(input) 
{   
   let output = [], stack = [];
   for (let lex of input) {
       
       if (lex.isOperatorOrBracked) 
       {
           let p = getPriority(lex.v);
           if (lex.isCloseBracked) 
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
   return getPriority(stack[stack.length - 1].v);
}

//===================== TEST ================================
function assert(input, expected ) {
   let answer = lexical(input);
   answer = toPoland(answer).map(l => l.v).join('');

   return answer == expected;
}
console.log("parser tests");
console.log(assert("<a1+(2+3i)|a2-(3+4i)>", "a1<2+3i+a23+4i-|"));
console.log(assert("<a1+b1|a2+b2>", "a1<b1+a2b2+|"));
console.log(assert("<(a+b)|(c+d)>", "ab+<cd+|"));
console.log(assert("(<a)+b|c+d>", "a<b+cd+|"));
console.log(assert("<a|b|c>", "a<b|c|"));
console.log(assert("<a'#b|c>", "a<'b#c|"));
console.log(assert("a>#<b", "ab<#"));
console.log(assert("a>#b>", "ab#"));



