// Manages the logic for the zen garden. This includ
import { Plant } from './plant.js';

const plant_file = './src/garden/plant_list.json'; // The path to the .json file to pull plant data from

class GameManager {
    
    constructor(plant_pots = 3, plants = [], money = 500, xp = 250){
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

    rehydratePlants() {
        this.plants = this.plants.map(data => 
            new Plant(
                data.species,
                data.min_growth,
                data.max_growth,
                data.max_age,
                data.min_yield,
                data.max_yield,
                data.growth_stages,
                data.age
            )
        );
        console.log('Rehydrated plants:', this.plants);
    }

    // Occurs every X seconds that the pomodoro runs. Grows plants and gives XP.
    gameTick() {
        console.log('Plants array:', this.plants);

        for (let plant of this.plants) {
            console.log('Plant instance:', plant);
            console.log('Is plant an instance of Plant?', plant instanceof Plant);
            this.money += plant.grow(null, true);
        }
        console.log("Money: $" + this.money);
        this.setXP(this.getXP() + 10);
        console.log("XP: " + this._xp);
        
        console.log("\n");
        
    }

    // Getter for XP
    getXP() {
        return this._xp;
    }

    // Setter for XP
    setXP(value) {
        this._xp = value;

        // Emit a custom event when XP changes
        const event = new CustomEvent('xpChanged', { detail: { xp: this._xp } });
        document.dispatchEvent(event); // Notify listeners
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
        const new_plant = new Plant(
            
            plant_data.species, 
            plant_data.min_growth, 
            plant_data.max_growth, 
            plant_data.max_age, 
            plant_data.min_yield,
            plant_data.max_yield, 
            plant_data.growth_stages);

        this.newPlant(new_plant);
        console.log(`You received a new plant: ${plant_data.species}`);
        return new_plant;
    }
}

export { GameManager };