// Manages the logic for the zen garden. This includ
import { Plant } from './plant.js';

class GameManager {
    
    constructor(plant_pots = 3, plants = [], money = [], xp = 0){
        this.plant_pots = plant_pots;
        this.plants = plants;
        this.money = money;
        this._xp = xp;
    }

    // Adds a new plant to the game manager.
    newPlant(new_plant) {
        if (this.plants.length < this.plant_pots){
            this.plants.push(new_plant);
        } else {
            console.log("You have no more available plant pots! You currently have " + this.plant_pots + ".");
        }
    }

    // Occurs every X seconds that the pomodoro runs. Grows plants and gives XP.
    gameTick() {
        for (let plant of this.plants) {
            this.money += plant.grow(null, true);
        }
        console.log("Money: $" + this.money);
        this.setXP = this._xp + 10;
        console.log("XP: " + this._xp);
        
        console.log();
        
    }

    // Getter for XP
    get getXP() {
        return this._xp;
    }

    // Setter for XP
    set setXP(value) {
        this._xp = value;

        // Emit a custom event when XP changes
        const event = new CustomEvent('xpChanged', { detail: { xp: this._xp } });
        document.dispatchEvent(event); // Notify listeners
    }
} 

export { GameManager };