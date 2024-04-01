function searchButtonClicked() {
    var searchInput = document.getElementById('searchInput');
    var searchValue = searchInput.value;
    if (searchValue) {
        window.location.href = '/search/' + searchValue;
    }
    else {
        alert('Please enter a search term');
    }
}
function searchInputKeyPressed(event) {
    if (event.key === 'Enter') {
        searchButtonClicked();
    }
}


