






	

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
	//document.getElementById('solve').addEventListener('click', loesen);
	document.getElementById('go').addEventListener('click', () =>{
		var audio = new Audio('../assets/audio/button.mp3');
		audio.play();
		mischen();});
	// document.getElementById('exit').addEventListener('click', quit);

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
		for (var i = 0; i <= 4; i++) {
			for (var j = 0; j <= 4; j++) {
				var cell = document.createElement('span');
				cell.id = 'cell-' + i + '-' + j;
				cell.style.left = (j * 80 + 1 * j + 1) + 'px';
				cell.style.top = (i * 80 + 1 * i + 1) + 'px';

				if (n <= 24) {
					cell.classList.add('number');
					cell.classList.add('f-' + n);
					//cell.innerHTML = (n++).toString();
					n++;
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
		if (cell.className != 'empty') {

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
		if (reihe < 4) {
			benachbarteKacheln.push(holeKachel(reihe + 1, spalte));
		}
		if (reihe > 0) {
			benachbarteKacheln.push(holeKachel(reihe - 1, spalte));
		}
		if (spalte < 4) {
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

		// // Prüfe, ob die leere Kachel rechts unten ist.
		// if (holeKachel(4, 4).className != 'empty') {
		// 	return false;
		// }

		var n = 1;
		// Geh durch alle Kacheln und überprüfe die Werte
		for (var i = 0; i <= 4; i++) {
			for (var j = 0; j <= 4; j++) {
				if (n <= 24 && holeKachel(i, j).className.indexOf(`f-${n}`) == -1) {
					// Kachel stimmt nicht
					return;
				}
				n++;
			}
		}

		// Alles richtig
		
		var superElement = document.getElementById('super');
		superElement.setAttribute('style', 'display:block');
		var audio = new Audio('../assets/audio/applause.mp3');
		audio.play();	
			window.setTimeout( () =>{			
				superElement.setAttribute('style', 'display:none');				
				aktuellesBild++;
				var neuesBild = aktuellesBild < bilder.length ? aktuellesBild : 0;
				setzeBild(neuesBild);
				mischen();
			},8000);
			
		

	}

	/**  Mische puzzle */
	function mischen() {

		if (state == 0) {
			return;
		}

		puzzle.removeAttribute('class');
		state = 0;

		var audio = new Audio('../assets/audio/move.mp3');
			

		var i = 1;
		var interval = setInterval(function () {
			if (i <= 100) {
				var leereKachel = holeLeereKachel();
				var benachbarte = holeBenachbarteKacheln(leereKachel);
				benachbarteKachel = benachbarte[rand(0, benachbarte.length - 1)];
				verschieben(benachbarteKachel);
				audio.play();
				i++;
			} else {
				clearInterval(interval);
				state = 1;
			}
		}, 70);
	}

	/**  Generiere Zufallszahl */
	function rand(von, bis) {
		return Math.floor(Math.random() * (bis - von + 1)) + von;
	}



