// Manages the logic for the zen garden. This includ
import { Plant } from './plant.js';

let plant_pots = 3;
let plants = [];
let money = 0;

function tick() {

}

function newPlant(new_plant) {
    if (plants.length < plant_pots){
        plants.push(new_plant);
    } else {
        console.log("You have no more available plant pots! You currently have " + plant_pots + ".");
    }
}

function newPot() {
    this.plant_pots += 1;
}

function gameTick() {
    for (let plant of plants) {
        money += plant.grow(null, true);
    }
    console.log("Money: $" + money);
    console.log();

}

export { tick, newPlant, gameTick, plants }; 