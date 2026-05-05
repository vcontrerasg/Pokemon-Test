let hpjugador1 = 50;
let hpenemigo = 50;
const hpMax = 50;
let currentMenu = 'action';

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function actualizarHP() {
    document.getElementById('hpjugador1').textContent = hpjugador1;
    document.getElementById('hpenemigo').textContent = hpenemigo;

    const porcentajeJugador = (hpjugador1 / hpMax) * 100;
    const porcentajeEnemigo = (hpenemigo / hpMax) * 100;

    document.getElementById('hpjugador1-bar').style.width = porcentajeJugador + '%';
    document.getElementById('hpenemigo-bar').style.width = porcentajeEnemigo + '%';
}

function mostrarStatus(texto, blink = false) {
    const status = document.getElementById('status');
    status.textContent = texto;
    status.classList.toggle('blink', blink);
}

function verificarGanador() {
    if (hpjugador1 <= 0) {
        setTimeout(() => {
            mostrarStatus('¡BULBASAUR se debilitó!');
            setTimeout(() => {
                alert('¡Has perdido!');
                resetearJuego();
            }, 2000);
        }, 1000);
        return true;
    }
    if (hpenemigo <= 0) {
        setTimeout(() => {
            mostrarStatus('¡ZOROARK se debilitó!');
            setTimeout(() => {
                alert('¡Has ganado!');
                resetearJuego();
            }, 2000);
        }, 1000);
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
    document.getElementById('battle-menu').style.display = 'none';

    mostrarStatus(`¡BULBASAUR usó ${nombre.toUpperCase()}!`);

    setTimeout(() => {
        hpenemigo = Math.max(0, hpenemigo - dañoJugador);
        hpjugador1 = Math.min(hpMax, hpjugador1 + curacionJugador);
        actualizarHP();

        if (verificarGanador()) {
            return;
        }

        setTimeout(() => {
            const dañoEnemigo = ataqueEnemigo(enemigoModificador);
            actualizarHP();

            mostrarStatus(`¡ZOROARK usó ATAQUE NORMAL! BULBASAUR recibió ${dañoEnemigo} puntos de daño.`);

            setTimeout(() => {
                verificarGanador();
                showActionMenu();
            }, 2000);
        }, 1500);
    }, 1000);
}

function showActionMenu() {
    document.getElementById('action-menu').style.display = 'none';
    document.getElementById('battle-menu').style.display = 'none';
    document.getElementById('action-menu').style.display = 'grid';
    currentMenu = 'action';
    mostrarStatus('¿Qué debe hacer BULBASAUR?');
}

function showBattleMenu() {
    document.getElementById('action-menu').style.display = 'none';
    document.getElementById('battle-menu').style.display = 'grid';
    currentMenu = 'battle';
    mostrarStatus('¿Qué ataque usar?');
}

function placaje() {
    ejecutarMovimiento('PLACAJE', getRandom(8, 12));
}

function lanzallamas() {
    ejecutarMovimiento('LANZALLAMAS', getRandom(12, 18));
}

function rayoSolar() {
    const daño = getRandom(10, 16);
    const cura = getRandom(3, 7);
    ejecutarMovimiento('RAYO SOLAR', daño, cura);
}

function defensa() {
    const curacion = getRandom(5, 10);
    hpenemigo = Math.max(0, hpenemigo - 3);
    hpjugador1 = Math.min(hpMax, hpjugador1 + curacion);
    actualizarHP();

    // Ocultar menú de batalla
    document.getElementById('battle-menu').style.display = 'none';

    mostrarStatus(`¡BULBASAUR usó DEFENSA! Recuperó ${curacion} PS.`);

    setTimeout(() => {
        if (verificarGanador()) {
            return;
        }

        // Ataque del enemigo con reducción
        setTimeout(() => {
            const dañoEnemigo = ataqueEnemigo(0.5);
            actualizarHP();

            mostrarStatus(`¡ZOROARK usó ATAQUE NORMAL! BULBASAUR recibió ${dañoEnemigo} puntos de daño.`);

            setTimeout(() => {
                verificarGanador();
                showActionMenu();
            }, 2000);
        }, 1500);
    }, 1000);
}

function resetearJuego() {
    hpjugador1 = hpMax;
    hpenemigo = hpMax;
    actualizarHP();
    showActionMenu();
}

function iniciarJuego() {
    resetearJuego();
    mostrarStatus('¡Un ZOROARK salvaje apareció!');
    setTimeout(() => {
        showActionMenu();
    }, 2000);
}

window.onload = iniciarJuego;
