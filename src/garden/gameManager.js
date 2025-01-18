// Manages the logic for the zen garden. This includ
import { Plant } from './plant.js';

class GameManager {
    
    constructor(plant_pots = 3, plants = [], money = []){
        this.plant_pots = 3;
        this.plants = [];
        this.money = 0;
    }

    newPlant(new_plant) {
        if (this.plants.length < this.plant_pots){
            this.plants.push(new_plant);
        } else {
            console.log("You have no more available plant pots! You currently have " + this.plant_pots + ".");
        }
    }

    gameTick() {
        for (let plant of this.plants) {
            this.money += plant.grow(null, true);
        }
        console.log("Money: $" + this.money);
        console.log();
    
    }
} 

export { GameManager };