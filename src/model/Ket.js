let Complex = require('complex.js');


// Нормированный вектор состояния (кет)
class Ket 
{
   constructor(...arr) {
      arr = arr.map(x => new Complex(x));
      this.arr = arr; 
      this.normalize();
   }

   add(other) {
      let arr = this.arr.map((x, i) => x.add(other.arr[i]));
      return new Ket(...arr);
   }

   mul(k) {
      let arr = this.arr.map((x) => x.mul(k));
      return new Ket(...arr);
   }


   // <t|o> - скалярное произведение - комплексное число
   // с превращением this из кет в бра 
   scalar(other) {
      let sum = this.arr.reduce(
         (a, x, i) => a.add(other.arr[i].mul(x.conjugate())), new Complex());
      return sum
   }

   // |t>|o> - тензорное произведение (Кронекера)
   //
   kronecker(other) {
      let res = []
      for (let x of this.arr) {
         for (let y of other.arr) {
            res.push(x.mul(y));
         }
      }
      return new Ket(...res);
   }

   // |t><o| - тензорное произведение (внешнее)
   //
   tensorOuter(other) {
      let matr = []
      for (let t of this.arr) {
         let row = [];
         for (let o of other.arr) {
            row.push(t.mul(o.conjugate()));
         }
         matr.push(row)
      }
      return matr;
   }


   get norma() {
      return this.scalar(this).sqrt();
   }


   normalize() {
      let n = this.norma;
      this.arr = this.arr.map(x => x.div(n));
   }

}

// ================== TESTS =======================================

function complexArrayEquals(a1, a2) {
   if (a1 instanceof Complex) {
      return a1.equals(new Complex(a2)); 
   } 
   return a1.every((x, i) => complexArrayEquals(x, a2[i]));
}   


function assert(a1, a2) {
   return console.log(complexArrayEquals(a1, a2));
}


let a = new Ket(1, 1);
let b = new Ket(1, "i");

// scalar
assert(a.scalar(b), "0.5 + 0.5i");  
// kronecker
assert(a.kronecker(b).arr, [0.5,"0.5i",0.5,"0.5i"]);
// tensorOuter
assert(a.tensorOuter(b), [[0.5, "-0.5i"], [0.5, "-0.5i"]]);




// 
o = new Ket(0, 1)           // 100% se
e1 = new Ket(1, 0);         // e1  вниз
e2 = new Ket(0, 1);         // e2  вверх
let k1 = e1.scalar();
let k2 = o.scalar(e2);
let psi = e1.mul(0.707).add(e2.mul(0.707));   // psi = k1|e1> + k2|e2>
// <
let p = (o.scalar(psi).abs()**2);

console.log(p);


