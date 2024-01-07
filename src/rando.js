function displayTrackedTime() {
    chrome.storage.local.get({ trackedSites: {} }, (result) => {
      const trackedSites = result.trackedSites || {};
      const trackedSitesTable = document.getElementById('tracked-sites');
      const currentDate = new Date().toLocaleDateString();
  
      // Clear the existing table
      trackedSitesTable.innerHTML = '';
  
      // Create table header
      const tableHeader = document.createElement('tr');
      tableHeader.innerHTML = '<th>URL</th><th>Time Wasted</th><th>Set Max</th>';
      trackedSitesTable.appendChild(tableHeader);
  
      // Display tracked time for each site in the table
      if (Object.keys(trackedSites).length === 0) {
        // ... (unchanged)
      } else {
        // Sort trackedSites by total time spent (descending order)
        const sortedSites = Object.entries(trackedSites).sort((a, b) => {
          const totalTimeA = a[1][currentDate]?.totalTime || 0;
          const totalTimeB = b[1][currentDate]?.totalTime || 0;
          return totalTimeB - totalTimeA;
        });
  
        for (const [url, data] of sortedSites) {
          const tableRow = document.createElement('tr');
  
          // Extract the hostname from the URL for the sitelogo (you may need to customize this)
          const URL = document.createElement('td');
          
          // Defines the undifined time
          if (url.split('/')[2] == undefined){
            URL.textContent = `random`
          }
          else{
            URL.textContent = url.split('/')[2]; // Extracting the hostname, you might need to adjust this
          }

          const timeSpent = document.createElement('td');
          const totalTimeMinutes = (data[currentDate]?.totalTime || 0) / (1000 * 60);
          timeSpent.textContent = `${totalTimeMinutes.toFixed(2)} minutes`;
  
          const setMaxMinutes = document.createElement('td');
          const maxMinutesInput = document.createElement('input');
          maxMinutesInput.type = 'text';
          maxMinutesInput.value = data[currentDate]?.maxMinutes || ''; // Display the current value if set
          maxMinutesInput.placeholder = 'Minutes';
          maxMinutesInput.addEventListener('change', (event) => {
            const newValue = parseFloat(event.target.value) || 0;
            data[currentDate].maxMinutes = newValue;
            chrome.storage.local.set({ trackedSites }, () => {
              displayTrackedTime(); // Update display after setting max minutes
            });
          });
  
          setMaxMinutes.appendChild(maxMinutesInput);
  
          tableRow.appendChild(URL);
          tableRow.appendChild(timeSpent);
          tableRow.appendChild(setMaxMinutes);
  
          trackedSitesTable.appendChild(tableRow);
        }
      }
    });
  }
