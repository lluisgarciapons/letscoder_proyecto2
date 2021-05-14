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

// Función que se llama cuando los datos ya han llegado del fetch,
// mientras no usen fetch esto no hace falta
const init = matches => {
    addListeners(matches);
    filters(matches);
    stats(matches);
};

// Añadir los listeners a los inputs una vez lleguen a los filtros
const addListeners = (matches) => {
    let radioButtons = document.getElementsByName("resultado");
    Array.from(radioButtons).forEach(el => {
        el.addEventListener("click", () => {
            filters(matches);
        });
    });
    let teamInput = document.getElementById("filtro-nombre-equipo");
    teamInput.addEventListener("change", () => {
        filters(matches);
    });
};

// Función que consigue una array filtrada, array que pasaremos a 
// la función de crear la tabla. No se hace hasta llegar al 3r entregable
const filters = matches => {
    const team = document.getElementById("filtro-nombre-equipo").value.toLowerCase();
    let radio = document.querySelector('[name=resultado]:checked');

    // Si no hay equipo escrito, mostrar todos los partidos
    if (team == "") {
        return printTable(matches);
    }

    // Filtro por nombre de equipo
    let filteredByName = matches.filter(partido => {
        let condicion = partido.homeTeam.name.toLowerCase().includes(team) || partido.awayTeam.name.toLowerCase().includes(team);
        return condicion;
    });

    // Si no hay resultado seleccionado, mostrar solo filtro por nombre
    if (radio == null) {
        return printTable(filteredByName);
    }

    // Filtro por resultado (sobre la array de filtro de nombre)
    let filteredMatches = filteredByName.filter(partido => {
        let valorRadio = radio.value;
        let isHome = partido.homeTeam.name.toLowerCase().includes(team);
        let isAway = partido.awayTeam.name.toLowerCase().includes(team);

        // Si el ganador es home team...
        if (partido.score.winner === "HOME_TEAM") {
            //... El equipo buscado es home team y queremos mostrar los ganados
            if (isHome && valorRadio == "ganado") {
                return true;
            }

            //... El equipo buscado es away team y queremos mostrar los perdidos
            else if (isAway && valorRadio == "perdido") {
                return true;
            }

            // ... No es ninguna condición anterior
            else {
                return false;
            }
        }
        //Lo mismo pero para away team
        else if (partido.score.winner === "AWAY_TEAM") {
            if (isAway && valorRadio == "ganado") {
                return true;
            }
            else if (isHome && valorRadio == "perdido") {
                return true;
            }
            else {
                return false;
            }
        }
        // Si el partido acaba empate y queremos mostrar los empatados
        else if (partido.score.winner === "DRAW") {
            if (valorRadio == "empatado") {
                return true;
            }
        }
        // Si no ha terminado el partido y queremos mostrar los proximos
        else if (partido.score.winner == null && valorRadio == "proximos") {
            return true;
        }
        // Cualquier otra combinación no es buena
        else {
            return false;
        }
    });

    // return printTable2(filteredMatches);
    printTable(filteredMatches);
};


function printTable(matches) {
    // Dejar el tbody vacío cada vez que se llama, para asi estar seguros
    // Que crea la tabla des de cero
    let body = document.getElementById("table-body");
    body.innerHTML = "";

    // Si la array está vacía mostrar este mensaje
    if (matches.length == 0) {
        body.innerHTML = `
        <tr>
            <td colspan="3"> No hay partidos que coincidan con este criterio </td>
        </tr>
        `;

    }

    for (let i = 0; i < matches.length; i++) {
        let row = document.createElement("tr");

        let tdLocal = document.createElement("td");
        let escudoLocal = document.createElement("img");
        escudoLocal.setAttribute("src", `https://crests.football-data.org/${matches[i].homeTeam.id}.svg`);
        let tdResultado = document.createElement("td");
        let tdVisitante = document.createElement("td");
        let escudoVisitante = document.createElement("img");
        escudoVisitante.setAttribute("src", `https://crests.football-data.org/${matches[i].awayTeam.id}.svg`);

        tdLocal.append(matches[i].homeTeam.name, escudoLocal);
        // Si el partido ha terminado mostramos el resultado
        if (matches[i].status === "FINISHED") {
            tdResultado.innerHTML = `${matches[i].score.fullTime.homeTeam} - ${matches[i].score.fullTime.awayTeam}`;
        }
        else {
            tdResultado.innerHTML = `Por Jugar`;
        }
        tdVisitante.append(escudoVisitante, matches[i].awayTeam.name);

        row.append(tdLocal, tdResultado, tdVisitante);
        body.append(row);
    }
}

// ESTO NO TE LO MIRES, ES ALGO MIO EXTRA

// const printTable2 = matches => {
//     let parent = document.getElementById("partidos");
//     parent.innerHTML = "";
//     if (matches.length == 0) {
//         document.getElementById("alerta-sin-equipos").classList.remove("hidden");
//         return;
//     }
//     document.getElementById("alerta-sin-equipos").classList.add("hidden");
//     matches.forEach(match => {
//         let matchDiv = document.createElement("div");
//         let homeTeam = document.createElement("div");
//         let homeLogo = document.createElement("img");
//         let result = document.createElement("div");
//         let awayLogo = document.createElement("img");
//         let awayTeam = document.createElement("div");

//         matchDiv.classList.add("partido");
//         homeTeam.classList.add("partido__equipo", "equipo__local");
//         awayTeam.classList.add("partido__equipo", "equipo__visitante");
//         homeLogo.classList.add("partido__logo", "logo__local");
//         awayLogo.classList.add("partido__logo", "logo__visitante");
//         result.classList.add("partido__resultado");

//         homeLogo.setAttribute("src", `https://crests.football-data.org/${match.homeTeam.id}.svg`);
//         awayLogo.setAttribute("src", `https://crests.football-data.org/${match.awayTeam.id}.svg`);

//         homeTeam.innerHTML = match.homeTeam.name;
//         awayTeam.innerHTML = match.awayTeam.name;
//         result.innerHTML = (match.status == "FINISHED" ? `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}` : formatDate(match.utcDate));

//         matchDiv.append(homeTeam, homeLogo, result, awayLogo, awayTeam);
//         parent.appendChild(matchDiv);
//     });
// };

// const formatDate = (utcDate) => {
//     var date = new Date(utcDate);
//     var h = date.getHours();
//     var m = date.getMinutes();
//     function checkTime(i) {
//         if (i < 10) {
//             i = "0" + i;
//         }
//         return i;
//     }
//     m = checkTime(m);
//     var month = new Array();
//     month[0] = "January";
//     month[1] = "February";
//     month[2] = "March";
//     month[3] = "April";
//     month[4] = "May";
//     month[5] = "June";
//     month[6] = "July";
//     month[7] = "August";
//     month[8] = "September";
//     month[9] = "October";
//     month[10] = "November";
//     month[11] = "December";
//     var weekday = new Array(7);
//     weekday[0] = "Sunday";
//     weekday[1] = "Monday";
//     weekday[2] = "Tuesday";
//     weekday[3] = "Wednesday";
//     weekday[4] = "Thursday";
//     weekday[5] = "Friday";
//     weekday[6] = "Saturday";
//     return `${weekday[date.getDay()].slice(0, 3)} ${date.getDate()} ${month[date.getMonth()]} ${h}:${m} h.`;
// };






const stats = (matches) => {
    let statistics = [];

    matches.forEach(match => {
        if (match.status !== "FINISHED") return;

        let donde = ["homeTeam", "awayTeam"];

        donde.forEach(where => {
            let teamFound = statistics.find(team => team.id == match[where].id);

            if (!teamFound) {
                statistics.push({
                    id: match[where].id,
                    name: match[where].name,
                    goals: match.score.fullTime[where],
                    matches: 1
                });
            }
            else {
                teamFound.goals += match.score.fullTime[where],
                    teamFound.matches++;
            }
        });
    });

    statistics.forEach(team => {
        team.avg = (team.goals / team.matches);
    });

    console.log(statistics);
};


