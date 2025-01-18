/**
 * Represents a plant in the zen garden.
 * @param species (String): The type of plant
 * @param min_growth (number, ideally between 0 and 10): The smallest amount the plant can grow in one growth tick.
 * @param max_growth (number, ideally between 0 and 10): The largest amount the plant can grow in one growth tick.
 * @param max_age (number, ideally between 5 and 1000): The point at which the plant reaches its most mature state and stops aging.
 * @param yield_chance (decimal between 0 and 1): The chance for the plant to return its age in money each time it grows.
 */
export class Plant{
    constructor(species, min_growth, max_growth, max_age, yield_chance) {
        this.species = species; // Species of plant
        this.min_growth = min_growth; // Minimum amount grown per tick
        this.max_growth = max_growth; // Maximum amount grown per tick
        this.max_age = max_age;   // Maximum age of plant
        this.age = 0;   // Current age of plant
        this.growthStage = 0;   // Current growth stage of plant (Determined from age)
        this.yield_chance = yield_chance; // Chance to yield money.
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
        let yield_val = 0;
        if ((Math.random() + this.yield_chance >= 1)) {
            yield_val = this.age;
        }
        
        if (debug === true) {
            const species_string = `Species: ${this.species}`
            const age_string = `| Age: ${this.age}/${this.max_age} (+${growth})`;
            const yield_string = `| Yield: +${yield_val}`;
            console.log(species_string.padEnd(24,' ') + age_string.padEnd(20, ' ') + yield_string)
        }

        return yield_val;
    }

    get plantYield() {
        return this.age;
    }
}