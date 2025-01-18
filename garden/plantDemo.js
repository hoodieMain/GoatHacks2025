// A file for demoing any plant functionality.
import { Plant } from './plant.js';
import { tick, newPlant, gameTick, plants } from './gameManager.js';


let rose = new Plant("Rose", 1, 2, 10);
let oak = new Plant("Oak", 0, 10, 200);
let weed = new Plant("Weed", 1, 1, 3);


newPlant(new Plant("Rose", 1, 2, 10, 0.2));
newPlant(new Plant("Oak", 0, 10, 200, 0.1));
newPlant(new Plant("Weed", 1, 1, 3, 0));
newPlant(new Plant("Berry Bush", 3, 5, 20, 0.3));

let day = 1

setInterval(() => {
    console.log("(ctrl-c to exit)")
    console.log("Day: " + day)
    day++;
    gameTick();  // Update plant growth each tick
}, 2000);  // Run every second (adjust as needed)