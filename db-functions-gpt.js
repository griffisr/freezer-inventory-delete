// Firebase Initialization (API key should be secured in a backend environment)
const firebaseConfig = {
    apiKey: "Your-API-Key", 
    authDomain: "party-smart-tcod.firebaseapp.com",
    databaseURL: "https://party-smart-tcod.firebaseio.com",
    projectId: "party-smart-tcod",
    storageBucket: "party-smart-tcod.appspot.com",
    messagingSenderId: "332152048668",
    appId: "1:332152048668:web:9adf5fb209d803b8d4e3d9"
  };
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Authentication State Handling
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Logged in");
      logOut.classList.remove('hide');
      logIn.classList.add('hide');
      newEventBtn.classList.remove('hide');
    } else {
      logOut.classList.add('hide');
      logIn.classList.remove('hide');
      newEventBtn.classList.add('hide');
    }
  });
  
  // Fetch and Display Data (Initialize DataTable after fetching)
  $(document).ready(function () {
    fetchAndDisplayData();
  });
  
  function fetchAndDisplayData() {
    const dataRef = database.ref("users/Riley");
    const dataArray = [];
  
    dataRef.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val();
        const itemName = childSnapshot.key;
  
        // Replace commas in the itemType with a comma followed by <br> to create new lines
        // Apply custom colors to item types based on category
      const formattedItemType = childData.itemType.map(itemType => {
        if (itemType.includes('CHICKEN')) {
          return `<span class="item-type chicken">${itemType}</span>`;
        } else if (itemType.includes('BEEF')) {
          return `<span class="item-type beef">${itemType}</span>`;
        } else if (itemType.includes('VEGETABLE')) {
          return `<span class="item-type vegetable">${itemType}</span>`;
        } else if (itemType.includes('FRUIT')) {
          return `<span class="item-type fruit">${itemType}</span>`;
        } else if (itemType.includes('PREPPED INGREDIENT')) {
            return `<span class="item-type ingredient">${itemType}</span>`;
        } else if (itemType.includes('DESSERT')) {
            return `<span class="item-type dessert">${itemType}</span>`;
        } else if (itemType.includes('QUICK LUNCH ITEM')) {
            return `<span class="item-type lunch">${itemType}</span>`;
        } else if (itemType.includes('DAIRY')) {
            return `<span class="item-type dairy">${itemType}</span>`;
        } else {
          return `<span class="item-type other">${itemType}</span>`;
        }
      }).join("<span><span>"); // Join them with <br> for line breaks
        dataArray.push([
          itemName,
          formattedItemType,
          childData.dateAdded,
          childData.quantity,
          `<button class="edit-btn" onclick="editItem('${itemName}')">Edit</button>
         <button class="delete-btn" onclick="deleteItem('${itemName}')">Delete</button>`,
         childData.notes || " "
        ]);
      });
  // Check if the DataTable is already initialized
  if (!$.fn.DataTable.isDataTable('#c-item-table')) {

    // Initialize DataTable only if it hasn't been initialized yet
    $('#c-item-table').DataTable({
      data: dataArray,
      searching: false,    // Disable searching
      lengthChange: false, // Disable ability to change length of entries
      pageLength: 5, // Default number of items per page
      lengthMenu: [5, 10, 25, 50] // Options for number of items per page
    });
  }
  
   
    });
  }
// EDIT ITEM
  function editItem(itemName) {
    const itemRef = database.ref("users/Riley/" + itemName);
  
    // Fetch the item from Firebase
    itemRef.once('value').then(function(snapshot) {
      const itemData = snapshot.val();
  
      if (itemData) {
        // Fill the form fields with the item data
        document.getElementById("newItemName").value = itemData.itemName;
        document.getElementById("quantityInput").value = itemData.quantity;
        document.getElementById("notesTextarea").value = itemData.notes || "";
        document.getElementById("dateAddedInput").value = itemData.dateAdded;
  
        // Set the radio button for Fresh/Frozen
        if (itemData.freshOrFrozen === "Frozen") {
          document.getElementById("frozen-btn").checked = true;
        } else {
          document.getElementById("fresh-btn").checked = true;
        }
  
        // Set checkboxes for Item Types
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = itemData.itemType.includes(checkbox.nextSibling.textContent.trim());
        });
  
        // Delete the old item from Firebase
        itemRef.remove().then(() => {
          alert(`Editing "${itemName}". Make changes and click 'Add' to save.`);
          triggerPanelSwitch('#c-item-form');
        }).catch(error => {
          console.error("Error deleting item:", error);
        });
      }
    }).catch(function(error) {
      console.error("Error fetching item:", error);
    });
  }
  

//   DELETE ITEM
  function deleteItem(itemName) {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      const itemRef = database.ref("users/Riley/" + itemName);
  
      // Remove item from Firebase
      itemRef.remove()
        .then(() => {
          alert(`"${itemName}" has been deleted.`);
          
          // Refresh the table after deletion
          $('#c-item-table').DataTable().destroy();
          fetchAndDisplayData();
        })
        .catch(error => {
          console.error("Error deleting item:", error);
        });
    }
  }
  







// Create ITEM
  function createItem() {
    const itemName = document.getElementById("newItemName").value.trim();
    const quantity = document.getElementById("quantityInput").value.trim();
    const notes = document.getElementById("notesTextarea").value.trim();
    const dateAdded = document.getElementById("dateAddedInput").value;
    
    let freshOrFrozen = document.querySelector('input[id="frozen-btn"]:checked') ? "Frozen" : "Fresh";
    
    const itemType = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.nextSibling.textContent.trim());
  
    if (!itemName) {
      alert("Please enter an item name!");
      return;
    }
  
    // Store data in Firebase
    firebase.database().ref(`users/Riley/${itemName}`).set({
      itemName,
      freshOrFrozen,
      dateAdded,
      quantity,
      notes,
      itemType
    }).then(() => {
      alert("Item Added");
      clearFormInputs();
      
      // Fetch and update the table after the new item is successfully added
      $('#c-item-table').DataTable().destroy();
      fetchAndDisplayData(); // Call the function to refresh the table
      triggerPanelSwitch('#c-item-list');
    }).catch(error => {
      console.error("Error uploading item:", error);
    });
  }





  // Function to trigger the panel switch using the data-toggle behavior
function triggerPanelSwitch(targetPanel) {
    // Find the link that triggers the target panel
    const link = document.querySelector(`a[data-target='${targetPanel}']`);
    
    if (link) {
      // Simulate the click event to trigger the data-toggle
      link.click();
    } else {
      console.error('Target panel link not found.');
    }
  }
  
  // Clear Input Fields After Adding Item
  function clearFormInputs() {
    document.getElementById("newItemName").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("notesTextarea").value = "";
    document.getElementById("dateAddedInput").value = "";
  }
  
  
  // Search Function for DataTable
  function searchTable() {
    const input = document.getElementById("searchInput").value.toUpperCase();
    const table = document.getElementById("c-item-table");
    const tr = table.getElementsByTagName("tr");
  
    Array.from(tr).forEach(row => {
      const cells = row.getElementsByTagName("td");
      let foundMatch = false;
  
      Array.from(cells).forEach(cell => {
        if (cell && cell.textContent.toUpperCase().includes(input)) {
          foundMatch = true;
        }
      });
  
      row.style.display = foundMatch ? "" : "none";
    });
  }
  











  
  // Autocomplete with Debounce
  let debounceTimeout;
  function debounce(func, delay) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
  }
  
  function autocomplete(inp, arr) {
    let currentFocus;
    inp.addEventListener("input", function (e) {
      const val = this.value;
      debounce(() => {
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;
  
        const listDiv = document.createElement("DIV");
        listDiv.setAttribute("id", this.id + "autocomplete-list");
        listDiv.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(listDiv);
  
        arr.forEach(item => {
          if (item.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            const itemDiv = document.createElement("DIV");
            itemDiv.innerHTML = "<strong>" + item.substr(0, val.length) + "</strong>";
            itemDiv.innerHTML += item.substr(val.length);
            itemDiv.innerHTML += "<input type='hidden' value='" + item + "'>";
  
            itemDiv.addEventListener("click", function () {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
            });
  
            listDiv.appendChild(itemDiv);
          }
        });
      }, 300); // Adjust the debounce delay as needed
    });
  
    inp.addEventListener("keydown", function (e) {
      let x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
  
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1 && x) x[currentFocus].click();
      }
    });
  }
  
  // Utility function for autocomplete
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  
  function removeActive(x) {
    Array.from(x).forEach(item => item.classList.remove("autocomplete-active"));
  }
  
  function closeAllLists(elmnt) {
    const items = document.getElementsByClassName("autocomplete-items");
    Array.from(items).forEach(item => {
      if (elmnt !== item && elmnt !== inp) item.parentNode.removeChild(item);
    });
  }
  
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
  