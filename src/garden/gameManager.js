// Manages the logic for the zen garden. This includ
import { Plant } from './plant.js';

const plant_file = './src/garden/plant_list.json'; // The path to the .json file to pull plant data from

class GameManager {
    
    constructor(plant_pots = 3, plants = [], money = 0, xp = 0){
        this.plant_pots = plant_pots;
        this.plants = plants;
        this.money = money;
        this._xp = xp;
        this.plant_list = [];
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
        
        console.log("\n");
        
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
        
        // Check if XP threshold for a new plant is met
        if (this._xp >= 100) {
            this._xp -= 100; // Deduct 100 XP
            const newPlant = this.randomPlant(); // Add the new plant
            const plantEvent = new CustomEvent('newPlantAdded', { detail: { plant: newPlant } });
            document.dispatchEvent(plantEvent); // Notify listeners about the new plant
        }
    }

    // Loads plant data from the plant file variable
    async loadPlantData() {
        try {
            const response = await fetch(plant_file); // Adjust path based on your project structure
            if (!response.ok) {
                throw new Error(`Failed to load plant data: ${response.statusText}`);
            }
            this.plant_list = await response.json();
            console.log('Plant data loaded:', this.plantList);
        } catch (error) {
            console.error('Error loading plant data:', error);
        }
    }

    // Adds a random plant to the user's garden
    randomPlant() {
        if (this.plants.length >= this.plant_pots) {
            console.log('No available pots for a new plant!');
            return;
        }

        if (this.plant_list.length === 0) {
            console.warn('No plants available to award!');
            return;
        }

        const random_index = Math.floor(Math.random() * this.plant_list.length);
        const plant_data = this.plant_list[random_index];
        const new_plant = new Plant(plant_data.species, plant_data.min_growth, plant_data.max_growth, plant_data.max_age, plant_data.yield_chance, plant_data.growth_stages);

        this.newPlant(new_plant);
        console.log(`You received a new plant: ${plant_data.species}`);
        return new_plant;
    }
}

export { GameManager };