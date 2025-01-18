// A file for demoing any plant functionality.
import { Plant } from './plant.js';

let rose = new Plant("Rose", 1, 2, 10);
let oak = new Plant("Oak", 0, 10, 200);
let weed = new Plant("Weed", 1, 1, 3);

console.log("Zero Growth");
console.log(rose);
console.log(oak);
console.log(weed);

for (let i = 0; i < 10; i++) {
    console.log("Day " + (i + 1));
    console.log("Rose: +" + rose.grow() + " (" + rose.age + " total)");
    console.log("Oak: +" + oak.grow() + " (" + oak.age + " total)");
    console.log("Weed: +" + weed.grow() + " (" + weed.age + " total)");
    console.log();
}