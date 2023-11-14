

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
function populateSelectBox(options, selectElementId) {
  const selectBox = document.getElementById(selectElementId);
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    selectBox.appendChild(optionElement);
  });
}

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
    <p>Type: ${pokemonData.types[0].type.name}</p>
    <p>HP: ${pokemonData.stats[0].base_stat}</p>
    <p>Attack: ${pokemonData.stats[1].base_stat}</p>
    <p>Defense: ${pokemonData.stats[2].base_stat}</p>
    <p>Speed: ${pokemonData.stats[5].base_stat}</p>
    <span class="line"></span>
  `;
}

// Randomly select a Pokémon for the CPU
function selectRandomPokemon() {
  const randomIndex = Math.floor(Math.random() * pokemons.length);
  return pokemons[randomIndex];
}

// Event listener for Pokémon selection
document.getElementById('select-pokemon').addEventListener('click', async () => {
  const playerPokemon = document.getElementById('player-pokemon').value;
  const pokemonData = await fetchPokemonData(playerPokemon);
  displayPokemonInfo(pokemonData, 'player-info');

  const cpuPokemon = selectRandomPokemon();
  const cpuPokemonData = await fetchPokemonData(cpuPokemon);
  displayPokemonInfo(cpuPokemonData, 'cpu-info');
});

// Populate the select box when the window loads
window.onload = () => {
  populateSelectBox(pokemons, 'player-pokemon');
};

// Function calculate the damage
function calculate_damage(attacker, defender) {
  const attack = attacker.stats[1].base_stat;
  const a_speed = attacker["speed"];
  const defense = defender["defense"];
  const d_speed = defender["speed"];
  //Apply a random damage modifier between 0.85 and 1.0
  const modifier = Math.random() * (1 - 0.75) + 0.75;
  const damage = (attack*a_speed*0.02-defense*d_speed*0.01) * modifier
  if (damege >=0) {
    return Math.round(damage)
  } else {
    return 0
  }
}

// Function to start the battle
async function startBattle() {
  const playerPokemonName = document.getElementById('player-pokemon').value;
  const playerPokemonData = await fetchPokemonData(playerPokemonName);
  const cpuPokemonName = selectRandomPokemon();
  const cpuPokemonData = await fetchPokemonData(cpuPokemonName);

  let playerHP = playerPokemonData.stats[0].base_stat;
  let cpuHP = cpuPokemonData.stats[0].base_stat;

  const battleLog = document.getElementById('battle-log');
  battleLog.innerHTML = ''; // Clear previous logs

  let round = 1;
  let playerTurn = Math.random() < 0.5;

  while (playerHP > 0 && cpuHP > 0) {
      let playerDamage = 0, cpuDamage = 0;

      if (playerTurn) {
          playerDamage = calculate_damage(playerPokemonData.stats, cpuPokemonData.stats);
          cpuHP -= playerDamage;
          battleLog.innerHTML += `<p>Round ${round}: Player attacks and inflicts ${playerDamage} damage.</p>`;
      } else {
          cpuDamage = calculate_damage(cpuPokemonData.stats, playerPokemonData.stats);
          playerHP -= cpuDamage;
          battleLog.innerHTML += `<p>Round ${round}: CPU attacks and inflicts ${cpuDamage} damage.</p>`;
      }

      if (playerHP <= 0 || cpuHP <= 0) break; // Check if the battle ends

      // Switch turns
      playerTurn = !playerTurn;
      round++;
  }

  const winner = playerHP > cpuHP ? 'Player' : 'CPU';
  battleLog.innerHTML += `<p><strong>${winner} wins the battle!</strong></p>`;
}

// Event listener for starting the battle
document.getElementById('start-battle').addEventListener('click', startBattle);
