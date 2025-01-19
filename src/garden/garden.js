/**
document.addEventListener('DOMContentLoaded', () => {
    const garden = document.getElementById('garden');
    const completeSessionBtn = document.getElementById('complete-session-btn');
    const totalTiles = 25; // 5x5 grid
    let plantCount = 0;

    // Initialize garden with empty tiles
    function initializeGarden() {
        for (let i = 0; i < totalTiles; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            garden.appendChild(tile);
        }
    }

    // Add a plant to the garden
    function addPlant() {
        if (plantCount < totalTiles) {
            const tiles = document.querySelectorAll('.tile');
            const nextTile = tiles[plantCount];
            const plant = document.createElement('div');
            plant.classList.add('plant');
            nextTile.appendChild(plant);
            plantCount++;
            nextTile.style.paddingBottom = '100%';
        } else {
            alert('Your garden is full!');
        }
    }

    

    // Button click event
    completeSessionBtn.addEventListener('click', () => {
        addPlant();
    });

    // Initialize the garden on page load
    initializeGarden();
});
**/

// Render plants in the garden
/**
function renderGarden() {
    gardenElement.innerHTML = ''; // Clear existing plants
    gameManager.plants.forEach((plant) => {
      const plantElement = document.createElement('div');
      plantElement.classList.add('plant');
      plantElement.textContent = `🌱 ${plant.species}`;
      gardenElement.appendChild(plantElement);
    });
  }
  
  // Re-render garden when a new plant is added
  document.addEventListener('newPlantAdded', () => {
    renderGarden();
  });
  
  // Initial render on page load
  renderGarden();
**/