let hpjugador1 = 50;
let hpenemigo = 50;
const hpMax = 50;

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function actualizarHP() {
    document.getElementById('hpjugador1').textContent = hpjugador1;
    document.getElementById('hpenemigo').textContent = hpenemigo;
}

function mostrarStatus(texto) {
    const status = document.getElementById('status');
    status.textContent = texto;
}

function verificarGanador() {
    if (hpjugador1 <= 0) {
        alert('¡Has perdido!');
        resetearJuego();
        return true;
    }
    if (hpenemigo <= 0) {
        alert('¡Has ganado!');
        resetearJuego();
        return true;
    }
    return false;
}

function ataqueEnemigo(modificador = 1) {
    const daño = Math.max(0, Math.floor(getRandom(5, 15) * modificador));
    hpjugador1 = Math.max(0, hpjugador1 - daño);
    return daño;
}

function ejecutarMovimiento(nombre, dañoJugador, curacionJugador = 0, enemigoModificador = 1) {
    hpenemigo = Math.max(0, hpenemigo - dañoJugador);
    hpjugador1 = Math.min(hpMax, hpjugador1 + curacionJugador);
    actualizarHP();

    if (verificarGanador()) {
        return;
    }

    const dañoEnemigo = ataqueEnemigo(enemigoModificador);
    actualizarHP();
    mostrarStatus(`${nombre}: hiciste ${dañoJugador} de daño${curacionJugador ? ` y recuperaste ${curacionJugador} HP` : ''}. El enemigo te hace ${dañoEnemigo}.`);
    verificarGanador();
}

function placaje() {
    ejecutarMovimiento('Placaje', getRandom(8, 12));
}

function lanzallamas() {
    ejecutarMovimiento('Lanzallamas', getRandom(12, 18));
}

function rayoSolar() {
    const daño = getRandom(10, 16);
    const cura = getRandom(3, 7);
    ejecutarMovimiento('Rayo Solar', daño, cura);
}

function defensa() {
    const curacion = getRandom(5, 10);
    hpenemigo = Math.max(0, hpenemigo - 3);
    hpjugador1 = Math.min(hpMax, hpjugador1 + curacion);
    actualizarHP();
    if (verificarGanador()) {
        return;
    }
    const dañoEnemigo = ataqueEnemigo(0.5);
    actualizarHP();
    mostrarStatus(`Defensa: recuperaste ${curacion} HP y el enemigo golpea con la mitad de daño (${dañoEnemigo}).`);
    verificarGanador();
}

function resetearJuego() {
    hpjugador1 = hpMax;
    hpenemigo = hpMax;
    actualizarHP();
    mostrarStatus('El combate se ha reiniciado. Elige un movimiento.');
}

function iniciarJuego() {
    resetearJuego();
    alert('¡Bienvenido a la batalla Pokémon! Elige tu movimiento.');
}

window.onload = iniciarJuego;
