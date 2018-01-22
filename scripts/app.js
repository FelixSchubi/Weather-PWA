window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
dbVersion = 1;

// Bild Auswählen und Vorschau

var loadFile = function(event) {
  var output = document.getElementById('output');
  output.src = URL.createObjectURL(event.target.files[0]);
};

// var loadFileDie = function(event) {
//   var outputDie = document.getElementById('outputDie');
//   outputDie.src = URL.createObjectURL(event.target.files[0]);
// };


/*******Notes *******************/


var todoDB = (function() {
  var tDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  tDB.open = function(callback) {
    // Database version.
    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('todos', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('todo')) {
        db.deleteObjectStore('todo');
      }

      // Create a new datastore.
      var store = db.createObjectStore('todo', {
        keyPath: 'timestamp'
      });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;
      
      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = tDB.onerror;
  };


  /**
   * Fetch all of the todo items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the todo items.
   */
  tDB.fetchTodos = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['todo'], 'readwrite');
    var objStore = transaction.objectStore('todo');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var todos = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(todos);
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


  /**
   * Create a new todo item.
   * @param {string} text The todo item.
   */
  tDB.createTodo = function(text, callback) {
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['todo'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('todo');

    // Create a timestamp for the todo item.
    var timestamp = new Date().getTime();
    
    // Create an object for the todo item.
    var todo = {
      'text': text,
      'timestamp': timestamp
    };

    // Create the datastore request.
    var request = objStore.put(todo);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      // Execute the callback function.
      callback(todo);
    };

    // Handle errors.
    request.onerror = tDB.onerror;
  };


  /**
   * Delete a todo item.
   * @param {int} id The timestamp (id) of the todo item to be deleted.
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  tDB.deleteTodo = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['todo'], 'readwrite');
    var objStore = transaction.objectStore('todo');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  // Export the tDB object.
  return tDB;
}());



window.onload = function() {
  
  // Display the todo items.
  todoDB.open(refreshTodos);
  
  
  // Get references to the form elements.
  var newTodoForm = document.getElementById('new-todo-form');
  var newTodoInput = document.getElementById('new-todo');
  
  
  // Handle new todo item form submissions.
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    var text = newTodoInput.value;
    
    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the todo item.
      todoDB.createTodo(text, function(todo) {
        refreshTodos();
      });
    }
    
    // Reset the input field.
    newTodoInput.value = '';
    
    // Don't send the form.
    return false;
  };
  
}

// Update the list of todo items.
function refreshTodos() {  
  todoDB.fetchTodos(function(todos) {
    var todoList = document.getElementById('todo-items');
    todoList.innerHTML = '';
    
    for(var i = 0; i < todos.length; i++) {
      // Read the todo items backwards (most recent first).
      var todo = todos[(todos.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.setAttribute("data-id", todo.timestamp);
      
      li.appendChild(checkbox);
      
      var span = document.createElement('span');
      span.innerHTML = todo.text;
      
      li.appendChild(span);
      
      todoList.appendChild(li);
      
      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        todoDB.deleteTodo(id, refreshTodos);
      });
    }

  });
};





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

document.getElementById("DeleteMonday").addEventListener("click",delMonday);


function delMonday()
{
    
var request = indexedDB.open("Woche", dbVersion),
db;

request.onsuccess = function (event) {
    db = request.result;

   var transaction = db.transaction(["Montag"],"readwrite")
   .objectStore("Montag")
   .delete("image");
   console.log("Bild wurde gelöscht");

    location.reload();
}
}





  document.getElementById("MasterSaMo").addEventListener("click",MasterSaveMo);
  
 

    function MasterSaveMo () {

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

    var MasMondayURL = document.getElementById("output").src;
    console.log(MasMondayURL);



    // Create/open database
    var request = indexedDB.open("Woche", dbVersion),
        db,
        createObjectStore = function (dataBase) {
            // Create an objectStore
            console.log("Creating objectStore")
            dataBase.createObjectStore("Montag");
            dataBase.createObjectStore("Dienstag");
        },

        getImageFile = function () {
            // Create XHR
            


            var xhr = new XMLHttpRequest(),
                blob;

                

            xhr.open("GET", MasMondayURL, true);
            // Set the responseType to blob
            xhr.responseType = "blob";

            xhr.addEventListener("load", function () {
                if (xhr.status === 200) {
                    console.log("Image retrieved");
                    
                    // Blob as response
                    blob = xhr.response;
                    console.log("Blob:" + blob);

                    // Put the received blob into IndexedDB
                    putMondayInDb(blob);
                }
            }, false);
            // Send XHR
            xhr.send();
        },

        putMondayInDb = function (blob) {
            console.log("Putting Monday in IndexedDB");

            // Open a transaction to the database
            var transaction = db.transaction(["Montag"], IDBTransaction.READ_WRITE);

            // Put the blob into the dabase
            var put = transaction.objectStore("Montag").put(blob, "image");

     
     
        };



    request.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };

    request.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        db = request.result;

        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
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

}

};

// aus indexeddb herausholen *******************************************






document.getElementById("ShowPictureMo").addEventListener("click",sPictureMo);


function sPictureMo () {



var request = indexedDB.open("Woche", dbVersion),
db;


request.onsuccess = function (event) {
    console.log("Success creating/accessing IndexedDB database");
    db = request.result;


        

   var transaction = db.transaction(["Montag"], IDBTransaction.READ);
   
               // Put the blob into the dabase
             //  var put = transaction.objectStore("Monday").put(blob, "image");
   
               // Retrieve the file that was just stored
               transaction.objectStore("Montag").get("image").onsuccess = function (event) {
                   var imgMoFile = event.target.result;
                   console.log("Got Monday!" + imgMoFile);

                   var reader = new window.FileReader();
                reader.readAsDataURL(imgMoFile); 
                reader.onloadend = function() {
                            var   MPc = reader.result;                
                               console.log("base64" + MPc );
                               document.getElementById('MpcM').src = MPc ;
                               
                               
                              };  
   
               };};
               
             
            };

/************************************************************************************************************* */
/*****************************************Dienstag Speichern************************************************** */
/************************************************************************************************************* */
document.getElementById("DeleteTuesday").addEventListener("click",delTuesday);


function delTuesday()
{
    
var request = indexedDB.open("Woche", dbVersion),
db;

request.onsuccess = function (event) {
    db = request.result;

   var transaction = db.transaction(["Dienstag"],"readwrite")
   .objectStore("Dienstag")
   .delete("image");
   console.log("Bild wurde gelöscht");
}
}





document.getElementById("MasterSaDie").addEventListener("click",MasterSaveDie);

  

  function MasterSaveDie (files) {


  
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



      var thumb = document.getElementById("thumbnail");
      console.log("Thumb:" +thumbnail);
     
      console.log(thumbnail);
        thumb.innerHTML = "";

        if(!files)
		return;

     
        for(var i = 0; i < files.length; i++)
        {
        var dfile = files[i];
     
            if(!dfile.type.match(/image.*/))
                continue;
     
            var img = document.createElement("img");
            var reader = new FileReader();
     
            reader.onload = (function(tImg) {
                return function(e) {
                    tImg.src = e.target.result;
                };
        })(img);
        console.log(img);


    console.log("FILE:" + file);

    reader.readAsDataURL(file);
      //  console.log();

      img.width = 100;
      thumb.appendChild(img);
   
      console.log(file);
        

  var MasMondayURL = document.getElementById("thumbnail").src;
      console.log(MasMondayURL);



  // Create/open database
  var request = indexedDB.open("Woche", dbVersion),
      db,
      createObjectStore = function (dataBase) {
          // Create an objectStore
          console.log("Creating objectStore");
          dataBase.createObjectStore("Montag");
          dataBase.createObjectStore("Dienstag");
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
                  console.log("Image retrieved");
                  
                  // Blob as response
                  blob = xhr.response;
                  console.log("Blob:" + blob);

                  // Put the received blob into IndexedDB
                  putMondayInDb(blob);
              }
          }, false);
          // Send XHR
          xhr.send();
      },

      putMondayInDb = function (blob) {
          console.log("Putting Tuesday in IndexedDB");

          // Open a transaction to the database
          var transaction = db.transaction(["Dienstag"], IDBTransaction.READ_WRITE);

          // Put the blob into the dabase
          var put = transaction.objectStore("Dienstag").put(blob, "image");

   
   
      };



  request.onerror = function (event) {
      console.log("Error creating/accessing IndexedDB database");
  };

  request.onsuccess = function (event) {
      console.log("Success creating/accessing IndexedDB database");
      db = request.result;

      db.onerror = function (event) {
          console.log("Error creating/accessing IndexedDB database");
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


  // location.reload();

};};

// aus indexeddb herausholen *******************************************


document.getElementById("ShowPictureDie").addEventListener("click",sPictureDie);


function sPictureDie () {

var request = indexedDB.open("Woche", dbVersion),
db;

request.onsuccess = function (event) {
  console.log("Success creating/accessing IndexedDB database");
  db = request.result;

 var transaction = db.transaction(["Dienstag"], IDBTransaction.READ);
 
             // Put the blob into the dabase
           //  var put = transaction.objectStore("Monday").put(blob, "image");
 
             // Retrieve the file that was just stored
             transaction.objectStore("Dienstag").get("image").onsuccess = function (event) {
                 var imgDieFile = event.target.result;
                 console.log("Got Monday!" + imgDieFile);

                 var reader = new window.FileReader();
              reader.readAsDataURL(imgDieFile); 
              reader.onloadend = function() {
                          var   MPcD = reader.result;                
                             console.log("base64" + MPcD );
                             document.getElementById('MpcDie').src = MPcD ;
                             
                             
                            };  
 
             };};
             
           
          };



/*****************IndexedDB Bilder einspeichern Ende */






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
    key: '676757',
    label: 'München, DE',
    created: '2016-07-22T01:00:00Z',
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
  // TODO uncomment line below to test app with fake data
  // app.updateForecastCard(initialWeatherForecast);

/************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this codelab, we've used localStorage.
   *   localStorage is a synchronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   ************************************************************************/

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
    /* The user is using the app for the first time, or the user has not
     * saved any cities, so show the user some fake data. A real app in this
     * scenario could guess the user's location via IP lookup and then inject
     * that data into the page.
     */
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




