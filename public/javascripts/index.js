window.onload = function () {
    var resultsContainer = document.getElementById('search-results-container');
    var searchInput = document.getElementById('search');
    resultsContainer.style.display = 'none';
    showProverbContainer();
    searchInput.addEventListener('input', performSearch);
};

function showProverbContainer() {
    var proverbContainer = document.getElementById('proverb-title-container');
    proverbContainer.style.display = 'block';
}

function hideProverbContainer() {
    var proverbContainer = document.getElementById('proverb-title-container');
    proverbContainer.style.display = 'none';
}

function appendText(titleName) {
    var searchInput = document.getElementById('search');
    searchInput.value += ' ' + titleName;
    hideProverbContainer();
    performSearch();
}

function performSearch() {
    var query = document.getElementById('search').value;
    var resultsContainer = document.getElementById('search-results-container');

    if (!query) {
        resultsContainer.style.display = 'none';
        showProverbContainer();
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
            .catch(error => {
                console.error('Error:', error);
                resultsContainer.innerHTML = '<p>Error fetching results</p>';
            });
    }
}

function displaySearchResults(results, query) {
    var resultsContainer = document.getElementById('search-results-container');

    if (results.length === 0) {
        resultsContainer.innerHTML = '<span class="no-results">No Results Found</span>';
        var noResultsParagraph = resultsContainer.querySelector('.no-results');
        applyStylesToElement(noResultsParagraph, {
            fontSize: '30px',
            color: 'black'
        });

        applyStylesToElement(resultsContainer, {
            width: '88%',
            height: '100%'
        });

        hideProverbContainer();
    } else {
        resultsContainer.innerHTML = '';

        results.forEach((result, index) => {
            const card = createCard(result, query, index + 1);
            resultsContainer.appendChild(card);
        });
    }
}

function applyStylesToElement(element, styles) {
    for (var property in styles) {
        if (styles.hasOwnProperty(property)) {
            element.style[property] = styles[property];
        }
    }
}

function createCard(result, query, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    const proverbName = highlightQuery(result.ProverbName, query);
    const proverbDesp = highlightQuery(result.ProverbDesp, query);

    card.innerHTML = `
        <div class="card-header">
            <h5>${index}. ${proverbName}</h5>
        </div>
        <div class="card-body">
            <p>${proverbDesp}</p>
        </div>
    `;

    return card;
}

function highlightQuery(text, query) {
    return text.replace(new RegExp(query, 'gi'), match => `<span style="color: red;">${match}</span>`);
}
