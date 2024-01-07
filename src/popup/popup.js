function displayTrackedTime() {
chrome.storage.local.get({ trackedSites: {} }, (result) => {
    const trackedSites = result.trackedSites || {};
    const currentDate = new Date().toLocaleDateString();

    // Create a map to store the accumulated times for each unique name
    const nameSumMap = {};

    // Iterate through tracked sites and accumulate times
    for (const [url, data] of Object.entries(trackedSites)) {
    const name = (url.split('/')[2] || 'random'); // Extracting the hostname, you might need to adjust this

    const totalTimeMinutes = (data[currentDate]?.totalTime || 0) / (1000 * 60);

    // Check if the name already exists in the map
    if (nameSumMap.hasOwnProperty(name)) {
        // If the name exists, add the minutes to the existing sum
        nameSumMap[name].totalMinutes += totalTimeMinutes;
    } else {
        // If the name is not in the map, initialize the sum
        nameSumMap[name] = {
        totalMinutes: totalTimeMinutes,
        maxMinutes: data[currentDate]?.maxMinutes || 0,
        };
    }
    }

    // Create a new table with no duplicate names and summed times
    const newTable = document.createElement('table');
    const headerRow = newTable.createTHead().insertRow(0);
    headerRow.innerHTML = '<th>Name</th><th>Sum of Minutes</th><th>Set Max</th>';

    for (const name in nameSumMap) {
    const { totalMinutes, maxMinutes } = nameSumMap[name];

    // Create a new row for each tracked site
    const newRow = newTable.insertRow();

    // Add cells for name and total time
    newRow.insertCell(0).textContent = name;
    newRow.insertCell(1).textContent = totalMinutes.toFixed(2) + ' minutes';

    // Add cell for setting max minutes
    const setMaxMinutesCell = newRow.insertCell(2);
    const maxMinutesInput = document.createElement('input');
    maxMinutesInput.type = 'text';
    maxMinutesInput.value = maxMinutes || '';
    maxMinutesInput.placeholder = 'Minutes';
    maxMinutesInput.addEventListener('change', (event) => {
        const newValue = parseFloat(event.target.value) || 0;
        nameSumMap[name].maxMinutes = newValue;
        chrome.storage.local.set({ trackedSites }, () => {
        displayTrackedTime(); // Update display after setting max minutes
        });
    });

    setMaxMinutesCell.appendChild(maxMinutesInput);
    }

    // Replace the existing table with the new one
    const trackedSitesTable = document.getElementById('tracked-sites');
    trackedSitesTable.innerHTML = '';
    trackedSitesTable.appendChild(newTable);
});
}  

function resetTrackedTime() {
chrome.storage.local.set({ trackedSites: {} }, () => {
    console.log('Tracked time reset.');
    displayTrackedTime();
});
}

document.addEventListener('DOMContentLoaded', function () {
    displayTrackedTime();
    document.getElementById('reset-button').addEventListener('click', resetTrackedTime);
  });

// Add event listener for the reset button
document.getElementById('reset-button').addEventListener('click', resetTrackedTime);

// Display tracked time when the popup is opened
displayTrackedTime();  