let jsonData = [];

// Function to fetch JSON data from the provided URL and display it in a table
async function fetchDataAndDisplay() {
const url = "https://script.google.com/macros/s/AKfycbyzyz9ArXTwgQnQbM1IfZvYbyTGEdYgiM2dFDeAoLOAF94v04sWx5tDVjpXdIk33Wu51w/exec";

try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    if (!data || !data.GoogleSheetData) {
        throw new Error('Invalid data format');
    }
    jsonData = data.GoogleSheetData;
    displayData(jsonData);
    generateSuggestions(jsonData);
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

// Function to display JSON data in the table
function displayData(data) {
    const table = document.getElementById("jsonTable");
    table.innerHTML = "";

    // Create table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Adjusted to start from index 1, assuming index 0 is the item picture
    for (let i = 0; i < data[0].length; i++) {
        if (i !== 4) { // Skip index 0 (item picture) and index 4 (fifth column)
            const th = document.createElement("th");
            th.textContent = data[0][i];
            headerRow.appendChild(th);
        }
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < data[i].length; j++) {
            if (j !== 4) { // Skip index 0 (item picture) and index 4 (fifth column)
                const cell = document.createElement("td");
                cell.textContent = data[i][j];
                row.appendChild(cell);
            }
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
     // Add alternating row background color
     const rows = table.querySelectorAll("tbody tr:nth-child(even)");
    rows.forEach(row => {
        row.style.backgroundColor = "#b6d2f9"; // Light gray background
    });
}



        // Function to filter table rows based on search input
        function filterTable() {
            const searchInput = document.getElementById("searchInput").value.toLowerCase();
            const filteredData = jsonData.filter(row => row[1].toLowerCase().includes(searchInput));
            displayData(filteredData);
        }

        // Function to generate suggestions based on items in column 2
        function generateSuggestions(data) {
            const suggestionsDatalist = document.getElementById("suggestions");
            const itemNames = data.slice(1).map(row => row[1]);
            const uniqueItemNames = [...new Set(itemNames)]; // Remove duplicates
            uniqueItemNames.forEach(itemName => {
                const option = document.createElement("option");
                option.value = itemName;
                suggestionsDatalist.appendChild(option);
            });
        }

        // Function to submit search
        function submitSearch() {
            const searchInput = document.getElementById("searchInput").value.trim();
            if (searchInput !== "") {

              const url = "https://script.google.com/macros/s/AKfycbxbS3U1ldiBSLrKawlnNuw0e_Lnpe3tqaVvm0zNUWAATlKZsb0vBvy0tXRmC5ru9oRofA/exec?" + encodeURIComponent(searchInput);
              console.log(url)
              window.open(url, '_blank');
            } else {
                alert("Please enter a search term.");
            }
        }

        // Call the function to fetch and display JSON data when the page loads
        window.onload = fetchDataAndDisplay;