// popup.js

function displayTrackedTime() {
    chrome.storage.local.get({ trackedSites: {} }, (result) => {
        const trackedSites = result.trackedSites || {};
        const trackedSitesTable = document.getElementById('tracked-sites');
        const currentDate = new Date().toLocaleDateString();
        // Clear the existing table
        trackedSitesTable.innerHTML = '';

        // Create table header
        const tableHeader = document.createElement('tr');
        tableHeader.innerHTML = '<th>URL</th><th>Time Spent (minutes)</th>';
        trackedSitesTable.appendChild(tableHeader);

        // Display tracked time for each site in the table
        if (Object.keys(trackedSites).length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = '<td colspan="3">No tracked sites yet.</td>';
            trackedSitesTable.appendChild(noDataRow);
        } else {
            for (const [url, data] of Object.entries(trackedSites)) {
                console.log(data[currentDate])
                const tableRow = document.createElement('tr');

                // Extract the hostname from the URL for the sitelogo (you may need to customize this)
                const URL = document.createElement('td');
                URL.textContent = url.split('/')[2]; // Extracting the hostname, you might need to adjust this

                const timeSpent = document.createElement('td');
                console.log('data.totalTime:', data[currentDate].totalTime);
                const totalTimeMinutes = (data[currentDate].totalTime/(60*1000)).toFixed(2)
                console.log('totalTimeMinutes:', totalTimeMinutes);

                timeSpent.textContent = `${totalTimeMinutes} minutes`;

                tableRow.appendChild(URL);
                tableRow.appendChild(timeSpent);

                trackedSitesTable.appendChild(tableRow);
            }
        }
    });
}


function resetTrackedTime() {
chrome.storage.local.set({ trackedSites: {} }, () => {
    console.log('Tracked time reset.');
    displayTrackedTime();
});
}

// Add event listener for the reset button
document.getElementById('reset-button').addEventListener('click', resetTrackedTime);

// Display tracked time when the popup is opened
displayTrackedTime();  