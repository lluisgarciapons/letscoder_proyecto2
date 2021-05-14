
getData();

// Recogida de datos. Aquí ya está con fetch, pero primero deben
// copiar el json con postman, guardarlo en una variable "data" en
// matches.js (por ejemplo) y cogerlo como variable local
async function getData() {
    const response = await fetch("matches.json");
    const data = await response.json();
    console.log(data.matches);
    init(data.matches);
};

const init = matches => {
    stats(matches);
};


function stats(matches) {
    let statistics = [];

    matches.forEach(match => {
        if (match.status !== "FINISHED") return;

        let homeFound = statistics.find(team => team.id == match.homeTeam.id);

        if (!homeFound) {
            statistics.push({
                id: match.homeTeam.id,
                name: match.homeTeam.name,
                goals: match.score.fullTime.homeTeam,
                matches: 1
            });
        }
        else {
            homeFound.goals += match.score.fullTime.homeTeam,
                homeFound.matches++;
        }

        let awayFound = statistics.find(team => team.id == match.awayTeam.id);

        if (!awayFound) {
            statistics.push({
                id: match.awayTeam.id,
                name: match.awayTeam.name,
                goals: match.score.fullTime.awayTeam,
                matches: 1
            });
        }
        else {
            awayFound.goals += match.score.fullTime.awayTeam,
                awayFound.matches++;
        }

    });

    statistics.forEach(team => {
        team.avg = (team.goals / team.matches);
    });

    console.log(statistics);
    crearTableStats(statistics);
};

// PASOS A SEGUIR PARA MONTAR LA FUNCIÓN ANTERIOR!

// 0. Crear función que va calcular las estadísticas, recibiendo como param el array de partidos

// 1. Crear array vacía (será array de objetos)

// 2. Iterar por todos los partidos

// 3. Condición: si el partido no está acabado, no seguir y mirar siguiente partido

// 4. Buscar en la array estadísticas el objeto con el mismo id que el homeTeam del partido y guardarlo en una variable

// 5. Si el objeto buscado no existe, crearlo con estos keys: id, name, goals, matches.
// Rellenar cada key con el valor correspondiente

// 6. Si existe, actualizar los goles y los partidos

// 7. Hacer exactamente lo mismo a partir del punto 4, pero con awayTeam

// 8. Una vez fuera del loop de partidos, iterar por el array estadisticas

// 9. Añadir la key avg a cada objeto, con el valor goals/matches

// 10. Hacer console.log() para ver que todo está correcto.



function crearTableStats(equipos) {

    let equiposOrdenados = Array.from(equipos).sort((a, b) => {
        return b.avg - a.avg;
    });

    console.log(equiposOrdenados);

    let body = document.getElementById("stats-body");

    for (let i = 0; i < 5; i++) {
        let row = document.createElement("tr");

        let posicion = i + 1;
        let escudo = document.createElement("img");
        escudo.setAttribute("src", `https://crests.football-data.org/${equiposOrdenados[i].id}.svg`);
        let nombre = equiposOrdenados[i].name;
        let goles = equiposOrdenados[i].goals;
        let partidos = equiposOrdenados[i].matches;
        let media = equiposOrdenados[i].avg.toFixed(2);

        let datos = [posicion, escudo, nombre, goles, partidos, media];

        datos.forEach(dato => {
            let celda = document.createElement("td");
            celda.append(dato);
            row.append(celda);
        });
        body.append(row);
    }
}

// HACER LAS MISMAS FUNCIONES PARA LA OTRA TABLA DE ESTADISTICAS,
// UNA FUNCIÓN QUE CREE LA ARRAY Y OTRA QUE MONTE LA TABLA