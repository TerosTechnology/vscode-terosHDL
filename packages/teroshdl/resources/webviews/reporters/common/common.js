////////////////////////////////////////////////////////////////////////////////
// Table Height
////////////////////////////////////////////////////////////////////////////////
function adjustTableHeight() {
    var windowHeight = window.innerHeight;
    var tableContainer = document.getElementById('scrollableTableContainer');
    var offsetTop = tableContainer.getBoundingClientRect().top;
    var maxTableHeight = windowHeight - offsetTop - 20;

    tableContainer.style.maxHeight = maxTableHeight + 'px';
    tableContainer.style.overflowY = 'auto';
}

window.onload = adjustTableHeight;
window.onresize = adjustTableHeight;

////////////////////////////////////////////////////////////////////////////////
// Sort Table
////////////////////////////////////////////////////////////////////////////////
var currentDir = {};

function sortTable(column, headerElement) {
    var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
    table = document.querySelector('.table');
    switching = true;

    dir = currentDir[column] === 'asc' ? 'desc' : 'asc';
    currentDir[column] = dir;

    resetSortingIcons();
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('TD')[column].textContent.trim();
            y = rows[i + 1].getElementsByTagName('TD')[column].textContent.trim();

            var xVal = parseFloat(x);
            var yVal = parseFloat(y);

            if (isNaN(xVal) || isNaN(yVal)) {
                xVal = x.toLowerCase();
                yVal = y.toLowerCase();
            }

            if (dir === 'asc' ? xVal > yVal : xVal < yVal) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        }
    }
    updateSortingIcon(headerElement, dir);
}

function resetSortingIcons() {
    var headers = document.querySelectorAll('.sorting');
    headers.forEach(function (header) {
        header.innerHTML = '&#8597;';
    });
}

function updateSortingIcon(headerElement, direction) {
    var icon = headerElement.querySelector('.sorting');
    icon.innerHTML = direction === 'asc' ? '&#8593;' : '&#8595;';
}
