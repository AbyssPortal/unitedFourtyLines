let leaderboardDiv = document.getElementById("leaderboardTable");

// Create a new XMLHttpRequest object
let xhr = new XMLHttpRequest();

// Configure it to fetch the JSON file
xhr.open('GET', 'data.json', true);



// Set up a callback function to handle the response
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
        // If the request was successful, parse the JSON
        const data = JSON.parse(xhr.responseText);
        for (const i of data.keys() ) {
            const game = data[i]
            let gameRow = document.createElement("tr");
            let posCol = document.createElement("td")
            posCol.textContent = `#${i + 1} `;
            gameRow.appendChild(posCol)
            let nameCol = document.createElement("td")
            nameCol.textContent = game.username;
            gameRow.appendChild(nameCol)
            let timeCol = document.createElement("td");
            timeCol.textContent = game.time.toString().substring(0, 6);
            gameRow.appendChild(timeCol);
            let replayCol = document.createElement("td");
            replayCol.innerHTML = `<a href = ${game.url}> Link</a>`;
            gameRow.appendChild(replayCol);
            let platformCol = document.createElement("td");
            platformCol.innerHTML = `<image src = ${game.platform}.ico height=16 width=16 \\>`;
            gameRow.appendChild(platformCol);
            leaderboardDiv.appendChild(gameRow);
        }
        console.log(data);
    } else {
        // If there was an error, handle it here
        console.error('Error loading JSON file:', xhr.status, xhr.statusText);
    }
};

// Handle network errors
xhr.onerror = function() {
    console.error('Network error while trying to fetch JSON file');
};

// Send the request
xhr.send();