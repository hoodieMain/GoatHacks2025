let flower_pots = [];
import { GameManager } from '../garden/gameManager.js';

let gameManager;

class FlowerPot {
    constructor(plant = null, element, active = false) {
        this.plant = plant;
        this.element = element;
        this.active = active;
    }
}


// Load the gameManager state from localStorage
function loadGameManager() {
    const savedData = localStorage.getItem('gameManager');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        gameManager = Object.assign(new GameManager(), parsedData);
        console.log('GameManager loaded:', gameManager);
        gameManager.rehydratePlants(); // Ensure proper instantiation
    } else {
        console.error('No gameManager data found in localStorage!');
    }

    const savedPots = localStorage.getItem('plant_pots');
    if (savedPots) {
        const parsedPots = JSON.parse(savedPots);
        flower_pots = Object.assign([], parsedPots);
        console.log('Pots loaded:', flower_pots);
        rehydrateFlowerPots();
    } else {
        console.error('No plant_pots data found in localStorage!');
    }
}

function rehydrateFlowerPots() {
    const potElements = document.getElementsByClassName("plant-container");

    flower_pots = flower_pots.map((data, index) => 
        new FlowerPot(
            data.plant,
            potElements[index] || null, // Dynamically match DOM elements
            data.active
        )
    );

    console.log('Rehydrated flower pots:', flower_pots);
}

// Call this function when gardenvisuals.html loads
loadGameManager();


// Write a for loop that adds each element in the "plant-container" class to the flower_pots array.
for (let pot of document.getElementsByClassName("plant-container")) {
    flower_pots.push(new FlowerPot(null, pot, false));
}

for (let i = 0; i < gameManager.plant_pots; i++) {
    flower_pots[i].active = true;
}

function saveGameManager() {
    localStorage.setItem('gameManager', JSON.stringify(gameManager));
    localStorage.setItem('plant_pots', JSON.stringify(flower_pots));
}

document.getElementById('go-home').addEventListener('click', () => {
    saveGameManager();
    window.location.href = '../../index.html';
  });

function renderGarden(){

    for (let pot of flower_pots){
        if (pot.active){
            pot.element.style.background = "#7E9C66";

            if (pot.plant) {
                
                const growthStageIndex = Math.floor((pot.plant.age / pot.plant.max_age) * pot.plant.growth_stages.length);
                console.log(growthStageIndex);
                const imageUrl = pot.plant.growth_stages[growthStageIndex] || pot.plant.growth_stages[pot.plant.growth_stages.length - 1];
                const imgElement = pot.element.querySelector('.plant-image');
                imgElement.src = imageUrl;
            }

        } else {
            pot.element.style.background = "#747474";
            const imgElement = pot.element.querySelector('.plant-image');
            imgElement.src = ''; // Clear the image if inactive
        }
    }


}

window.buyPot = function(){
    console.log("Try and buy me!")
    for (let i = 0; i < flower_pots.length; i++){
        if (!flower_pots[i].active){
            let cost = 50 * i;
            if (gameManager.money >= cost){
                gameManager.money -= cost;
                gameManager.plant_pots++;
                flower_pots[i].active = true;
                if (i === 11) {
                    document.getElementById("planter-buy").innerHTML = "Sold out!";
                    break;
                }
                document.getElementById("planter-buy").innerHTML = "Buy Planter ($" + (cost + 50) + ")";
                break;
            }
        }
    }
    renderGarden();
}

window.buyPlant = function(){
    console.log("Try and buy me A plant!")

    if ((gameManager.getXP() >= 100) && (gameManager.plant_pots > gameManager.plants.length)){ {
        gameManager.setXP(gameManager.getXP() - 100);
        const newPlant = gameManager.randomPlant(); // Add the new plant
        const plantEvent = new CustomEvent('newPlantAdded', { detail: { plant: newPlant } });
        document.dispatchEvent(plantEvent); // Notify listeners about the new plant
        for (let i = 0; i < flower_pots.length; i++){
            if (flower_pots[i].active && flower_pots[i].plant === null){
                flower_pots[i].plant = newPlant;
                break;
            }
        }
    }}

    gameManager.rehydratePlants();
    renderGarden();
}

renderGarden();
console.log("All done!");