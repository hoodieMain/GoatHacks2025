/**
 * Represents a plant in the zen garden.
 * @param species (String): The type of plant
 * @param min_growth (number, ideally between 0 and 10): The smallest amount the plant can grow in one growth tick.
 * @param max_growth (number, ideally between 0 and 10): The largest amount the plant can grow in one growth tick.
 * @param max_age (number, ideally between 5 and 1000): The point at which the plant reaches its most mature state and stops aging.
 * @param yield_chance (decimal between 0 and 1): The chance for the plant to return its age in money each time it grows.
 */
export class Plant{
    constructor(species, min_growth, max_growth, max_age, min_yield, max_yield, growth_stages, age = 0) {
        this.species = species; // Species of plant
        this.min_growth = min_growth; // Minimum amount grown per tick
        this.max_growth = max_growth; // Maximum amount grown per tick
        this.max_age = max_age;   // Maximum age of plant
        this.age = age;   // Current age of plant
        this.growthStage = 0;   // Current growth stage of plant (Determined from age)
        this.min_yield = min_yield; // Chance to yield money.
        this.max_yield = max_yield; // Chance to yield money.
        this.growth_stages = growth_stages; // Chance to yield money.
    }

    /**
     * Grows the plant by an random amount determined by its minimum or maximum growth rate. If a paramater is entered, grows the plant by that value instead.
     * @param age [number]: The amount the plant should grow. Optional.
     * @param debug [boolean]: If true, logs the plants species, growth, age, and max age.
     */
    grow(growth = null, debug = false) {
        // First, may randomly the age of the plant
        if (growth === null) {
            const rangeGrowth = this.max_growth - this.min_growth;
            growth = Math.round(Math.random(1) * rangeGrowth);
            growth += this.min_growth;
        }
        if (this.age + growth > this.max_age){
            growth = this.max_age - this.age
        }
        this.age += growth;

        // Then, may randomly return the growth value of the plant as money
            // Generate a random number within the min/max yield range
            const yieldRange = parseInt(this.max_yield) - parseInt(this.min_yield);
            const randomYield = Math.round(Math.random() * yieldRange) + this.min_yield;
            // Multiply the random yield by the plant's age
            const yield_val = Math.floor(randomYield * (this.age / this.max_age));
        if (debug === true) {
            const species_string = `Species: ${this.species}`
            const age_string = `| Age: ${this.age}/${this.max_age} (+${growth})`;
            const yield_string = `| Yield: +${yield_val}`;
            console.log(species_string.padEnd(24,' ') + age_string.padEnd(20, ' ') + yield_string)
        }

        return yield_val;
    }
    
    growthStageGet(){
        return Math.floor((this.age / this.max_age) * this.growth_stages.length);
    }
}