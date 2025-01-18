/**
 * Represents a plant in the zen garden.
 * @param species (String): The type of plant
 * @param minGrowth (number, ideally between 0 and 10): The smallest amount the plant can grow in one growth tick.
 * @param maxGrowth (number, ideally between 0 and 10): The largest amount the plant can grow in one growth tick.
 * @param maxAge (number, ideally between 5 and 1000): The point at which the plant reaches its most mature state and stops aging.
 */
export class Plant{
    constructor(species, minGrowth, maxGrowth, maxAge) {
        this.species = species; // Species of plant
        this.minGrowth = minGrowth; // Minimum amount grown per tick
        this.maxGrowth = maxGrowth; // Maximum amount grown per tick
        this.maxAge = maxAge;   // Maximum age of plant
        this.age = 0;   // Current age of plant
        this.growthStage = 0;   // Current growth stage of plant (Determined from age)
    }

    /**
     * Returns the age of the plant
     */
    /*
    get age() {
        return this.age();
    }
    */

    /**
     * Grows the plant by an random amount determined by its minimum or maximum growth rate. If a paramater is entered, grows the plant by that value instead.
     * @param age [number]: The amount the plant should grow. Optional.
     */
    grow(growth = null) {
        if (growth === null) {
            const rangeGrowth = this.maxGrowth - this.minGrowth;
            growth = Math.round(Math.random(1) * rangeGrowth);
            growth += this.minGrowth;
        }
        if (this.age + growth > this.maxAge){
            growth = this.maxAge - this.age
        }
        this.age += growth;
        return growth;
    }
}

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