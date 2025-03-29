const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Función para obtener los planetas de un sistema planetario específico
async function fetchPlanets(system) {
    const planetsUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,+disc_year,+pl_bmasse,+pl_eqt,+pl_rade,+sy_dist,+pl_orbper+from+ps+where+hostname='${system}'+and+default_flag=1&format=json`;

    try {
        const response = await axios.get(planetsUrl);
        return response.data.map(planet => ({
            name: planet.pl_name,
            discovery_year: planet.disc_year,
            mass_compared_earth: planet.pl_bmasse,
            temperature_in_kelvin: planet.pl_eqt,
            radius_compared_earth: planet.pl_rade,
            ps_distance_in_Parsecs: planet.sy_dist,
            orbital_duration_in_days: planet.pl_orbper,
            density: planet.pl_dens,
            telescop: planet.pl_telescope,
            planetToStarRadiusRatio: planet.pl_ratror,
            moons: planet.pl_mnum
        }));
    } catch (error) {
        console.error(`Error fetching planets for system ${system}:`, error.message);
        return [];
    }
}

// Función para obtener sistemas planetarios aleatorios en cada petición
async function fetchRandomSystems() {
    const systemsUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct+hostname,count(pl_name)+as+num_planets+from+ps+where+default_flag=1+group+by+hostname+having+count(pl_name)<15+order+by+num_planets+desc&format=json&maxrec=50';

    try {
        const response = await axios.get(systemsUrl);
        let systems = response.data;

        // Mezclar y seleccionar 6 sistemas aleatorios en cada petición
        systems = systems.sort(() => Math.random() - 0.5).slice(0, 6);

        // Obtener los planetas de cada sistema seleccionado
        const systemsWithPlanets = await Promise.all(systems.map(async (system) => {
            const planets = await fetchPlanets(system.hostname);
            return {
                system: system.hostname,
                num_planets: system.num_planets,
                planets: planets
            };
        }));

        return systemsWithPlanets;
    } catch (error) {
        console.error('Error fetching systems:', error.message);
        return [];
    }
}

// Endpoint que obtiene sistemas aleatorios en cada recarga de la web
app.get('/api/datos', async (req, res) => {
    try {
        const systems = await fetchRandomSystems();
        res.json(systems);
    } catch (error) {
        console.error("Error al obtener los datos:", error.message);
        res.status(500).json({ error: "Error al obtener los datos del servidor" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
