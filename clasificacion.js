let clasificacion = data.standings[0].table;
console.log(data);
// FETCH CON ASYNC AWAIT

// async function getData() {
//     const url = "https://api.football-data.org/v2/competitions/2014/standings";
//     const response = await fetch(url, {
//         method: "GET",
//         headers: {
//             "X-Auth-Token": "3bcd6e5663a94bba833d420110684b01"
//         }
//     });
//     const data = await response.json();
//     console.log(data);
// };

getDataFetchAbbr();

// El fetch que deberán hacer ellos cuando les toque
function getDataFetchAbbr() {
    const url = "https://api.football-data.org/v2/competitions/2014/standings";
    fetch(url, {
        method: "GET",
        headers: {
            "X-Auth-Token": "3bcd6e5663a94bba833d420110684b01"
        }
    }).then(response => {
        if (response.ok) return response.json();

    }).then(data => {
        console.log(data);
        // Este es el path para llegar ala clasificación total
        crearTablaClasificacion(data.standings[0].table);
    });
}


function crearTablaClasificacion(standings) {
    let body = document.getElementById("standings-body");

    for (let i = 0; i < standings.length; i++) {
        let row = document.createElement("tr");

        let pos = standings[i].position;
        let escudo = document.createElement("img");
        escudo.setAttribute("src", standings[i].team.crestUrl);
        let nombre = standings[i].team.name;
        let jugados = standings[i].playedGames;
        let ganados = standings[i].won;
        let empatado = standings[i].draw;
        let perdidos = standings[i].lost;
        let golesFavor = standings[i].goalsFor;
        let golesContra = standings[i].goalsAgainst;
        let golesDiferencia = standings[i].goalDifference;
        let puntos = standings[i].points;
        let ultimos = standings[i].form;

        // Para no crear 12 td, y no hacer 12 append, de crea una arary con los datos
        let datos = [pos, escudo, nombre, jugados, ganados, empatado, perdidos, golesFavor, golesContra, golesDiferencia, puntos, ultimos];

        // Loop por la array de datos para crear td y hacer append a row
        for (let k = 0; k < datos.length; k++) {
            let celda = document.createElement("td");
            celda.append(datos[k]);
            row.append(celda);
        }
        body.append(row);
    }
}

