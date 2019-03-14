//some sample data
const guestData = [ { email: 'asiemer@hotmail.com', name: 'Andy Siemer', notes: 'hey there' } ];

//the database reference
let db;

//initializes the database
function initDatabase() {
	//create a unified variable for the browser variant
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

	//if a variant wasn't found, let the user know
	if (!window.indexedDB) {
		window.alert("Your browser doesn't support a stable version of IndexedDB.");
	}

	//attempt to open the database
	let request = window.indexedDB.open('guestbook', 1);
	request.onerror = function(event) {
		console.log(event);
	};

	//map db to the opening of a database
	request.onsuccess = function(event) {
		db = request.result;
		console.log('success: ' + db);
	};

	//if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
		var db = event.target.result;
		var objectStore = db.createObjectStore('guests', { keyPath: 'email' });

		for (var i in guestData) {
			objectStore.add(guestData[i]);
		}
	};
}
function readAll() {
	var objectStore = db.transaction('guests').objectStore('guests');

	//creates a cursor which iterates through each record
	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;

		if (cursor) {
			console.log('Name: ' + cursor.value.name + ', Email: ' + cursor.value.email);
			addEntry(cursor.value.name, cursor.value.email, cursor.value.notes);
			cursor.continue();
		} else {
			console.log('No more entries!');
		}
	};
}

function add() {
	var name = document.querySelector('#first').value + ' ' + document.querySelector('#last').value;
	var email = document.querySelector('#email').value;
	var notes = document.querySelector('#notes').value;

	console.log(name + email + notes);
	var request = db
		.transaction([ 'guests' ], 'readwrite')
		.objectStore('guests')
		.add({ name: name, email: email, notes: notes });
	clearList();
	readAll();
}
function addEntry(name, email, notes) {
	// Your existing code unmodified...
	var iDiv = document.createElement('div');
	iDiv.className = 'entry';
	iDiv.innerHTML = name + ' ' + email + '<BR>' + notes + '<HR>';
	document.querySelector('#entries').appendChild(iDiv);
}
function clearList() {
	document.querySelector('#entries').innerHTML = '';
}
initDatabase();
readAll();
