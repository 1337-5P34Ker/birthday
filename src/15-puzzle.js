const ipc = require('electron').ipcRenderer
const btnQuit = document.getElementById('quit')
	btnQuit.addEventListener('click', function (event) {
		ipc.send('quit')
	})

/**
 * 15-puzzle.js
 *
 * Copyright (c) 2015 Arnis Ritins
 * Released under the MIT license
 */
(function () {

	

	var state = 1;
	var puzzle = document.getElementById('puzzle');
	// Listens for click on puzzle cells
	puzzle.addEventListener('click', function (e) {
		if (state == 1) {
			// Enables sliding animation
			puzzle.className = 'animate';
			verschieben(e.target);
		}
	});

	// Erstelle gelöstes Puzzle
	loesen();

	

	// Listens for click on control buttons
	document.getElementById('solve').addEventListener('click', loesen);
	document.getElementById('scramble').addEventListener('click', mischen);
	document.getElementById('quit').addEventListener('click', quit);

	function quit() {
		app.quit();
	}

	/**
	 * Creates solved puzzle
	 *
	 */
	function loesen() {

		if (state == 0) {
			return;
		}

		puzzle.innerHTML = '';

		var n = 1;
		for (var i = 0; i <= 3; i++) {
			for (var j = 0; j <= 3; j++) {
				var cell = document.createElement('span');
				cell.id = 'cell-' + i + '-' + j;
				cell.style.left = (j * 80 + 1 * j + 1) + 'px';
				cell.style.top = (i * 80 + 1 * i + 1) + 'px';

				if (n <= 15) {
					cell.classList.add('number');
					cell.classList.add((i % 2 == 0 && j % 2 > 0 || i % 2 > 0 && j % 2 == 0) ? 'dark' : 'light');
					cell.innerHTML = (n++).toString();
				} else {
					cell.className = 'empty';
				}

				puzzle.appendChild(cell);
			}
		}

	}

	/**
	 * Verschiebe Kachel in Richtung Loch
	 * 
	 */
	function verschieben(cell) {

		// Teste, ob die angeklickte Kachel die leere ist.
		if (cell.clasName != 'empty') {

			// Versuche,ob eine benachbarte Kachel leer ist
			var leereKachel = holeLeereBenachbarteKachel(cell);

			if (leereKachel) {
				// Zwischenspeichern
				var tmp = {
					style: cell.style.cssText,
					id: cell.id
				};

				// Austausch von ID und Werten
				cell.style.cssText = leereKachel.style.cssText;
				cell.id = leereKachel.id;
				leereKachel.style.cssText = tmp.style;
				leereKachel.id = tmp.id;

				if (state == 1) {
					// Test, ob Kacheln wieder in der richtigen Reihenfolge sind.
					ueberpruefeReihenfolge();
				}
			}
		}

	}

	/**
	 * Gets specific cell by row and column
	 *
	 */
	function holeKachel(row, col) {

		return document.getElementById('cell-' + row + '-' + col);

	}

	/**
	 * Hole die leere Kachel
	 *
	 */
	function holeLeereKachel() {
		return puzzle.querySelector('.empty');
	}

	/**
	 * Hole die leere benachbarte Kachel, wenn vorhanden.
	 *
	 */
	function holeLeereBenachbarteKachel(cell) {

		// Hole alle benachbarten Kacheln
		var benachbarte = holeBenachbarteKacheln(cell);

		// Suche die leere Kachel
		for (var i = 0; i < benachbarte.length; i++) {
			if (benachbarte[i].className == 'empty') {
				return benachbarte[i];
			}
		}

		// Leere Kachel nicht dabei
		return false;

	}

	/**
	 * Hole benachbarte Kacheln
	 * 
	 *
	 */
	function holeBenachbarteKacheln(cell) {

		var id = cell.id.split('-');

		// Aktuelle Position
		var reihe = parseInt(id[1], 10);
		var spalte = parseInt(id[2], 10);

		var benachbarteKacheln = [];

		// Hole alle möglichen benachbarten Kacheln
		if (reihe < 3) {
			benachbarteKacheln.push(holeKachel(reihe + 1, spalte));
		}
		if (reihe > 0) {
			benachbarteKacheln.push(holeKachel(reihe - 1, spalte));
		}
		if (spalte < 3) {
			benachbarteKacheln.push(holeKachel(reihe, spalte + 1));
		}
		if (spalte > 0) {
			benachbarteKacheln.push(holeKachel(reihe, spalte - 1));
		}

		return benachbarteKacheln;

	}

	/**
	 * Chechs if the order of numbers is correct
	 *
	 */
	function ueberpruefeReihenfolge() {

		// Prüfe, ob die leere Kachel rechts unten ist.
		if (holeKachel(3, 3).className != 'empty') {
			return;
		}

		var n = 1;
		// Geh durch alle Kacheln und überprüfe die Werte
		for (var i = 0; i <= 3; i++) {
			for (var j = 0; j <= 3; j++) {
				if (n <= 15 && holeKachel(i, j).innerHTML != n.toString()) {
					// Kachel stimmt nicht
					return;
				}
				n++;
			}
		}

		// Puzzle is solved, offers to scramble it
		if (confirm('Congrats, You did it! \nScramble the puzzle?')) {
			mischen();
		}

	}

	/**
	 * Mische puzzle
	 *
	 */
	function mischen() {

		if (state == 0) {
			return;
		}

		puzzle.removeAttribute('class');
		state = 0;

		var vorhergehendeKachel;
		var i = 1;
		var interval = setInterval(function () {
			if (i <= 100) {
				var leereKachel = holeLeereKachel();
				var benachbarte = holeBenachbarteKacheln(leereKachel);
				if (vorhergehendeKachel) {
					for (var j = benachbarte.length - 1; j >= 0; j--) {
						if (benachbarte[j].innerHTML == vorhergehendeKachel.innerHTML) {
							benachbarte.splice(j, 1);
						}
					}
				}
				// Gets random adjacent cell and memorizes it for the next iteration
				vorhergehendeKachel = benachbarte[rand(0, benachbarte.length - 1)];
				verschieben(vorhergehendeKachel);
				i++;
			} else {
				clearInterval(interval);
				state = 1;
			}
		}, 5);

	}

	/**
	 * Generiere Zufallszahl
	 *
	 */
	function rand(von, bis) {

		return Math.floor(Math.random() * (bis - von + 1)) + von;

	}

}());