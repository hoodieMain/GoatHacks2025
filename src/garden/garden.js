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

console.log(flower_pots);

// Load the gameManager state from localStorage
function loadGameManager() {
    const savedData = localStorage.getItem('gameManager');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log(parsedData);
        gameManager = Object.assign(new GameManager(), parsedData);
        console.log('CHECK HEERE CHECKE HERE:', gameManager);

        console.log('GameManager loaded:', gameManager);
        console.log('gameManager', JSON.stringify(gameManager));
        gameManager.rehydratePlants(); // Ensure proper instantiation
    } else {
        console.error('No gameManager data found in localStorage!');
        gameManager = new GameManager();
    }

    const savedPots = localStorage.getItem('plant_pots');
    if (savedPots) {
        const parsedPots = JSON.parse(savedPots);
        flower_pots = Object.assign([], parsedPots);
        console.log('Pots loaded:', flower_pots);
        rehydrateFlowerPots();
    } else {
        console.error('No plant_pots data found in localStorage!');
        setUpFlowerPots();
        console.log('New Pots Generated:', flower_pots);
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
document.addEventListener("DOMContentLoaded", () => {
    loadGameManager(); // Load game state
    console.log("HEYEOESIHISHUFI SDNKDSJnf laksn")
    renderGarden(); // Render the garden visuals
    console.log("All done!");
    console.log()
console.log(gameManager.plant_pots);
console.log(flower_pots);
console.log(gameManager.plants);
});


// Write a for loop that adds each element in the "plant-container" class to the flower_pots array.
function setUpFlowerPots(){
    for (let pot of document.getElementsByClassName("plant-container")) {
        flower_pots.push(new FlowerPot(null, pot, false));
    }
    
    for (let i = 0; i < gameManager.plant_pots; i++) {
        flower_pots[i].active = true;
    }
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

    console.log("DEBUGGING")
    debugStuff();
    for (let i = 0; i < flower_pots.length; i++){
        let pot = flower_pots[i];
        console.log("SKIBIDIBIDI" + i)
        if (pot.active){
            console.log("Yer active boi")
            pot.element.style.background = "#7E9C66";

            if (gameManager.plants.length > i && gameManager.plants[i] !== null) {
                
                let growthStageIndex = gameManager.plants[i].growthStageGet();
                console.log(growthStageIndex);
                const imageUrl = gameManager.plants[i].growth_stages[growthStageIndex] || gameManager.plants[i].growth_stages[gameManager.plants[i].growth_stages.length - 1];
                const imgElement = pot.element.querySelector('.plant-image');
                imgElement.src = imageUrl;
                console.log("yayoyayo")
                console.log(gameManager.plants);
                console.log(gameManager.plants[i]);
                console.log(gameManager.plants[i].age);
                console.log("yayoyayo")
            }

        } else {
            console.log("NOPE" + i)
            pot.element.style.background = "#747474";
            const imgElement = pot.element.querySelector('.plant-image');
            imgElement.src = ''; // Clear the image if inactive
        }
    }
    console.log("DEBUGGING")
    debugStuff();
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
                document.getElementById("planter-buy").innerHTML = "Buy Planter ($" + (cost + 50) + ")\nCurrent: $" + gameManager.money;
                break;
            }
        }
    }
    console.log("LETS GO YOU MADE IT TO THIS LINE!")
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

document.getElementById("reset-btn").addEventListener('click', () => {
    localStorage.clear();
    flower_pots = [];
    gameManager = new GameManager();
    document.getElementById("planter-buy").innerHTML = "Buy Planter ($150)";
    setUpFlowerPots();
    renderGarden();
  });


function debugStuff(){
    console.log(gameManager.plant_pots);
    console.log(flower_pots);
    console.log(gameManager.plants);
}
