let selectedPokemonName = null;
let cpuPokemonName = null


// Constants
const pokeUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemons = [
  "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon",
  "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie",
  "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill",
  "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate",
  "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu",
  "Raichu", "Sandshrew", "Sandslash", "Nidorina",
  "Nidoqueen", "Nidorino", "Nidoking", "Clefairy",
  "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff"
];

// Function to populate the select box with options
document.getElementById('start-battle').disabled = true;

function populateSelectBox(options, selectElementId) {
  const selectBox = document.getElementById(selectElementId);
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    selectBox.appendChild(optionElement);
  });
  document.getElementById('start-battle').disabled = false;
  document.getElementById('select-pokemon').addEventListener('click', async () => {
    selectedPokemonName = document.getElementById('player-pokemon').value;
    const pokemonData = await fetchPokemonData(selectedPokemonName);
    displayPokemonInfo(pokemonData, 'player-info');

    cpuPokemonName = selectRandomPokemon();
    const cpuPokemonData = await fetchPokemonData(cpuPokemonName);
    displayPokemonInfo(cpuPokemonData, 'cpu-info');
  });
};

// Fetch Pokémon data from the API
async function fetchPokemonData(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Display Pokémon information
function displayPokemonInfo(pokemonData, elementId) {
  const infoSection = document.getElementById(elementId);
  let headerText = '';
  if (elementId === 'cpu-info') {
    headerText = "CPU's Pokemon";
  } else if (elementId === 'player-info') {
    headerText = "Player's Pokemon";
  }
  infoSection.innerHTML = `
    <h1>${headerText}</h1>
    <h3>${pokemonData.name.toUpperCase()}</h3>
    <img src="${pokemonData.sprites.other.home.front_default}" alt="${pokemonData.name}">
    <p class="display">Type: ${pokemonData.types[0].type.name}</p>
    <p class="display">HP: ${pokemonData.stats[0].base_stat}</p>
    <p class="display">Attack: ${pokemonData.stats[1].base_stat}</p>
    <p class="display">Defense: ${pokemonData.stats[2].base_stat}</p>
    <p class="display">Speed: ${pokemonData.stats[5].base_stat}</p>
    <span class="line"></span>
  `;
}

// Randomly select a Pokémon for the CPU
function selectRandomPokemon() {
  const randomIndex = Math.floor(Math.random() * pokemons.length);
  return pokemons[randomIndex];
}

// Function calculate the damage
function calculate_damage(attacker, defender) {
  const attack = attacker.stats[1].base_stat;
  const a_speed = attacker.stats[5].base_stat;
  const defense = defender.stats[2].base_stat;
  const d_speed = defender.stats[5].base_stat;
  const modifier = Math.random() * (1 - 0.75) + 0.75;
  const damage = (attack*a_speed*0.02-defense*d_speed*0.01) * modifier
  return damage>0? Math.round(damage) : 0;
}

// Function to start the battle
async function startBattle() {
  const playerPokemonData = await fetchPokemonData(selectedPokemonName);
  const cpuPokemonData = await fetchPokemonData(cpuPokemonName);

  let playerHP = playerPokemonData.stats[0].base_stat;
  let cpuHP = cpuPokemonData.stats[0].base_stat;

  const battleLog = document.getElementById('battle-log');
  battleLog.innerHTML = '';

  let round = 1;
  let playerTurn = Math.random() < 0.5;

  while (playerHP > 0 && cpuHP > 0) {
      let playerDamage = 0, cpuDamage = 0;

      if (playerTurn) {
          playerDamage = calculate_damage(playerPokemonData, cpuPokemonData);
          cpuHP -= playerDamage;
          battleLog.innerHTML += `<p>Round ${round}: It's ${selectedPokemonName}'s turn to attack. <br>Player's ${selectedPokemonName} attacks and inflicts ${playerDamage} damage. CPU's ${cpuPokemonName} remains ${cpuHP} HP.</p>`;
      } else {
          cpuDamage = calculate_damage(cpuPokemonData, playerPokemonData);
          playerHP -= cpuDamage;
          battleLog.innerHTML += `<p>Round ${round}: It's ${cpuPokemonName}'s turn to attack. <br>CPU's ${cpuPokemonName} attacks and inflicts ${cpuDamage} damage. Player's ${selectedPokemonName} remains ${playerHP} HP.</p>`;
      }

      if (playerHP <= 0 || cpuHP <= 0) break;

      // Switch turns
      playerTurn = !playerTurn;
      round++;
  }

  const winner = playerHP > cpuHP ? 'Player' : 'CPU';
  battleLog.innerHTML += `<p><strong>${winner} wins the battle!</strong></p>`;
}

// function resetGame() {
//   const battleLog = document.getElementById('battle-log');
//   if (battleLog) {
//     battleLog.innerHTML = '';
//   }

//   if (selectedPokemonName) {
//     const pokeInfo = document.getElementById('poke-info')
//     pokeInfo.innerHTML = "
//     <h2>Player\'s Pokemon</h2>
//     <div id=\'player-section\'>
//       <h3>Select Your Pokemon</h3>
//       <select id=\'player-pokemon\'>

//       </select>
//       <button id=\'select-pokemon\'>Choose Pokemon</button>
//     </div>
//   </div>
//   <div id=\'cpu-info\'>
//     <h2>CPU\'s Pokemon</h2>
//     <img src=\'assets/question_mark.png\' alt=\'Pokemon with question mark\' width=\'484\' height=\'413\'>
//   </div>"
// }

// Populate the select box when the window loads
window.onload = () => {
  populateSelectBox(pokemons, 'player-pokemon');
};

// Event listener for starting the battle
document.getElementById('start-battle').addEventListener('click', startBattle);

// Event listener for resetting the game
// document.getElementById('reset-game').addEventListener('click', resetGame);
