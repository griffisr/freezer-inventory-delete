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
    fetchDashboardData(); // Fetch dashboard data for the overview
  });
  
  let originalData = []; // To store the original unfiltered table data

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
      dom: "<'top'>t<'bottom'<<'col-sm-4'i><'col-sm-4'p> <'col-sm-4'l>>>",
      data: dataArray,
      searching: false,    // Disable searching
      lengthChange: true, // Disable ability to change length of entries
      pageLength: 5, /////////////////////////////////////////////////////////////// Default number of items per page
      lengthMenu: [5, 10, 25, 50, { label: 'All', value: -1 }], // Options for number of items per page
      // layout: {
      //   bottomN: lengthChange,
      // }
    });
    const table = $('#c-item-table').DataTable();
    // Store the original data when the table is first initialized
    originalData = table.rows().data().toArray(); // Save the full dataset

  }
  
   
    });
  }



// EDIT ITEM
  function editItem(itemName) {
    console.log(itemName)
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
  
        // Set checkboxes for Item Types
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = itemData.itemType.includes(checkbox.nextSibling.textContent.trim());
        });
  
        // Delete the old item from Firebase
        itemRef.remove().then(() => {
          alert(`Editing "${itemName}". Make changes and click 'Add' to save.`);
          $('.content-panel.active').fadeOut().removeClass('active');
          $('#c-item-form').fadeIn().addClass('active');
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

  
// // Fetch and pre-fill form fields when editing an item
// function editItem(itemName) {
//   const itemRef = database.ref("users/Riley/" + itemName);

//   // Fetch the item from Firebase
//   itemRef.once('value').then(function(snapshot) {
//       const itemData = snapshot.val();

//       if (itemData) {
//           // Fill the form fields with the item data
//           document.getElementById("newItemName").value = itemData.itemName;
//           document.getElementById("quantityInput").value = itemData.quantity;
//           document.getElementById("notesTextarea").value = itemData.notes || "";
//           document.getElementById("dateAddedInput").value = itemData.dateAdded;

//           // Set the radio button for Fresh/Frozen
//           if (itemData.freshOrFrozen === "Frozen") {
//               document.getElementById("frozen-btn").checked = true;
//           } else {
//               document.getElementById("fresh-btn").checked = true;
//           }

//           // Set checkboxes for Item Types
//           const checkboxes = document.querySelectorAll('input[type="checkbox"]');
//           checkboxes.forEach(checkbox => {
//               checkbox.checked = itemData.itemType.includes(checkbox.nextSibling.textContent.trim());
//           });

//           // Store the current item name for the update
//           document.getElementById("currentItemName").value = itemName;

//           // Change the "Add" button text to "Update"
//           document.getElementById("submitButton").innerText = "Update Item";
//       }
//   }).catch(function(error) {
//       console.error("Error fetching item:", error);
//   });
// }

// Update the item when the "Update" button is clicked
function createItem() {
  const itemName = document.getElementById("newItemName").value.trim();
  const quantity = document.getElementById("quantityInput").value.trim();
  const notes = document.getElementById("notesTextarea").value.trim();
  const dateAdded = document.getElementById("dateAddedInput").value;

  let freshOrFrozen = document.querySelector('input[id="frozen-btn"]:checked') ? "Frozen" : "Fresh";

  const itemType = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.nextSibling.textContent.trim());

  // Get the current item name if editing
  const currentItemName = document.getElementById("currentItemName").value;

  if (!itemName) {
      alert("Please enter an item name!");
      return;
  }

  // Check if we are updating an existing item or adding a new one
  const databaseRef = currentItemName ? database.ref(`users/Riley/${currentItemName}`) : database.ref(`users/Riley/${itemName}`);

  // Store data in Firebase
  databaseRef.set({
      itemName,
      freshOrFrozen,
      dateAdded,
      quantity,
      notes,
      itemType
  }).then(() => {
      alert(currentItemName ? "Item Updated" : "Item Added");
      clearFormInputs();

      // Fetch and update the table after the item is updated/added
      $('#c-item-table').DataTable().destroy();
      fetchAndDisplayData(); // Refresh the table

      // Reset the form to its default state
      document.getElementById("submitButton").innerText = "Add Item";
      document.getElementById("currentItemName").value = "";
      triggerPanelSwitch('#c-item-list'); // Switch back to the item list panel
  }).catch(error => {
      console.error("Error uploading item:", error);
  });
}

// Clear form inputs and reset for new item addition
function clearFormInputs() {
  document.getElementById("newItemName").value = "";
  document.getElementById("quantityInput").value = "";
  document.getElementById("notesTextarea").value = "";
  document.getElementById("dateAddedInput").value = "";
  document.getElementById("currentItemName").value = "";  // Clear the current item for editing
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      checkbox.checked = false;
  });
}


  



// Searching and filtering functions





  
  // Search Function for DataTable
  function searchTable(searchValue) {
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
  



  function togglePageAndFilter(tag) {
    // Switch to the #c-item-list page
    togglePage('#c-item-list');
    document.documentElement.scrollTop = 0; // For most browsers
    document.body.scrollTop = 0; // For Safari

    console.log(tag)
    // Set the value of the dropdown to 'Beef'
    document.getElementById("tagFilter").value = tag;

    // Alternatively, trigger the 'change' event manually to call the filter function:
    document.getElementById("tagFilter").dispatchEvent(new Event('change'));

    filterByTag();
    
}


function filterByTag() {
  const selectedTag = document.getElementById("tagFilter").value.toLowerCase();
  const table = $('#c-item-table').DataTable();

  // Use originalData for filtering to ensure full dataset is always available
  let filteredData = [];

  // If no tag is selected, reset to show all original data
  if (!selectedTag) {
      filteredData = originalData;
  } else {
      // Filter originalData based on the selected tag
      filteredData = originalData.filter(rowData => {
          const itemType = rowData[1].toLowerCase(); // Assuming column 1 is the item type
          return itemType.includes(selectedTag);
      });
  }

  // Destroy the current DataTable instance
  table.destroy();

  // Reinitialize the DataTable with the filtered data
  $('#c-item-table').DataTable({
      dom: "<'top'>t<'bottom'<<'col-sm-4'i><'col-sm-4'p> <'col-sm-4'l>>>",
      data: filteredData,
      pageLength: 10, // Reset page length
      columns: [
          { title: "Item Name" },
          { title: "Item Type" },
          { title: "Date Added" },
          { title: "Quantity" },
          { title: "Actions" },
          { title: "Notes" }
      ],
      lengthMenu: [5, 10, 25, 50],
      searching: false // Disable search since we use custom filters
  });
}



































// Global Variables
let totalItems = 0;
let chickenCount = 0;
let beefCount = 0;
let vegetablesCount = 0;
let fruitsCount = 0;
let preppedIngredientCount = 0;
let dessertCount = 0;
let lunchItemCount = 0;
let dairyCount = 0;
let otherCount = 0;
let oldestItems = [];
let soonExpireItems = [];

// Dashboard Functions
// Fetch dashboard data for overview stats, charts, and lists
function fetchDashboardData() {
  const dataRef = database.ref("users/Riley");
  dataRef.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
          const item = childSnapshot.val();
          const itemType = item.itemType || [];
          const dateAdded = item.dateAdded;
          const quantity = item.quantity || 0;

          // Update the total item count
          totalItems += parseInt(quantity, 10);

          // Update category counts
          itemType.forEach(type => {
              if (type.includes('CHICKEN')) chickenCount += parseInt(quantity, 10);
              else if (type.includes('BEEF')) beefCount += parseInt(quantity, 10);
              else if (type.includes('VEGETABLE')) vegetablesCount += parseInt(quantity, 10);
              else if (type.includes('FRUIT')) fruitsCount += parseInt(quantity, 10);
              else if (type.includes('PREPPED INGREDIENT')) preppedIngredientCount += parseInt(quantity, 10);
              else if (type.includes('DESSERT')) dessertCount += parseInt(quantity, 10);
              else if (type.includes('QUICK LUNCH ITEM')) lunchItemCount += parseInt(quantity, 10);
              else if (type.includes('DAIRY')) dairyCount += parseInt(quantity, 10);
              else otherCount += parseInt(quantity, 10);
          });

          // Add to oldest or soon-to-expire items
          const itemDate = new Date(dateAdded);
          const today = new Date();
          const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));

          if (daysDiff > 180) {
              soonExpireItems.push({ name: item.itemName, dateAdded, quantity });
          } else {
              oldestItems.push({ name: item.itemName, dateAdded, quantity });
          }
      });

      // Update the dashboard summary cards (check if elements exist first)
      if (document.getElementById('total-items')) {
          document.getElementById('total-items').innerText = totalItems;
      }
      if (document.getElementById('total-chicken')) {
          document.getElementById('total-chicken').innerText = chickenCount;
      }
      if (document.getElementById('total-beef')) {
          document.getElementById('total-beef').innerText = beefCount;
      }
      if (document.getElementById('total-vegetables')) {
          document.getElementById('total-vegetables').innerText = vegetablesCount;
      }
      if (document.getElementById('total-fruits')) {
          document.getElementById('total-fruits').innerText = fruitsCount;
      }
      if (document.getElementById('total-prepped-ingredient')) {
          document.getElementById('total-prepped-ingredient').innerText = preppedIngredientCount;
      }
      if (document.getElementById('total-dessert')) {
          document.getElementById('total-dessert').innerText = dessertCount;
      }
      if (document.getElementById('total-lunch-item')) {
          document.getElementById('total-lunch-item').innerText = lunchItemCount;
      }
      if (document.getElementById('total-dairy')) {
          document.getElementById('total-dairy').innerText = dairyCount;
      }
      if (document.getElementById('total-other')) {
          document.getElementById('total-other').innerText = otherCount;
      }

      // Render tables and charts
      renderOldestItems();
      renderSoonExpireItems();
      renderInventoryChart();
      
  });
}

// Render Oldest Items Table
function renderOldestItems() {
  const oldestItemsTable = document.getElementById('oldest-items-list');
  oldestItemsTable.innerHTML = ''; // Clear existing data
  oldestItems.forEach(item => {
      const row = `<tr><td>${item.name}</td><td>${formatDate(item.dateAdded)}</td><td>${item.quantity}</td></tr>`;
      oldestItemsTable.innerHTML += row;
  });
}

// Render Soon-to-Expire Items Table
function renderSoonExpireItems() {
  const soonExpireTable = document.getElementById('soon-expire-list');
  soonExpireTable.innerHTML = ''; // Clear existing data
  soonExpireItems.forEach(item => {
      const row = `<tr><td>${item.name}</td><td>${formatDate(item.dateAdded)}</td><td>${item.quantity}</td></tr>`;
      soonExpireTable.innerHTML += row;
  });
}

// Render Pie Chart and Display Labels Next to It
function renderInventoryChart() {
  const ctx = document.getElementById('inventoryChart').getContext('2d');
  const totalItemsForChart = chickenCount + beefCount + vegetablesCount + fruitsCount + preppedIngredientCount + dessertCount + lunchItemCount + dairyCount + otherCount;

  // Update the total items above the chart
  document.getElementById('total-items-chart').innerText = totalItemsForChart;

  const data = [chickenCount, beefCount, vegetablesCount, fruitsCount, preppedIngredientCount, dessertCount, lunchItemCount, dairyCount, otherCount];
  const labels = ['Chicken', 'Beef', 'Vegetables', 'Fruits', 'Prepped Ingredients', 'Desserts', 'Quick Lunch Items', 'Dairy', 'Other'];
  const colors = ['tomato', 'saddlebrown', 'green', 'orange', 'darksalmon', 'black', 'blueviolet', 'lightskyblue', 'gray'];

  new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              label: 'Inventory Breakdown',
              data: data,
              backgroundColor: colors,
          }]
      },
      options: {
          // responsive: true,
          plugins: {
              legend: {
                  display: false, // Disable default legend to create custom one
              }
          }
      }
  });

  // Create custom labels to display next to the chart
  const chartLabelsContainer = document.getElementById('chart-labels');
  chartLabelsContainer.innerHTML = ''; // Clear previous labels

  labels.forEach((label, index) => {
      const labelElement = document.createElement('div');
      labelElement.classList.add('chart-label');

      // Create a color box for the label
      const colorBox = document.createElement('div');
      colorBox.classList.add('chart-color-box');
      colorBox.style.backgroundColor = colors[index];

      // Create the label text
      const labelText = document.createElement('span');
      labelText.innerText = `${label}: ${data[index]}`;

      // Append color box and label text
      labelElement.appendChild(colorBox);
      labelElement.appendChild(labelText);

      // Append the label element to the container
      chartLabelsContainer.appendChild(labelElement);
  });
}



// Date formatting utility
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
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