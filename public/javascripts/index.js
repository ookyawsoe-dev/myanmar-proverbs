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
                displaySearchResults(data, query);
                resultsContainer.style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
    }
}

function displaySearchResults(results, query) {
    var resultsContainer = document.getElementById('search-results-container');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No Results Found</p>';
    } else {
        results.forEach((result, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            const proverbName = result.ProverbName.replace(new RegExp(query, 'gi'), match => `<span style="color: red;">${match}</span>`);
            const proverbDesp = result.ProverbDesp.replace(new RegExp(query, 'gi'), match => `<span style="color: red;">${match}</span>`);

            card.innerHTML = `
                <div class="card-header">
                    <h5>${index + 1}. ${proverbName}</h5>
                </div>
                <div class="card-body">
                    <p>${proverbDesp}</p>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
}
