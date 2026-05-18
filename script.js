const POKEDEX = {
    bulbasaur: {
        nombre: 'BULBASAUR', hpMax: 50, 
        spriteFrente: 'images/bulbasaur.gif',
        spriteEspalda: 'images/bulbasaur_back.gif',
        movimientos: [
            { nombre: 'Placaje', daño: [8, 12], sonido: 'audios/Tackle.wav', efecto: null },
            { nombre: 'Hoja Afilada', daño: [12, 18], sonido: 'audios/RazorLeaf.wav', efecto: null },
            { nombre: 'Látigo Cepa', daño: [15, 20], sonido: 'audios/Solarbeam.wav', efecto: null },
            { nombre: 'Síntesis', cura: [10, 15], sonido: 'audios/Synthesis.wav', efecto: null }
        ]
    },
    charmander: {
        nombre: 'CHARMANDER', hpMax: 45, 
        spriteFrente: 'images/charmander.gif',
        spriteEspalda: 'images/charmander_back.gif',
        movimientos: [
            { nombre: 'Arañazo', daño: [7, 10], sonido: 'audios/Scratch.wav', efecto: null },
            { nombre: 'Ascuas', daño: [10, 15], sonido: 'audios/Ember.wav', efecto: 'QUEMADO' },
            { nombre: 'Lanzallamas', daño: [18, 25], sonido: 'audios/Flamethrower.wav', efecto: 'QUEMADO' },
            { nombre: 'Malicioso', daño: [2, 5], sonido: 'audios/Growl.mp3', efecto: null }
        ]
    },
    squirtle: {
        nombre: 'SQUIRTLE', hpMax: 55, 
        spriteFrente: 'images/squirtle.gif',
        spriteEspalda: 'images/squirtle_back.gif',
        movimientos: [
            { nombre: 'Placaje', daño: [8, 12], sonido: 'audios/Tackle.wav', efecto: null },
            { nombre: 'Pistola Agua', daño: [14, 20], sonido: 'audios/WaterGun.wav', efecto: null },
            { nombre: 'Onda Trueno', daño: [4, 8], sonido: 'audios/Withdraw.wav', efecto: 'PARALIZADO' },
            { nombre: 'Refugio', cura: [5, 10], sonido: 'audios/Withdraw.wav', efecto: null }
        ]
    },
    pikachu: {
        nombre: 'PIKACHU', hpMax: 40, 
        spriteFrente: 'images/pikachu.gif',
        spriteEspalda: 'images/pikachu_back.gif',
        movimientos: [
            { nombre: 'Impactrueno', daño: [12, 16], sonido: 'audios/Tackle.wav', efecto: 'PARALIZADO' },
            { nombre: 'Ataque Rápido', daño: [8, 11], sonido: 'audios/Scratch.wav', efecto: null },
            { nombre: 'Rayo', daño: [18, 22], sonido: 'audios/RazorLeaf.wav', efecto: 'PARALIZADO' },
            { nombre: 'Onda Trueno', daño: [2, 6], sonido: 'audios/Withdraw.wav', efecto: 'PARALIZADO' }
        ]
    },
    eevee: {
        nombre: 'EEVEE', hpMax: 48, 
        spriteFrente: 'images/eevee.gif',
        spriteEspalda: 'images/eevee_back.gif',
        movimientos: [
            { nombre: 'Placaje', daño: [8, 12], sonido: 'audios/Tackle.wav', efecto: null },
            { nombre: 'Rapidez', daño: [11, 15], sonido: 'audios/Scratch.wav', efecto: null },
            { nombre: 'Mordisco', daño: [10, 14], sonido: 'audios/Growl.mp3', efecto: null },
            { nombre: 'Deseo', cura: [12, 18], sonido: 'audios/Synthesis.wav', efecto: null }
        ]
    },
    jigglypuff: {
        nombre: 'JIGGLYPUFF', hpMax: 65, 
        spriteFrente: 'images/jigglypuff.gif',
        spriteEspalda: 'images/jigglypuff_back.gif',
        movimientos: [
            { nombre: 'Destructor', daño: [7, 11], sonido: 'audios/Scratch.wav', efecto: null },
            { nombre: 'Vozarrón', daño: [12, 17], sonido: 'audios/Growl.mp3', efecto: null },
            { nombre: 'Doblebofetón', daño: [14, 20], sonido: 'audios/Tackle.wav', efecto: null },
            { nombre: 'Grupo Cura', cura: [8, 14], sonido: 'audios/Synthesis.wav', efecto: null }
        ]
    }
};

let llavesDisponibles = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'eevee', 'jigglypuff'];

let menuActual = 'seleccion_inicial';
let filaSeleccionada = 0;
let colSeleccionada = 0;

let equipoJugador = []; 
let indiceActivoJugador = 0;
let equipoEnemigo = []; 
let indiceActivoEnemigo = 0;

let volumenGlobal = 0.07;
let modoCambioCombate = false;
let datosGuardados = JSON.parse(localStorage.getItem('pokemon_save_data')) || {};

const musicaBatalla = document.getElementById('battle-music');
const musicaVictoria = document.getElementById('victory-theme');

function reproducirSonido(ruta) {
    const audio = new Audio(ruta);
    audio.volume = volumenGlobal;
    audio.play().catch(e => {});
}

function reproducirMusicaVictoria() {
    if(musicaVictoria) {
        musicaVictoria.volume = volumenGlobal;
        musicaVictoria.play().catch(e => {});
    }
}

async function buscarEnPokeApi() {
    const input = document.getElementById('search-input');
    const nombreBuscar = input.value.trim().toLowerCase();

    if (!nombreBuscar) return;

    mostrarStatus(`Buscando a ${nombreBuscar.toUpperCase()}...`);

    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombreBuscar}`);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado");

        const data = await respuesta.json();
        
        const nuevoPokemon = {
            nombre: data.name.toUpperCase(),
            hpMax: data.stats[0].base_stat,
            spriteFrente: data.sprites.front_default || 'images/default.gif', 
            spriteEspalda: data.sprites.back_default || data.sprites.front_default || 'images/default_back.gif',
            movimientos: [
                { nombre: data.moves[0]?.move.name || 'Placaje', daño: [8, 12], sonido: 'audios/Tackle.wav', efecto: null },
                { nombre: data.moves[1]?.move.name || 'Golpe Cabeza', daño: [10, 15], sonido: 'audios/Tackle.wav', efecto: 'PARALIZADO' },
                { nombre: data.moves[2]?.move.name || 'Poder Oculto', daño: [12, 18], sonido: 'audios/Scratch.wav', efecto: 'QUEMADO' },
                { nombre: 'Descanso', cura: [12, 20], sonido: 'audios/Synthesis.wav', efecto: null }
            ]
        };

        if(equipoJugador.length < 3) {
            let llaveAReemplazar = llavesDisponibles.find(k => !equipoJugador.some(p => p.id === k));
            if(llaveAReemplazar) {
                const nodoViejo = document.getElementById(`card-${llaveAReemplazar}`);
                if(nodoViejo) nodoViejo.remove();
                
                llavesDisponibles = llavesDisponibles.filter(k => k !== llaveAReemplazar);
                
                POKEDEX[data.name] = nuevoPokemon;
                llavesDisponibles.push(data.name);
                inyectarPokemonEnSelector(data.name, nuevoPokemon);
                
                mostrarStatus(`¡${nuevoPokemon.nombre} ha reemplazado a ${llaveAReemplazar.toUpperCase()} en las opciones!`);
            }
        }
        input.value = '';

    } catch (error) {
        mostrarAlertaRetro(`¡El Pokémon "${nombreBuscar.toUpperCase()}" no existe!`);
        mostrarStatus("Elige un Pokémon de la lista.");
    }
}

function inyectarPokemonEnSelector(id, poke) {
    const container = document.getElementById('pokemon-options-container');
    const card = document.createElement('div');
    card.className = 'sel-card';
    card.id = `card-${id}`;
    card.onclick = () => seleccionarParaEquipo(id);
    card.innerHTML = `<img src="${poke.spriteFrente}"><p>${poke.nombre}</p>`;
    container.appendChild(card);
}

function mostrarAlertaRetro(mensaje) {
    document.getElementById('alert-message').textContent = mensaje;
    document.getElementById('retro-alert').style.display = 'flex';
}

function cerrarAlerta() {
    document.getElementById('retro-alert').style.display = 'none';
}

function seleccionarParaEquipo(idPokemon) {
    if (modoCambioCombate) return; 

    if (equipoJugador.some(p => p.id === idPokemon)) {
        mostrarAlertaRetro("¡Este Pokémon ya está en tu equipo!");
        return;
    }

    const basePoke = POKEDEX[idPokemon];
    if (!datosGuardados[idPokemon]) {
        datosGuardados[idPokemon] = { nivel: 5, exp: 0, hpMaxBonus: 0, dañoBonus: 0 };
    }

    const stats = datosGuardados[idPokemon];
    const hpCalculadaMax = basePoke.hpMax + stats.hpMaxBonus;

    equipoJugador.push({
        id: idPokemon,
        nombre: basePoke.nombre,
        hpMax: hpCalculadaMax,
        hp: hpCalculadaMax,
        spriteFrente: basePoke.spriteFrente,
        spriteEspalda: basePoke.spriteEspalda,
        movimientos: basePoke.movimientos,
        estado: null
    });

    document.getElementById(`card-${idPokemon}`).style.opacity = "0.4";
    document.getElementById(`card-${idPokemon}`).style.pointerEvents = "none";
    actualizarVistaResumenEquipo();

    if (equipoJugador.length === 3) {
        llavesDisponibles.forEach(llave => {
            if (!equipoJugador.some(p => p.id === llave)) {
                const bEnemigo = POKEDEX[llave];
                equipoEnemigo.push({
                    id: llave,
                    nombre: bEnemigo.nombre,
                    hpMax: bEnemigo.hpMax,
                    hp: bEnemigo.hpMax,
                    spriteFrente: bEnemigo.spriteFrente,
                    ataques: [
                        { nombre: bEnemigo.movimientos[0].nombre.toUpperCase(), daño: bEnemigo.movimientos[0].daño || [6,12], efecto: bEnemigo.movimientos[0].efecto },
                        { nombre: bEnemigo.movimientos[1].nombre.toUpperCase(), daño: bEnemigo.movimientos[1].daño || [7,14], efecto: bEnemigo.movimientos[1].efecto }
                    ],
                    estado: null
                });
            }
        });

        document.getElementById('pokemon-selector').style.display = 'none';
        inicializarCombateCompleto();
    }
}

function actualizarVistaResumenEquipo() {
    const slots = document.getElementById('team-slots');
    const nombres = equipoJugador.map(p => p.nombre);
    while (nombres.length < 3) nombres.push("---");
    slots.textContent = nombres.join(" / ");
}

function inicializarCombateCompleto() {
    indiceActivoJugador = 0;
    indiceActivoEnemigo = 0;

    musicaBatalla.volume = volumenGlobal;
    musicaBatalla.play().catch(e => {});

    document.getElementById('status').innerHTML = '';
    
    desplegarPokemonJugador();
    desplegarPokemonEnemigo();
    
    mostrarStatus(`¡Comienza el combate! El rival envió a ${equipoEnemigo[indiceActivoEnemigo].nombre}.`);
    setTimeout(() => { showActionMenu(); }, 2000);
}

function desplegarPokemonJugador() {
    const pk = equipoJugador[indiceActivoJugador];
    const statsGuardados = datosGuardados[pk.id];

    document.getElementById('nombre-jugador').textContent = pk.nombre;
    document.getElementById('sprite-jugador').src = pk.spriteEspalda;
    document.getElementById('hpmax-jugador').textContent = pk.hpMax;
    document.getElementById('nivel-jugador').textContent = `Lv. ${statsGuardados.nivel}`;
    
    actualizarHP();
    actualizarEstadosVisuales();
}

function desplegarPokemonEnemigo() {
    const env = equipoEnemigo[indiceActivoEnemigo];
    document.getElementById('nombre-enemigo').textContent = env.nombre;
    document.getElementById('sprite-enemigo').src = env.spriteFrente;
    document.getElementById('hpmax-enemigo').textContent = env.hpMax;
    document.getElementById('contador-enemigos').textContent = `Poké: ${equipoEnemigo.filter(e => e.hp > 0).length}`;
    
    actualizarHP();
    actualizarEstadosVisuales();
}

function showActionMenu() {
    menuActual = 'acciones';
    filaSeleccionada = 0;
    colSeleccionada = 0;
    
    document.getElementById('battle-menu').style.display = 'none';
    document.getElementById('action-menu').style.display = 'grid';
    const pk = equipoJugador[indiceActivoJugador];
    mostrarStatus(`¿Qué debe hacer ${pk.nombre}?`);
    
    actualizarEnfoqueVisualTeclado();
}

function showBattleMenu() {
    menuActual = 'ataques';
    filaSeleccionada = 0;
    colSeleccionada = 0;

    document.getElementById('action-menu').style.display = 'none';
    const battleMenu = document.getElementById('battle-menu');
    battleMenu.style.display = 'grid';
    battleMenu.innerHTML = '';

    const pk = equipoJugador[indiceActivoJugador];
    pk.movimientos.forEach((mov, index) => {
        const btn = document.createElement('div');
        btn.className = 'menu-option';
        btn.id = `atk-opt-${index}`; 
        btn.textContent = mov.nombre.toUpperCase();
        btn.onclick = () => ejecutarAtaque(mov);
        battleMenu.appendChild(btn);
    });

    mostrarStatus('¿Qué movimiento usar?');
    actualizarEnfoqueVisualTeclado();
}

function abrirCambioIntermedio() {
    menuActual = 'cambio'; 
    filaSeleccionada = 0;
    colSeleccionada = 0;   
    modoCambioCombate = true;
    
    document.getElementById('pokemon-selector').style.display = 'flex';
    document.getElementById('selector-titulo').textContent = "¡CAMBIA DE POKÉMON!";
    document.getElementById('action-menu').style.display = 'none';
    document.getElementById('battle-menu').style.display = 'none';
    
    const container = document.getElementById('pokemon-options-container');
    container.innerHTML = '';

    equipoJugador.forEach((pk, idx) => {
        const card = document.createElement('div');
        card.className = `sel-card ${pk.hp <= 0 ? 'disabled-card' : ''}`;
        card.id = `switch-opt-${idx}`;
        
        if (idx === indiceActivoJugador) card.style.border = "3px solid #ffcc00";
        
        card.onclick = () => {
            if (pk.hp <= 0) {
                mostrarAlertaRetro("¡Ese Pokémon no puede luchar!");
                return;
            }
            if (idx === indiceActivoJugador) {
                mostrarAlertaRetro("¡Ya está en combate!");
                return;
            }
            document.getElementById('pokemon-selector').style.display = 'none';
            modoCambioCombate = false;
            confirmarCambioEnCombate(idx);
        };
        card.innerHTML = `<img src="${pk.spriteFrente}"><p>${pk.nombre}<br>HP: ${pk.hp}/${pk.hpMax}</p>`;
        container.appendChild(card);
    });

    actualizarEnfoqueVisualTeclado();
}

function confirmarCambioEnCombate(nuevoIndice) {
    const anterior = equipoJugador[indiceActivoJugador];
    indiceActivoJugador = nuevoIndice;
    const nuevo = equipoJugador[indiceActivoJugador];
    
    mostrarStatus(`¡Vuelve ${anterior.nombre}! ¡Adelante ${nuevo.nombre}!`);
    desplegarPokemonJugador();
    
    setTimeout(() => {
        turnoEnemigo();
    }, 1500);
}

function AbrirMochila() {
    mostrarStatus("¡Mochila vacía! No tienes objetos todavía.");
}

function ejecutarAtaque(movimiento) {
    menuActual = 'ninguno';
    document.getElementById('battle-menu').style.display = 'none';
    const pk = equipoJugador[indiceActivoJugador];
    const env = equipoEnemigo[indiceActivoEnemigo];

    if (pk.estado === 'PARALIZADO' && Math.random() < 0.5) {
        mostrarStatus(`¡${pk.nombre} está paralizado y no puede moverse!`);
        setTimeout(() => { procesarEfectosFinTurno(turnoEnemigo); }, 1500);
        return;
    }

    reproducirSonido(movimiento.sonido);
    mostrarStatus(`¡${pk.nombre} usó ${movimiento.nombre.toUpperCase()}!`);

    setTimeout(() => {
        if (movimiento.daño && Math.random() < 0.05) {
            mostrarStatus(`¡Pero el ataque de ${pk.nombre} falló!`);
            setTimeout(() => { procesarEfectosFinTurno(turnoEnemigo); }, 1500);
            return;
        }

        let critico = 1;
        if (movimiento.daño && Math.random() < 0.10) {
            critico = 2;
            mostrarStatus(`¡Un golpe crítico!`);
        }

        if (movimiento.daño) {
            const bonos = datosGuardados[pk.id].dañoBonus;
            let dañoBase = Math.floor(Math.random() * (movimiento.daño[1] - movimiento.daño[0] + 1)) + movimiento.daño[0];
            let dañoFinal = (dañoBase + bonos) * critico;
            
            env.hp = Math.max(0, env.hp - dañoFinal);

            if (movimiento.efecto && !env.estado && Math.random() < 0.4) {
                env.estado = movimiento.efecto;
                mostrarStatus(`¡${env.nombre} ha sido ${env.estado}!`);
            }
        }
        
        if (movimiento.cura) {
            const cura = Math.floor(Math.random() * (movimiento.cura[1] - movimiento.cura[0] + 1)) + movimiento.cura[0];
            pk.hp = Math.min(pk.hpMax, pk.hp + cura);
        }

        actualizarHP();
        actualizarEstadosVisuales();
        if (verificarGanadorEnemigoODebilitado()) return;

        setTimeout(() => { procesarEfectosFinTurno(turnoEnemigo); }, 1500);
    }, 1000);
}

function turnoEnemigo() {
    const env = equipoEnemigo[indiceActivoEnemigo];
    const pk = equipoJugador[indiceActivoJugador];

    if (env.estado === 'PARALIZADO' && Math.random() < 0.5) {
        mostrarStatus(`¡${env.nombre} está paralizado y no puede moverse!`);
        setTimeout(() => { procesarEfectosFinTurno(showActionMenu); }, 1500);
        return;
    }
    
    const ataque = env.ataques[Math.floor(Math.random() * env.ataques.length)];

    if (Math.random() < 0.05) {
        mostrarStatus(`¡${env.nombre} usó ${ataque.nombre} pero falló!`);
        setTimeout(() => { procesarEfectosFinTurno(showActionMenu); }, 1500);
        return;
    }

    let critico = Math.random() < 0.10 ? 2 : 1;
    if (critico === 2) mostrarStatus(`¡${env.nombre} asestó un golpe crítico!`);

    let dañoBase = Math.floor(Math.random() * (ataque.daño[1] - ataque.daño[0] + 1)) + ataque.daño[0];
    let dañoFinal = dañoBase * critico;

    pk.hp = Math.max(0, pk.hp - dañoFinal);
    mostrarStatus(`¡${env.nombre} usó ${ataque.nombre}! Recibes ${dañoFinal} de daño.`);

    if (!pk.estado && ataque.efecto && Math.random() < 0.3) {
        pk.estado = ataque.efecto;
        mostrarStatus(`¡${pk.nombre} fue ${pk.estado}!`);
    }

    actualizarHP();
    actualizarEstadosVisuales();
    if (verificarJugadorDebilitado()) return;

    setTimeout(() => { procesarEfectosFinTurno(showActionMenu); }, 2000);
}

function procesarEfectosFinTurno(siguienteAccion) {
    let delayEfecto = 0;
    const pk = equipoJugador[indiceActivoJugador];
    const env = equipoEnemigo[indiceActivoEnemigo];

    if (pk.estado === 'QUEMADO' && pk.hp > 0) {
        pk.hp = Math.max(0, pk.hp - 6);
        mostrarStatus(`¡${pk.nombre} sufre daño por quemadura!`);
        delayEfecto += 1500;
    }

    if (env.estado === 'QUEMADO' && env.hp > 0) {
        env.hp = Math.max(0, env.hp - 6);
        mostrarStatus(`¡${env.nombre} sufre daño por quemadura!`);
        delayEfecto += 1500;
    }

    actualizarHP();
    
    if (verificarGanadorEnemigoODebilitado()) return;
    if (verificarJugadorDebilitado()) return;

    setTimeout(siguienteAccion, delayEfecto);
}

function mostrarStatus(texto) {
    const textBox = document.getElementById('status');
    const nuevoMensaje = document.createElement('p');
    nuevoMensaje.className = 'log-entry';
    nuevoMensaje.textContent = `> ${texto}`;
    
    textBox.appendChild(nuevoMensaje);
    textBox.scrollTop = textBox.scrollHeight;
}

function actualizarHP() {
    const pk = equipoJugador[indiceActivoJugador];
    const env = equipoEnemigo[indiceActivoEnemigo];

    if(!pk || !env) return;

    document.getElementById('hpjugador').textContent = pk.hp;
    document.getElementById('hpenemigo').textContent = env.hp;

    const porcJugador = (pk.hp / pk.hpMax) * 100;
    const porcEnemigo = (env.hp / env.hpMax) * 100;

    const barJugador = document.getElementById('hpjugador-bar');
    const barEnemigo = document.getElementById('hpenemigo-bar');
    barJugador.style.width = porcJugador + '%';
    barEnemigo.style.width = porcEnemigo + '%';
    barJugador.className = 'hp-fill'; 
    if (porcJugador > 50) {
        barJugador.classList.add('hp-verde');
    } else if (porcJugador > 20) {
        barJugador.classList.add('hp-amarillo');
    } else {
        barJugador.classList.add('hp-rojo');
    }
    barEnemigo.className = 'hp-fill'; 
    if (porcEnemigo > 50) {
        barEnemigo.classList.add('hp-verde');
    } else if (porcEnemigo > 20) {
        barEnemigo.classList.add('hp-amarillo');
    } else {
        barEnemigo.classList.add('hp-rojo');
    }
}

function actualizarEstadosVisuales() {
    const pk = equipoJugador[indiceActivoJugador];
    const env = equipoEnemigo[indiceActivoEnemigo];

    const elJugador = document.getElementById('estado-jugador');
    const elEnemigo = document.getElementById('estado-enemigo');

    elJugador.textContent = pk.estado ? pk.estado.substring(0, 3) : '';
    elJugador.className = pk.estado ? `status-badge ${pk.estado.toLowerCase()}` : 'status-badge';

    elEnemigo.textContent = env.estado ? env.estado.substring(0, 3) : '';
    elEnemigo.className = env.estado ? `status-badge ${env.estado.toLowerCase()}` : 'status-badge';
}

function verificarGanadorEnemigoODebilitado() {
    const env = equipoEnemigo[indiceActivoEnemigo];
    if (env.hp <= 0) {
        mostrarStatus(`¡${env.nombre} se debilitó!`);
        
        const pk = equipoJugador[indiceActivoJugador];
        const experiencia = Math.floor(Math.random() * 41) + 40;
        let stats = datosGuardados[pk.id];
        stats.exp += experiencia;
        mostrarStatus(`¡${pk.nombre} ganó ${experiencia} de EXP!`);

        if (stats.exp >= 100) {
            stats.nivel += 1;
            stats.exp -= 100;
            stats.hpMaxBonus += 8; 
            stats.dañoBonus += 3;   
            pk.hpMax += 8;
            pk.hp += 8;
            setTimeout(() => {
                mostrarStatus(`¡${pk.nombre} subió al Nivel ${stats.nivel}!`);
            }, 1000);
        }
        localStorage.setItem('pokemon_save_data', JSON.stringify(datosGuardados));

        indiceActivoEnemigo++;
        if (indiceActivoEnemigo >= equipoEnemigo.length) {
            musicaBatalla.pause();
            musicaBatalla.currentTime = 0;
            reproducirMusicaVictoria();
            mostrarStatus(`¡Has derrotado a todo el equipo enemigo! ¡Ganaste la batalla!`);
            setTimeout(() => location.reload(), 6000);
        } else {
            setTimeout(() => {
                mostrarStatus(`El rival va a enviar a ${equipoEnemigo[indiceActivoEnemigo].nombre}.`);
                desplegarPokemonEnemigo();
                setTimeout(() => showActionMenu(), 1500);
            }, 2000);
        }
        return true;
    }
    return false;
}

function verificarJugadorDebilitado() {
    const pk = equipoJugador[indiceActivoJugador];
    if (pk.hp <= 0) {
        mostrarStatus(`¡${pk.nombre} se debilitó!`);
        
        const vivos = equipoJugador.some(p => p.hp > 0);
        if (!vivos) {
            musicaBatalla.pause();
            mostrarStatus(`No te quedan Pokémon utilizables... ¡Has sido derrotado!`);
            setTimeout(() => location.reload(), 4000);
        } else {
            setTimeout(() => {
                mostrarStatus("¡Elige un Pokémon de reemplazo!");
                abrirCambioIntermedio();
            }, 1500);
        }
        return true;
    }
    return false;
}

function huir() {
    mostrarStatus("¡Escapaste de la batalla!");
    setTimeout(() => location.reload(), 2000);
}

function actualizarEnfoqueVisualTeclado() {
    document.querySelectorAll('.menu-option').forEach(opt => opt.classList.remove('keyboard-selected'));
    document.querySelectorAll('.sel-card').forEach(card => card.classList.remove('keyboard-selected-card'));

    if (menuActual === 'seleccion_inicial') {
        const idsIniciales = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'eevee', 'jigglypuff'];
        let llaveActual = idsIniciales[colSeleccionada];
        let targetCard = document.getElementById(`card-${llaveActual}`);
        if (targetCard) targetCard.classList.add('keyboard-selected-card');
    }
    else if (menuActual === 'acciones') {
        let indexMap = (filaSeleccionada * 2) + colSeleccionada;
        let opciones = document.getElementById('action-menu').children;
        if(opciones[indexMap]) opciones[indexMap].classList.add('keyboard-selected');
    } 
    else if (menuActual === 'ataques') {
        let indexMap = (filaSeleccionada * 2) + colSeleccionada;
        let targetBtn = document.getElementById(`atk-opt-${indexMap}`);
        if (targetBtn) targetBtn.classList.add('keyboard-selected');
    } 
    else if (menuActual === 'cambio') {
        let targetCard = document.getElementById(`switch-opt-${colSeleccionada}`);
        if (targetCard) targetCard.classList.add('keyboard-selected-card');
    }
}

window.addEventListener('keydown', function(event) {       
    const elementoActivo = document.activeElement;
    if (elementoActivo && elementoActivo.tagName === 'INPUT' && elementoActivo.type === 'text') {
        return;     }

    if (menuActual === 'ninguno') return; 

    const tecla = event.key.toLowerCase();

    if (tecla === 'w' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (menuActual !== 'cambio' && menuActual !== 'seleccion_inicial' && filaSeleccionada > 0) { 
            filaSeleccionada--; 
            actualizarEnfoqueVisualTeclado(); 
        }
    } 
    else if (tecla === 's' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (menuActual !== 'cambio' && menuActual !== 'seleccion_inicial' && filaSeleccionada < 1) { 
            filaSeleccionada++; 
            actualizarEnfoqueVisualTeclado(); 
        }
    }
    else if (tecla === 'a' || event.key === 'ArrowLeft') {
        event.preventDefault();
        if (colSeleccionada > 0) { 
            colSeleccionada--; 
            actualizarEnfoqueVisualTeclado(); 
        }
    } 
    else if (tecla === 'd' || event.key === 'ArrowRight') {
        event.preventDefault();
        let maxCol = 1; 
        if (menuActual === 'cambio') maxCol = 2;            
        if (menuActual === 'seleccion_inicial') maxCol = 5;  

        if (colSeleccionada < maxCol) { 
            colSeleccionada++; 
            actualizarEnfoqueVisualTeclado(); 
        }
    }
    else if (event.key === 'Enter') {
        event.preventDefault();
        
        if (menuActual === 'seleccion_inicial') {
            const idsIniciales = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'eevee', 'jigglypuff'];
            let llaveActual = idsIniciales[colSeleccionada];
            let targetCard = document.getElementById(`card-${llaveActual}`);
            if (targetCard) {
                targetCard.click(); 
                actualizarEnfoqueVisualTeclado();
            }
        }
        else if (menuActual === 'acciones') {
            let indexMap = (filaSeleccionada * 2) + colSeleccionada;
            if (indexMap === 0) showBattleMenu();
            else if (indexMap === 1) huir();
            else if (indexMap === 2) abrirCambioIntermedio();
            else if (indexMap === 3) AbrirMochila();
        } 
        else if (menuActual === 'ataques') {
            let indexMap = (filaSeleccionada * 2) + colSeleccionada;
            const pk = equipoJugador[indiceActivoJugador];
            if(pk.movimientos[indexMap]) ejecutarAtaque(pk.movimientos[indexMap]);
        }
        else if (menuActual === 'cambio') {
            let targetCard = document.getElementById(`switch-opt-${colSeleccionada}`);
            if (targetCard) targetCard.click();
        }
    }
    else if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        if (menuActual === 'ataques') {
            showActionMenu();
        } 
        else if (menuActual === 'cambio') {
            if (equipoJugador[indiceActivoJugador].hp > 0) {
                document.getElementById('pokemon-selector').style.display = 'none';
                modoCambioCombate = false;
                showActionMenu();
            }
        }
    }
});

actualizarEnfoqueVisualTeclado();
