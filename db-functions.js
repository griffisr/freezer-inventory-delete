//Initialize Database
const firebaseConfig = {
  apiKey: "AIzaSyCKnIn4SsMC74rTGqekjSw8OvLwWe88bbI",
  authDomain: "party-smart-tcod.firebaseapp.com",
  databaseURL: "https://party-smart-tcod.firebaseio.com",
  projectId: "party-smart-tcod",
  storageBucket: "party-smart-tcod.appspot.com",
  messagingSenderId: "332152048668",
  appId: "1:332152048668:web:9adf5fb209d803b8d4e3d9"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

firebase.auth().onAuthStateChanged(function(user){
  if(user){
    console.log("logged in");
    logOut.classList.remove('hide');
    logIn.classList.add('hide');
    newEventBtn.classList.remove('hide');
}
else{
    logOut.classList.add('hide');
    logIn.classList.remove('hide');
    newEventBtn.classList.add('hide');
}
});




$(document).ready(function fetchAndDisplayData() {
  // Reference to your data in the database
  var dataRef = database.ref("users/Riley");

  // Initialize array to store rows of data
  var dataArray = [];

  // Get the data once
  dataRef.once('value', function(snapshot) {
      // Loop through each child item
      snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          var itemName = childSnapshot.key;

          // Create an array representing a row of data
          var rowData = [
              itemName, // Item Name
              childData.itemType, // Item Type
              childData.freshOrFrozen, // Fresh/Frozen
              childData.dateAdded, // Date Added
              childData.quantity, // Quantity
              childData.notes || "empty", // Notes
          ];

          // Push the row data into the dataArray
          dataArray.push(rowData);
      });

      // Now, the dataArray contains an array of arrays representing each row of data
      console.log(dataArray);

      // Initialize DataTable here after data is fetched
      new DataTable('#c-item-table', {
          data: dataArray,
          searching: false, // Disable searching
          lengthChange: false // Disable length change
      });
  });
});







/////////////////////////////Add data////////////////////////////
function createItem(){
  // Get values from HTML elements
  const eventName = document.getElementById("newItemName").value;
  const quantity = document.getElementById("quantityInput").value;
  const notes = document.getElementById("notesTextarea").value;

/**************/
// Get Fresh or Frozen radio button value
let freshOrFrozen = "";
const freshRadio = document.querySelector('input[id="frozen-btn"]:checked');
if (freshRadio) {
  freshOrFrozen = "Frozen";
}
else{
  freshOrFrozen = "Fresh";
}

// Get Date Added value
const dateAdded = document.getElementById("dateAddedInput").value;

/**************/
let itemType = [];
// Get all checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
// Loop through each checked checkbox and add its value to the array
checkboxes.forEach(function(checkbox) {
  itemType.push(" " + checkbox.nextSibling.textContent.trim());
  checkbox.checked = false;
});

/**************/

if(eventName === null || eventName === "")
{
  alert("Please enter an item name!")
}
else
{
  localStorage.setItem('eventName', eventName);
  firebase.database().ref("users/" + "Riley/" + eventName + "/").set({
    itemName: eventName,
    freshOrFrozen: freshOrFrozen,
    dateAdded: dateAdded,
    quantity: quantity,
    notes: notes,
    itemType: itemType

  })
  .then(function() {
    alert("Item Added");
    // Clear input fields after successful upload
    document.getElementById("newItemName").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("notesTextarea").value = "";
    document.getElementById("dateAddedInput").value = "";
  })
  .catch(function(error) {
    console.error("Error uploading item:", error);
  });
}

}

  
  

////////////////////////////Search List////////////////////////

function searchTable() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("c-item-table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those that don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for (var j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop if match found to avoid unnecessary iterations
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}



//-------------------------- Returns time ---------------------------
function addZero(i) {
  if (i < 10) {
  i = "0" + i;
}
return i;
}

function getTime() {
  var d = new Date();
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());
  var currentTime = h + ":" + m + ":" + s;

  return currentTime;
}


//------------------------------------------- UI List Funtions -------------------------------------

//Actively read data from firebase to print to UI

//Gets data for currently logged in user
firebase.auth().onAuthStateChanged(function(user){
if(user){
  localStorage.setItem('userUID', user.uid);
  eventName = localStorage.getItem('eventName');
  document.title = eventName;
  ref = database.ref("users/" + user.uid + "/events/" + eventName + "/guestList/")
  ref.on('value', gotData, errData)
}
});


guestsNotInside = [];
guestsAreInside = [];
function gotData(data){
eventName = localStorage.getItem('eventName');
//Momentarily clears both UI lists so items can be added w/o duplicates
document.getElementById("namesInside").innerHTML = "";
guestsNotInside.length = 0;
guestsAreInside.length = 0;


var scores = data.val();
var keys = Object.keys(scores);

var ulInside = document.getElementById("namesInside");

for ( var i=0; i < keys.length; i++){
  var k = keys[i];
  var names = scores[k].name;
  var inside = scores[k].Inside;

  if(inside == "No"){
    guestsNotInside.push(names)
  }
  
}
var guestsInside = 0;
for ( var i=0; i < keys.length; i++){
  var k = keys[i];
  var names = scores[k].name;
  var inside = scores[k].Inside;

  if(inside === "Yes"){
    guestsInside ++; 
    guestsAreInside.push(names)

    var a = document.createElement("a");
    var li = document.createElement("li")

    a.textContent = names;
    li.appendChild(a);
    ulInside.appendChild(li);
    a.setAttribute('id', names);
    a.setAttribute('onclick', 'setTextOut(id)');
  }
  
}
//********************Add if statment to change risk level photo based on guestsInside var **********************
if(guestsInside === 1)
{
  document.getElementById('currentInside').innerHTML = "There is currently: " + guestsInside + " guest inside";
}
else{
  document.getElementById('currentInside').innerHTML = "There are currently: " + guestsInside + " guests inside";
}

}

function errData(err){
  console.log('Error!');
  console.log(err);
}

//Search List function

function insideList() {
var input, filter, ul, li, a, i, txtValue;
input = document.getElementById("checkOut");
filter = input.value.toUpperCase();
ul = document.getElementById("namesInside");
li = ul.getElementsByTagName("li");
for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
    } else {
        li[i].style.display = "none";
    }
}
}



function autocomplete(inp, arr) {
/*the autocomplete function takes two arguments,
the text field element and an array of possible autocompleted values:*/
var currentFocus;
/*execute a function when someone writes in the text field:*/
inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = arr[i].substr(0, val.length);
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
        });
        a.appendChild(b);
      }
    }
});
/*execute a function presses a key on the keyboard:*/
inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
});
function addActive(x) {
  /*a function to classify an item as "active":*/
  if (!x) return false;
  /*start by removing the "active" class on all items:*/
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (x.length - 1);
  /*add class "autocomplete-active":*/
  x[currentFocus].classList.add("autocomplete-active");
}
function removeActive(x) {
  /*a function to remove the "active" class from all autocomplete items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}
function closeAllLists(elmnt) {
  /*close all autocomplete lists in the document,
  except the one passed as an argument:*/
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("checkInName"), guestsNotInside);
autocomplete(document.getElementById("checkOutName"), guestsAreInside);


