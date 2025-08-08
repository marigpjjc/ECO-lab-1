const content = document.getElementById("statesContent");
let formContainer = document.getElementById("formContainer");

document.getElementById("btnAnime").addEventListener("click", Anime);
document.getElementById("btnCountries").addEventListener("click", Countries);
document.getElementById("btnPokemon").addEventListener("click", Pokemon);
document.getElementById("btnFood").addEventListener("click", showFoods);

function clearFormContainer() {
    formContainer.innerHTML = "";
    content.innerHTML = "";
}

function showLoading() {
    content.innerHTML = "<p>Loading......</p>";
}

function showError() {
    content.innerHTML = "<p style='color:red;'>Error loading the data.....</p>";
}

function showEmpty() {
    content.innerHTML = "<p>No results were found</p>";
}

async function fetchAnime(limit = 8, name = "", type = "") {
    showLoading();
    try {
        let url = `https://api.jikan.moe/v4/anime?limit=${limit}`;
        if (name) url += `&q=${encodeURIComponent(name)}`;
        if (type) url += `&type=${encodeURIComponent(type)}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            showEmpty();
            return;
        }

        content.innerHTML = data.data.map(anime => `
            <div class="card">
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <p>Type: ${anime.type}</p>
            </div>
        `).join("");
    } catch {
        showError();
    }
}

function Anime() {
    clearFormContainer();
    formContainer.innerHTML = `
        <form id="animeForm">
            <input type="number" id="animeLimit" placeholder="Limit" value="8" min="1" max="20">
            <input type="text" id="animeName" placeholder="Anime name">
            <select id="animeType">
                <option value="">All</option>
                <option value="TV">TV</option>
                <option value="Movie">Movie</option>
                <option value="OVA">OVA</option>
            </select>
            <button type="submit">Search</button>
        </form>
    `;
    document.getElementById("animeForm").addEventListener("submit", e => {
        e.preventDefault();
        const limit = document.getElementById("animeLimit").value;
        const name = document.getElementById("animeName").value;
        const type = document.getElementById("animeType").value;
        fetchAnime(limit, name, type);
    });
}

async function fetchCountries(region = "Americas") {
    showLoading();
    try {
        const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        const data = await res.json();
        if (!data || data.length === 0) {
            showEmpty();
            return;
        }
        content.innerHTML = data.slice(0, 8).map(country => `
            <div class="card">
                <img src="${country.flags.svg}" alt="${country.name.common}">
                <h3>${country.name.common}</h3>
                <p>Population: ${country.population.toLocaleString()}</p>
            </div>
        `).join("");
    } catch {
        showError();
    }
}

function Countries() {
    clearFormContainer();
    formContainer.innerHTML = `
        <form id="countriesForm">
            <select id="region">
                <option value="Americas">Americas</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
            </select>
            <button type="submit">Search</button>
        </form>
    `;
    document.getElementById("countriesForm").addEventListener("submit", e => {
        e.preventDefault();
        fetchCountries(document.getElementById("region").value);
    });
}


async function Pokemon() {
    clearFormContainer();
    showLoading();
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=15`);
        const data = await res.json();
        if (!data.results || data.results.length === 0) {
            showEmpty();
            return;
        }

        const pokemonData = await Promise.all(data.results.map(async p => {
            const pokeRes = await fetch(p.url);
            return pokeRes.json();
        }));

        content.innerHTML = pokemonData.map(poke => `
            <div class="card">
                <img src="${poke.sprites.front_default}" alt="${poke.name}">
                <h3>${poke.name}</h3>
                <p>Height: ${poke.height} | Weight: ${poke.weight}</p>
            </div>
        `).join("");
    } catch {
        showError();
    }
}

async function fetchFood() {
    clearFormContainer();
    showLoading();
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        const data = await res.json();

        if (!data.meals || data.meals.length === 0) {
            showEmpty();
            return;
        }

        const meals = data.meals.slice(0, 10);

        content.innerHTML = meals.map(meal => `
            <div class="card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strArea} - ${meal.strCategory}</p>
            </div>
        `).join("");
    } catch {
        showError();
    }
}

function showFoods() {
    clearFormContainer();
    fetchFood();
}
