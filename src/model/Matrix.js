// [[1,2], [3,4]];   [[1,2]] - 1 row; [[1], [2]] - 1 column   
class Matrix 
{
   // arr - массив строк, содержащих комп числа
   constructor(arr) {
      let valid = arr.every(row => row.length == arr[0].length);
      if (!valid) throw Error("invalid matrix")
      this.rows = arr.length;
      this.cols = arr[0].length;
      this.arr = arr.map(a => a.map(x => new Complex(x)))
   }

   // умеет умножать и на матрицу, и на одно число
   mul(other) {
      if (typeof other == "number") 
         other = new Complex(other);
      if (other instanceof Complex) {
         let arr = this.arr.map(row => row.map(x => x.mul(other)));
         return new Matrix(arr);
      }

      if (this.cols != other.rows) throw Error("invalid matrices");
      let arr = [];
      for (let r = 0; r < this.rows; r++) {
         let row = [];
         for (let c = 0; c < other.cols; c++) {
            let sum = new Complex();
            for (let k = 0; k < this.cols; k++) {
                let mul = this.arr[r][k].mul(other.arr[k][c]);
                sum = sum.add(mul); 
            }
            row.push(sum);
         }
         arr.push(row);            
      }
      return new Matrix(arr);   
   }
   
   // умеет добавлять и матрицу, и одно число
   add(other) {
      if (typeof other == "number") 
         other = new Complex(other);
      if (other instanceof Complex) {
         let arr = this.arr.map(row => row.map(x => x.add(other)));
         return new Matrix(arr);
      }
      if (this.cols != other.cols || this.rows != other.rows) 
         throw Error("invalid matrices");
      let arr = [];
      for (let r = 0; r < this.rows; r++) {
         let row = [];
         for (let c = 0; c < other.cols; c++) {
            row.push(this.arr[r][c] + other.arr[r][c]);
         }
         arr.push(row);            
      }
      return new Matrix(arr);   
   }


   ermit() {
      let arr = [];
      for (let c = 0; c < this.cols; c++) {
         let row = [];
         for (let r = 0; r < this.rows; r++) {
            let con = this.arr[r][c].conjugate();
            row.push(con);
         }
         arr.push(row);   
      }
      return new Matrix(arr);
   }

   get isKet() {
      return this.arr.every(row => row.length == 1);
   }
   get isBra() {
      return this.arr.length == 1 && this.arr.every(row => row instanceof Array);
   }

   // this - bra, other - ket
   // <a|b>
   bracket(other) {
      if (!this.isBra || !other.isKet || this.arr[0].length != other.arr.length) 
          throw Error("invalid bracket operands");
      let arr = this.mul(other).arr; 
      return arr[0][0];  
   }


   
   // |a><b|- тензор

   // норма
   get norma() {
      let sum = this.arr.reduce((a, r) => a + r.reduce( 
         (b, x) => b + x.re**2 + x.im**2, 0
      ), 0);
      return Math.sqrt(sum);
   }

   normalize() {
      let n = this.norma;
      this.arr = this.arr.map(r => r.map(x => x.div(n)));
      return this;
   }

   kronecker(other) {
      let arr = [];
      for (let r1 of this.arr) for (let r2 of other.arr) {
         let row = [];
         for (let a of r1) for (let b of r2) {
            row.push(a.mul(b));
         }
         arr.push(row);
      }
      return new Matrix(arr);
   }

}

// ================== TESTS =======================================

// function complexArrayEquals(a1, a2) {
//    if (a1 instanceof Complex) {
//       return a1.equals(new Complex(a2)); 
//    } 
//    return a1.every((x, i) => complexArrayEquals(x, a2[i]));
// }     

// function assert(matrix, arr) {
//    return complexArrayEquals(matrix.arr, arr);
// }

// function assert2(comp, str) {
//    let c = new Complex(str);
//    return comp.equals(c);
// }

// console.log("Matrix tests");
// let m, m1, m2;
// m1 = new Matrix([["i", "i"], ["i", "i"]]);
// m2 = new Matrix([[1], [2]]);
// // mul
// m = m1.mul(m1);
// console.log(assert(m, [[-2,-2],[-2,-2]]));
// // mul
// m =  m1.mul(m2);
// console.log(assert(m, [["3i"],["3i"]]));
// // ermit
// m = m1.ermit();
// console.log(assert(m, [["-i", "-i"], ["-i", "-i"]]));
// // ermit
// m = m2.ermit();
// console.log(assert(m, [[1, 2]]));
// // bracket
// m1 = new Matrix([[1, 2]]);
// m2 = new Matrix([[3], [4]]);
// m = m1.bracket(m2);
// console.log(assert2(m, 11));
// // bracket
// m1 = new Matrix([["i", "i"]]);
// m2 = m1.ermit();
// m = m1.bracket(m2);
// console.log(assert2(m, 2));
// // norma
// m1 = new Matrix([[2, 1],[2, 4]]);
// m = m1.norma;
// console.log(m == 5);
// // normalize
// m1.normalize();
// console.log(assert(m1, [[0.4, 0.2], [0.4, 0.8]]));
// // kron
// m1 = new Matrix([[1,10],[100, 1]]);
// m2 = new Matrix([[1,2],[3, 4]]);
// let a = m1.kronecker(m2).arr;
// console.log(a[2][0]==100 && a[3][1]==400 && a[0][3]==20); 

// m1 = new Matrix([[1],[3]]);
// m2 = new Matrix([[10],[20]]);
// a = m1.kronecker(m2).arr;
// console.log(a[0][0]==10 && a[1][0]==20 && a[2][0]==30 && a[3][0]==60); 

// m2 = new Matrix([[10, 20]]);
// a = m1.kronecker(m2).arr;
// console.log(a[0][0]==10 && a[0][1]==20 && a[1][0]==30 && a[1][1]==60); 