

  // IndexedDB
  var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
  IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
  dbVersion = 1.0;


  

/**************  Gyroskop ***********/

 document.getElementById("butBilder").addEventListener("click",initACC);

 function initACC(){
   console.log("initACC läuft..")
if (window.DeviceMotionEvent == undefined) {
	//No accelerometer is present. Use buttons. 
	document.querySelector("#acc").textContent = "NO";
	document.querySelector("#acc").className = "no";

}
else {
	document.querySelector("#acc").textContent = "YES";
	document.querySelector("#acc").className = "yes";
	window.addEventListener("devicemotion", accelerometerUpdate, true);
}


function accelerometerUpdate(event) {
   var aX = event.accelerationIncludingGravity.x*10;
   var aY = event.accelerationIncludingGravity.y*10;
   var aZ = event.accelerationIncludingGravity.z*10;

	document.querySelector("#x").value = aX;
	document.querySelector("#y").value = aY;
	document.querySelector("#z").value = aZ;

	// ix aY is negative, switch rotation
	if (aY <0) {
		aX = -aX - 180;
	}
	document.querySelector("#block").style.transform="rotate("+aX+"deg)";

}

 }
/*******************Gyroskop Ende */



// Bild Auswählen und Vorschau

var loadFile = function(event) {
  var output = document.getElementById('output');
  output.src = URL.createObjectURL(event.target.files[0]);
};

/*********Dienstag mit Localforage speichern!! */

document.getElementById("files").addEventListener("click",loadTuesday);


function loadTuesday(){
        
  //Check File API support
  if(window.File && window.FileList && window.FileReader)
  {
      var filesInput = document.getElementById("files");
      
      filesInput.addEventListener("change", function(event){
          
          var files = event.target.files; //FileList object
          var output = document.getElementById("result");
          
          for(var i = 0; i< files.length; i++)
          {
              var tue = files[i];
              
              var tueU = document.getElementById("output");
              tueU.src = URL.createObjectURL(files[i]);
              console.log(tueU)
              
              

              IndexSave(tueU, i);    
              
                
              
              //Only pics
              if(!tue.type.match('image'))
                continue;
              
              var picReader = new FileReader();
              
              picReader.addEventListener("load",function(event){
                  
                  var picFile = event.target;


                  
                  var div = document.createElement("div");

               
                  
                  div.innerHTML = "<img class='picture' id='iPIC' src='" + picFile.result + "'" +
                  "title=" + picFile.name +  "'/>";
            
                  output.insertBefore(div,null);            
              
              });
              
               //Read the image
              picReader.readAsDataURL(tue);
             
              var tmp = i +1;

              console.log("Bild" + tmp );
              console.log(tue);
              
              
          
            }    
                                    
         
      });
  }
  else
  {
      console.log("Your browser does not support File API");
  }
}



function IndexSave (bild, count)
{
  
      
      // IndexedDB
      var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
          IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
          dbVersion = 1.0;
  
          var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;
          var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
          var openCopy = indexedDB && indexedDB.open;
          
          var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
          
          if (IDBTransaction)
          {
          IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
          IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
          };
  
      var MasTuesdayURL = bild.src;
      console.log(MasTuesdayURL);
  
  
  
      // Create/open database
      var request = indexedDB.open("Woche", dbVersion),
          db,
          createObjectStore = function (dataBase) {
              // Create an objectStore
          
  
              dataBase.createObjectStore("Bilder");
          },
  
          getImageFile = function () {
              // Create XHR
              
  
  
              var xhr = new XMLHttpRequest(),
                  blob;
  
                  
  
              xhr.open("GET", MasTuesdayURL, true);
              // Set the responseType to blob
              xhr.responseType = "blob";
  
              xhr.addEventListener("load", function () {
                  if (xhr.status === 200) {
               
                      
                      // Blob as response
                      blob = xhr.response;
                   
  
                      // Put the received blob into IndexedDB
                      putTuesdayInDb(blob);
                  }
              }, false);
              // Send XHR
              xhr.send();
          },
  
          putTuesdayInDb = function (blob) {
            
  
              // Open a transaction to the database
              var transaction = db.transaction(["Bilder"], IDBTransaction.READ_WRITE);
  
              // Put the blob into the dabase
              count = count+ 1;

              var put = transaction.objectStore("Bilder").put(blob, "Bild: " + count);
  
       
       
          };
  
  
  
      request.onerror = function (event) {
     
      };
  
      request.onsuccess = function (event) {
      
          db = request.result;
  
          db.onerror = function (event) {
      
          };
          
          // Interim solution for Google Chrome to create an objectStore. Will be deprecated
          if (db.setVersion) {
              if (db.version != dbVersion) {
                  var setVersion = db.setVersion(dbVersion);
                  setVersion.onsuccess = function () {
                      createObjectStore(db);
                      getImageFile();
                  };
              }
              else {
                  getImageFile();
              }
          }
          else {
              getImageFile();
          }
      }

      
      // For future use. Currently only in latest Firefox versions
      request.onupgradeneeded = function (event) {
          createObjectStore(event.target.result);
      };
      
  };


/**********************Dienstag einzeigen */

document.getElementById("ShowTuesday").addEventListener("click",sPictureTue);


function sPictureTue () {



var request = indexedDB.open("Woche", dbVersion),
db;


request.onsuccess = function (event) 
{
    console.log("Success creating/accessing IndexedDB database");
    db = request.result;


        

   var transaction = db.transaction(["Bilder"], IDBTransaction.READ);
   

               transaction.objectStore("Bilder").getAll().onsuccess = function (event) 
  {


  var imgTueFile = event.target.result;
  var output = document.getElementById("result");


  for(var i = 0; i< imgTueFile.length; i++)
  {
      var tue = imgTueFile[i];
      
      var sTUE = document.getElementById("output");
      sTUE.src = URL.createObjectURL(imgTueFile[i]);


      //Only pics
      if(!tue.type.match('image'))
        continue;
      
      var picReader = new FileReader();
      
      picReader.addEventListener("load",function(event){
          
          var picFile = event.target;

          
          var div = document.createElement("div");
         
          div.innerHTML = "<img class='picture' id='iPIC' src='" + picFile.result + "'" +
                  "title='" + picFile.name + "'/>";
         
        

          output.insertBefore(div, null);            
      
      });
      
       //Read the image

       
      picReader.readAsDataURL(tue); 
      
      console.log(tue);

  
    }      

};            
};                      
};



/**********Dienstag Ende ****************/


/********************DeleteALL */

document.getElementById("deleteALL").addEventListener("click",DELETE);

function DELETE ()
{

var DBOpenRequest = window.indexedDB.open("Woche", dbVersion);

DBOpenRequest.onsuccess = function(event) {

  db = DBOpenRequest.result;

  clearData();
  console.log("Bilder wurden gelöscht");
  location.reload();
};

function clearData() {
  

  var transaction = db.transaction(["Bilder"], "readwrite");


  transaction.oncomplete = function(event) {

  };

  transaction.onerror = function(event) {

  };


  var objectStore = transaction.objectStore("Bilder");

  var objectStoreRequest = objectStore.clear();

  objectStoreRequest.onsuccess = function(event) {

  };
};
}

/*******Notes *******************/


var todoDB = (function() {
  // tDB = {object}
  var tDB = {};
  var datastore = null;

 
  tDB.open = function(callback) {
    console.log("tDB.open = function(callback) ");
    // Database version.
    var version = 1;

    // Verbindung zum Store
    var request = indexedDB.open('Notes', version);

    // Handlet upgrades
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;

      // löscht den alten
      if (db.objectStoreNames.contains('todo')) {
        db.deleteObjectStore('todo');
      }



      // es muss "keyPathi" benutzt werden, da es mir nur möglich war den ObjectStore zu löschen,
      // wenn der ObjectStore name nur Ziffern enthält -> Zusatz: entsteht immer eine andere Nummer!
      // line 500: var keyPathi = new Date().getTime();

      var store = db.createObjectStore('todo', {
        keyPath: 'keyPathi' 
      }
    );
    };

    // Erfolgreich
    request.onsuccess = function(e) {
      // Referenz zur Database
      datastore = e.target.result;
   
      callback();
      console.log("callback() // request onsuccess");
    };

    // Handlet Errors.
    request.onerror = tDB.onerror;
  };


 
  tDB.fetchTodos = function(callback) {
    console.log("tDB.fetchTodos = function(callback)");
    var db = datastore;
    var transaction = db.transaction(['todo'], 'readwrite');
    var objStore = transaction.objectStore('todo');

//__________________________________________________________//

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

//_______________________________________________________//


    var todos = [];

    transaction.oncomplete = function(e) {
    
      resetImage();
      callback(todos);
      console.log("callback(todos)");
      
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      todos.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = tDB.onerror;
  };



  tDB.createTodo = function(text , callback) {
    console.log("tDB.createTodo = function(text , callback)")
    
    var db = datastore;

    // Neue Transaktion
    var transaction = db.transaction(['todo'], 'readwrite');

    // Holt den ObjectStore
    var objStore = transaction.objectStore('todo');

  
    // Datum und Uhrzeit als Timestamp festlegen

    var dNow = new Date();
    var timestamp = 'Added:  ' + dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ' ' + 
    dNow.getHours() + ':' + dNow.getMinutes() + ':' + dNow.getSeconds();
   
    var keyPathi = new Date().getTime();
    


    // Object für das todo item -> neu /-> 'date' : timestamp
// bild als base64 Speichern

  var blob = document.getElementById("outImage").src;
  
// var tmp = blob;

 if(blob == 0)
 {
   blob = "kein Bild hinzugefügt"
 }


// var tmp = blob;
    var todo = {
      'text': text,
      'date': timestamp,
      'keyPathi': keyPathi,
      'image' : blob,
    };
 


    var request = objStore.put(todo);

    
    request.onsuccess = function(e) {
            callback(todo);
            console.log("callback(todo)");
            
               
    };
    // Schlecht...->
    request.onerror = tDB.onerror;
  };




  tDB.deleteTodo = function(keyPathi, callback) {
    console.log("tDB.deleteTodo = function(keyPathi, callback)");
    var db = datastore;
    var transaction = db.transaction(['todo'], 'readwrite');
    var objStore = transaction.objectStore('todo');



    var request = objStore.delete(keyPathi);
    
    request.onsuccess = function(e) {
      callback();
      console.log("callback() // bei erfolgreichem löschen");
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  // Exportiert das tDB Object.
  return tDB;
}());



window.onload = function() {
  
  // anzeigen der todo items
  todoDB.open(refreshTodos);
  
  
  // referenzierung zu den "form"-elementen
  var newTodoForm = document.getElementById('new-todo-form');
  var newTodoInput = document.getElementById('new-todo');
  var todoImg = document.getElementById('todoImg');
  
// FileReader hinzufügen

  document.getElementById('todoImg').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById("outImage").src = fr.result;
    
            
                   
        }
        fr.readAsDataURL(files[0]);
      }
         
}

  
  // Hanlder {{Einreichen einer neuen todo form}}
  newTodoForm.onsubmit = function() {
    // Holt den Text
    var text = newTodoInput.value;
    
    // nicht nichts
    if (text.replace(/ /g,'') != '') {
      // erstellen des todo- items
      todoDB.createTodo(text, function(todo) {
        refreshTodos();
      });
    }
    
    // Setzt Eingabe-Feld auf "0"
    newTodoInput.value = '';
    
    // schlecht ->
    return false;
  };
  
}

// updated die Liste
function refreshTodos() {  
  todoDB.fetchTodos(function(todos) {
    var todoList = document.getElementById('todo-items');
    todoList.innerHTML = '';
    
    for(var i = 0; i < todos.length; i++) {

      // ____________________________________________________

      var todo = todos[(todos.length - 1 - i)];
      console.log(todo);
      var keyPathi = todos[(todos.length - 1 - i)];
//___________________________________________________
      var li = document.createElement('li');


      
      var span = document.createElement('span');

// span für Timestamp erstellen

      var spanTime = document.createElement('spanTime');

      var checkbox = document.createElement('input');

      checkbox.type = "checkbox";

      checkbox.className = "todo-checkbox";

      checkbox.label = "Delete"

      checkbox.setAttribute("data-id", todo.keyPathi);

// Um Bilder anzuzeigen
// span für Image erstellen

var spanImageUrl = document.createElement('spanImageUrl');



spanImageUrl.innerHTML = todo.image;

console.log(spanImageUrl.innerHTML);

var tmp = spanImageUrl.innerHTML;

console.log(tmp);


if(tmp == "kein Bild hinzugefügt")
{
  var check = document.createElement('check');
  check.innerHTML = tmp;
}
else
{

      var check = document.createElement('img');

      check.type = "image";

      check.src = spanImageUrl.innerHTML;

      check.label = "image"

}     

   

// span befüllen
        span.innerHTML = todo.text;
  
      spanTime.innerHTML = todo.date;

      


       
      li.appendChild(span);
      
     li.appendChild(checkbox);

     li.appendChild(check);


     li.appendChild(spanTime);

      todoList.appendChild(li);

      
      
      // Erstellen eines event listeners für die checkbox
      checkbox.addEventListener('click', function(e) {
        var keyPathi = parseInt(e.target.getAttribute('data-id'));

        todoDB.deleteTodo(keyPathi, refreshTodos);
      });
    }

  });
};

//*******
// Bild danach wieder entfernen können

function resetImage(){
  document.getElementById("outImage").value = '';
  document.getElementById("todoImg").value = '';
}


//*******



/*******Notes Ende *******************/


// Overlays:


function overlayLocation() {
  el = document.getElementById("overlayLocation");
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
};
function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
};
function overlayAlbum() {
	el = document.getElementById("overlayAlbum");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
};

function overlayMontag() {
  el = document.getElementById("overlayMontag");
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
};
function overlayDienstag() {
  el = document.getElementById("overlayDienstag");
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
};
function overlayNotes() {
  el = document.getElementById("overlayNotes");
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
};

/**************IndexedDB Bilder */




/***************Montag einspeichern */

// aus indexeddb herausholen *******************************************








/******************************************************************* */
             

(function() {
  'use strict';
  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    cameraDialog: document.querySelector('.camera-container'),
    BilderDialog: document.querySelector('.Bilder-Conatiner'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  

  };






  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateForecasts();
  });

  document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });

  document.getElementById('butAddCity').addEventListener('click', function() {
    // Add the newly selected city
    var select = document.getElementById('selectCityToAdd');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    var label = selected.textContent;
    // TODO init the app.selectedCities array here
    if (!app.selectedCities) {
      app.selectedCities = [];
    }

    app.getForecast(key, label);
    // TODO push the selected city to the array and save here
    console.log('selectedCities:'+app.selectedCities);
    console.log('key:'+key);
    console.log('label:'+label);
    console.log('selected: '+{"key": key, "label": label});
    console.log('cties: '+app.selectedCities);
    app.selectedCities.push({"key": key, "label": label});
    app.selectedCities.concat([{"key": key, "label": label}]);
    console.log('cties: '+app.selectedCities);
    app.saveSelectedCities();


    app.toggleAddDialog(false);
  });


  document.getElementById('butAddCancel').addEventListener('click', function () {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });




           
/*Bei Klick auf Bild neues Fenster*******************************/
    

  

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  app.toggleCameraDialog = function(visible) {
    if (visible) {
      app.cameraDialog.classList.add('camera-container--visible');
    } else {
      app.cameraDialog.classList.remove('camera-container--visible');
    }
  };


  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    var dataLastUpdated = new Date(data.created);
    var sunrise = data.channel.astronomy.sunrise;
    var sunset = data.channel.astronomy.sunset;
    var current = data.channel.item.condition;
    var humidity = data.channel.atmosphere.humidity;
    var wind = data.channel.wind;

    var card = app.visibleCards[data.key];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = data.label;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.key] = card;
    }

    // Verifies the data provide is newer than what's already visible
    // on the card, if it's not bail, if it is, continue and update the
    // time saved in the card
    var cardLastUpdatedElem = card.querySelector('.card-last-updated');
    var cardLastUpdated = cardLastUpdatedElem.textContent;
    if (cardLastUpdated) {
      cardLastUpdated = new Date(cardLastUpdated);
      // Bail if the card has more recent data then the data
      if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
    }
    cardLastUpdatedElem.textContent = data.created;

    card.querySelector('.description').textContent = current.text;
    card.querySelector('.date').textContent = current.date;
    card.querySelector('.current .icon').classList.add(app.getIconClass(current.code));
    card.querySelector('.current .temperaC .value').textContent =
      Math.round( (current.temp-32)*5/9);
    card.querySelector('.current .sunrise').textContent = sunrise;
    card.querySelector('.current .sunset').textContent = sunset;
    card.querySelector('.current .humidity').textContent =
      Math.round(humidity) + '%';
    card.querySelector('.current .wind .value').textContent =
      Math.round(wind.speed*1,61);
    var nextDays = card.querySelectorAll('.future .oneday');
    var today = new Date();
    today = today.getDay();
    for (var i = 0; i < 7; i++) {
      var nextDay = nextDays[i];
      var daily = data.channel.item.forecast[i];
      if (daily && nextDay) {
        nextDay.querySelector('.date').textContent =
          app.daysOfWeek[(i + today) % 7];
        nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.code));
        nextDay.querySelector('.tempC-high .value').textContent =
          Math.round( (daily.high-32)*5/9 );  // temperature in °C
        nextDay.querySelector('.tempC-low .value').textContent =
          Math.round( (daily.low-32)*5/9 );  // temperature in °C
      }
    }
  
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.getForecast = function(key, label) {
    var statement = 'select * from weather.forecast where woeid=' + key;
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
        statement;
    // TODO add cache logic here
    if ('caches' in window) {  // Is it here and not in the service worker (SW), in case there are no SW?
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json.query.results;
            results.key = key;
            results.label = label;
            results.created = json.query.created;
            app.updateForecastCard(results);
          });
        }
      });
    }

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.key = key;
          results.label = label;
          results.created = response.query.created;
          app.updateForecastCard(results);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        app.updateForecastCard(initialWeatherForecast);  // Don't do that in a real app
                                                         // Just a message, no fake
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };

  // TODO add saveSelectedCities function here
  // Save list of cities to localStorage.
  app.saveSelectedCities = function() {
    var selectedCities = JSON.stringify(app.selectedCities);
    // localforage.selectedCities = selectedCities;
    localforage.setItem('selectedCities', selectedCities).then(function (value) {
      // Do other things once the value has been saved.
      console.log('selectedCities: ' + value);
    }).catch(function (err) {
      // This code runs if there were any errors
      console.log('Error storing selectedCities: ' + err);
    });
    // localforage.setItem('selectedCities', selectedCities);
  };


  app.getIconClass = function(weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 25: // cold
      case 32: // sunny
      case 33: // fair (night)
      case 34: // fair (day)
      case 36: // hot
      case 3200: // not available
        return 'clear-day';
      case 0: // tornado
      case 1: // tropical storm
      case 2: // hurricane
      case 6: // mixed rain and sleet
      case 8: // freezing drizzle
      case 9: // drizzle
      case 10: // freezing rain
      case 11: // showers
      case 12: // showers
      case 17: // hail
      case 35: // mixed rain and hail
      case 40: // scattered showers
        return 'rain';
      case 3: // severe thunderstorms
      case 4: // thunderstorms
      case 37: // isolated thunderstorms
      case 38: // scattered thunderstorms
      case 39: // scattered thunderstorms (not a typo)
      case 45: // thundershowers
      case 47: // isolated thundershowers
        return 'thunderstorms';
      case 5: // mixed rain and snow
      case 7: // mixed snow and sleet
      case 13: // snow flurries
      case 14: // light snow showers
      case 16: // snow
      case 18: // sleet
      case 41: // heavy snow
      case 42: // scattered snow showers
      case 43: // heavy snow
      case 46: // snow showers
        return 'snow';
      case 15: // blowing snow
      case 19: // dust
      case 20: // foggy
      case 21: // haze
      case 22: // smoky
        return 'fog';
      case 24: // windy
      case 23: // blustery
        return 'windy';
      case 26: // cloudy
      case 27: // mostly cloudy (night)
      case 28: // mostly cloudy (day)
      case 31: // clear (night)
        return 'cloudy';
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return 'partly-cloudy-day';
    }
  };

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  var initialWeatherForecast = {
    key: '673641',
    label: 'Mammendorf, DE',
    created: '2018-05-02T01:00:00Z',
    channel: {
      astronomy: {
        sunrise: "5:43 am",
        sunset: "8:21 pm"
      },
      item: {
        condition: {
          text: "Windy",
          date: "Thu, 21 Jul 2016 09:00 PM EDT",
          temp: 56,
          code: 24
        },
        forecast: [
          {code: 44, high: 86, low: 70},
          {code: 44, high: 94, low: 73},
          {code: 4, high: 95, low: 78},
          {code: 24, high: 75, low: 89},
          {code: 24, high: 89, low: 77},
          {code: 44, high: 92, low: 79},
          {code: 44, high: 89, low: 77}
        ]
      },
      atmosphere: {
        humidity: 56
      },
      wind: {
        speed: 25,
        direction: 195
      }
    }
  };

  var blank = {
   
  };


  //app.selectedCities = localforage.getItem('selectedCities');
  localforage.getItem('selectedCities').then(function (value) {
    // This code runs once the value has been loaded
    // from the offline store.
    app.selectedCities = value;  // initialized as empty array, but it is
                                 // null after using localforage
    app.selectedCities = JSON.parse(app.selectedCities);
    console.log('selectedCities: ' + value);
    app.selectedCities.forEach(function(city) {
      app.getForecast(city.key, city.label);
    });
  }).catch(function (err) {
    // This code runs if there were any errors
    app.selectedCities = null;
    console.log('Error getting selectedCities: ' + err);
    app.updateForecastCard(initialWeatherForecast);
    app.selectedCities = [
      {key: initialWeatherForecast.key, label: initialWeatherForecast.label}
    ];
    app.saveSelectedCities();
  });
  //app.selectedCities = localforage.selectedCities;
  if (app.selectedCities) {  // can ESLint find this without '=== null'?
    // app.selectedCities = JSON.parse(app.selectedCities);
    app.selectedCities.forEach(function(city) {
      app.getForecast(city.key, city.label);
    });
  } else {

    app.updateForecastCard(initialWeatherForecast);
    app.selectedCities = [
      {key: initialWeatherForecast.key, label: initialWeatherForecast.label}
    ];
    app.saveSelectedCities();

  }



  
  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  };
})();





