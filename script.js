const POKEDEX = {
    bulbasaur: {
        nombre: 'BULBASAUR',
        hpMax: 50,
        sprite: 'images/bulbasaur.gif',
        movimientos: [
            { nombre: 'Placaje', daño: [8, 12], sonido: 'audios/tackle.wav' },
            { nombre: 'Hoja Afilada', daño: [12, 18], sonido: 'audios/razorleaf.wav' },
            { nombre: 'Rayo Solar', daño: [15, 20], sonido: 'audios/solarbeam.wav' },
            { nombre: 'Síntesis', cura: [10, 15], sonido: 'audios/synthesis.wav' }
        ]
    },
    charmander: {
        nombre: 'CHARMANDER',
        hpMax: 45,
        sprite: 'images/charmander.gif',
        movimientos: [
            { nombre: 'Arañazo', daño: [7, 10], sonido: 'audios/scratch.wav' },
            { nombre: 'Ascuas', daño: [10, 15], sonido: 'audios/ember.wav' },
            { nombre: 'Lanzallamas', daño: [18, 25], sonido: 'audios/flamethrower.wav' },
            { nombre: 'Gruñido', daño: [2, 5], sonido: 'audios/growl.mp3' }
        ]
    },
    squirtle: {
        nombre: 'SQUIRTLE',
        hpMax: 55,
        sprite: 'images/squirtle.gif',
        movimientos: [
            { nombre: 'Placaje', daño: [8, 12], sonido: 'audios/tackle.wav' },
            { nombre: 'Burbuja', daño: [10, 14], sonido: 'audios/Bubble.wav' },
            { nombre: 'Pistola Agua', daño: [14, 20], sonido: 'audios/WaterGun.wav' },
            { nombre: 'Refugio', cura: [5, 10], sonido: 'audios/Withdraw.wav' }
        ]
    }
};

let pokemonActivo = null;
let hpJugador = 0;
let hpEnemigo = 50;
const hpEnemigoMax = 50;

function seleccionarPokemon(nombrePokemon) {
    pokemonActivo = POKEDEX[nombrePokemon];
    hpJugador = pokemonActivo.hpMax;
    hpEnemigo = hpEnemigoMax;

    document.getElementById('nombre-jugador').textContent = pokemonActivo.nombre;
    document.getElementById('sprite-jugador').src = pokemonActivo.sprite;
    document.getElementById('pokemon-selector').style.display = 'none';
    
    actualizarHP();
    iniciarJuego();
}

function iniciarJuego() {
    mostrarStatus(`¡Un ZOROARK salvaje apareció!`);
    setTimeout(() => {
        showActionMenu();
    }, 2000);
}

function reproducirSonido(ruta) {
    const audio = new Audio(ruta);
    audio.play().catch(e => {});
}

function showBattleMenu() {
    document.getElementById('action-menu').style.display = 'none';
    const battleMenu = document.getElementById('battle-menu');
    battleMenu.style.display = 'grid';
    battleMenu.innerHTML = '';

    pokemonActivo.movimientos.forEach(mov => {
        const btn = document.createElement('div');
        btn.className = 'menu-option';
        btn.textContent = mov.nombre.toUpperCase();
        btn.onclick = () => ejecutarAtaque(mov);
        battleMenu.appendChild(btn);
    });

    mostrarStatus('¿Qué ataque usar?');
}

function ejecutarAtaque(movimiento) {
    document.getElementById('battle-menu').style.display = 'none';
    reproducirSonido(movimiento.sonido);
    
    mostrarStatus(`¡${pokemonActivo.nombre} usó ${movimiento.nombre.toUpperCase()}!`);

    setTimeout(() => {
        if (movimiento.daño) {
            const daño = Math.floor(Math.random() * (movimiento.daño[1] - movimiento.daño[0] + 1)) + movimiento.daño[0];
            hpEnemigo = Math.max(0, hpEnemigo - daño);
        }
        if (movimiento.cura) {
            const cura = Math.floor(Math.random() * (movimiento.cura[1] - movimiento.cura[0] + 1)) + movimiento.cura[0];
            hpJugador = Math.min(pokemonActivo.hpMax, hpJugador + cura);
        }

        actualizarHP();
        if (verificarGanador()) return;

        setTimeout(turnoEnemigo, 1500);
    }, 1000);
}

function actualizarHP() {
    document.getElementById('hpjugador').textContent = hpJugador;
    document.getElementById('hpenemigo').textContent = hpEnemigo;

    const porcJugador = (hpJugador / pokemonActivo.hpMax) * 100;
    const porcEnemigo = (hpEnemigo / hpEnemigoMax) * 100;

    document.getElementById('hpjugador-bar').style.width = porcJugador + '%';
    document.getElementById('hpenemigo-bar').style.width = porcEnemigo + '%';
}

function turnoEnemigo() {
    const daño = Math.floor(Math.random() * 11) + 5;
    hpJugador = Math.max(0, hpJugador - daño);
    actualizarHP();
    
    mostrarStatus(`¡ZOROARK usó ATAQUE NORMAL! Recibes ${daño} de daño.`);

    setTimeout(() => {
        if (!verificarGanador()) showActionMenu();
    }, 2000);
}

function showActionMenu() {
    document.getElementById('battle-menu').style.display = 'none';
    document.getElementById('action-menu').style.display = 'grid';
    mostrarStatus(`¿Qué debe hacer ${pokemonActivo.nombre}?`);
}

function mostrarStatus(texto) {
    document.getElementById('status').textContent = texto;
}

function verificarGanador() {
    if (hpEnemigo <= 0) {
        mostrarStatus('¡ZOROARK se debilitó! ¡Ganaste!');
        setTimeout(() => location.reload(), 3000);
        return true;
    }
    if (hpJugador <= 0) {
        mostrarStatus(`¡${pokemonActivo.nombre} se debilitó! Perdiste...`);
        setTimeout(() => location.reload(), 3000);
        return true;
    }
    return false;
}

function huir() {
    mostrarStatus("¡Escapaste de la batalla!");
    setTimeout(() => location.reload(), 2000);
}

let volumenGlobal = 0.5;

document.getElementById('volume-slider').addEventListener('input', (e) => {
    volumenGlobal = e.target.value;
});

function reproducirSonido(ruta) {
    const audio = new Audio(ruta);
    audio.volume = volumenGlobal;
    audio.play().catch(e => {});
}