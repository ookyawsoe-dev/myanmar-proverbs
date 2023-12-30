window.onload = function () {
    var resultsContainer = document.getElementById('search-results-container');
    resultsContainer.style.display = 'none';
}
function performSearch() {
    var query = document.getElementById('search').value;
    var resultsContainer = document.getElementById('search-results-container');

    if (!query) {
        alert("သင်ရှာလိုသော စကားပုံကို ထည့်ပြီးမှ ရှာဖွေပါ");
        resultsContainer.style.display = 'none';
    } else {
        fetch(`/search?q=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displaySearchResults(data);
                resultsContainer.style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
    }
}

function displaySearchResults(results) {
    var resultsContainer = document.getElementById('search-results-container');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
    } else {
        results.forEach((result, index) => {
            // Create a card element
            const card = document.createElement('div');
            card.classList.add('card');

            // Populate the card with result data
            card.innerHTML = `
                <div class="card-header">
                    <h5>${index + 1}. ${result.ProverbName}</h5>
                </div>
                <div class="card-body">
                    <p>${result.ProverbDesp}</p>
                </div>
            `;

            // Append the card to the results container
            resultsContainer.appendChild(card);
        });
    }
}
