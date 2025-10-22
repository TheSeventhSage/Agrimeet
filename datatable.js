class VanillaDataTable {
    constructor(tableId, options = {}) {
        this.table = document.getElementById(tableId);
        if (!this.table) {
            console.error(`Table with id "${tableId}" not found.`);
            return;
        }

        // Configuration
        this.rowsPerPage = options.rowsPerPage || 5;
        this.enabledFilters = options.filters || ['search', 'select', 'startDate', 'endDate'];

        // State
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';

        // Element references scoped to the table's container
        this.container = this.table.closest('.datatable-container');
        this.thead = this.table.querySelector('thead');
        this.tbody = this.table.querySelector('tbody');
        this.originalRows = Array.from(this.tbody.querySelectorAll('tr:not(.no-results-row)'));
        this.noResultsRow = this.tbody.querySelector('.no-results-row');
        this.paginationControls = this.container.querySelector('.datatable-pagination');
        this.filterInputs = {};

        this.init();
    }

    init() {
        this.setupFilters();
        this.makeHeadersSortable();
        this.attachEventListeners();
        this.render();
    }

    setupFilters() {
        this.enabledFilters.forEach(filterType => {
            const input = this.container.querySelector(`[data-filter="${filterType}"]`);
            if (input) {
                this.filterInputs[filterType] = input;
            }
        });
    }

    makeHeadersSortable() {
        this.thead.querySelectorAll('th').forEach((header, index) => {
            header.classList.add('sortable');
            header.innerHTML += `<span class="sort-arrow">↕</span>`;
            header.addEventListener('click', () => this.handleSort(index));
        });
    }

    attachEventListeners() {
        Object.values(this.filterInputs).forEach(input => {
            if (input) input.addEventListener('change', () => {
                this.currentPage = 1;
                this.render();
            });
        });
    }

    handleSort(columnIndex) {
        if (this.sortColumn === columnIndex) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = columnIndex;
            this.sortDirection = 'asc';
        }
        this.updateSortArrows();
        this.render();
    }

    updateSortArrows() {
        this.thead.querySelectorAll('th').forEach((header, index) => {
            const arrow = header.querySelector('.sort-arrow');
            arrow.textContent = '↕';
            arrow.classList.remove('asc', 'desc');
            if (index === this.sortColumn) {
                arrow.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
                arrow.classList.add(this.sortDirection);
            }
        });
    }

    getColumnIndex(columnName) {
        let columnIndex = -1;
        this.thead.querySelectorAll('th').forEach((th, index) => {
            if (th.dataset.columnName === columnName) {
                columnIndex = index;
            }
        });
        return columnIndex;
    }

    getFilteredAndSortedRows() {
        let filteredRows = this.originalRows.filter(row => {
            let passesAllFilters = true;

            // Search filter (searches all cells)
            const searchInput = this.filterInputs.search;
            if (searchInput && searchInput.value) {
                const searchValue = searchInput.value.toLowerCase();
                if (!row.textContent.toLowerCase().includes(searchValue)) {
                    passesAllFilters = false;
                }
            }

            // Select filters (per column)
            const selectInputs = this.container.querySelectorAll('[data-filter="select"]');
            selectInputs.forEach(select => {
                const colName = select.dataset.filterFor;
                const colIndex = this.getColumnIndex(colName);
                if (colIndex !== -1 && select.value) {
                    const cellValue = row.cells[colIndex].textContent.trim().toLowerCase();
                    if (cellValue !== select.value.toLowerCase()) {
                        passesAllFilters = false;
                    }
                }
            });

            // Date range filter
            const startDateInput = this.filterInputs.startDate;
            const endDateInput = this.filterInputs.endDate;
            if (startDateInput && endDateInput) {
                const dateColName = startDateInput.dataset.filterFor;
                const dateColIndex = this.getColumnIndex(dateColName);
                if (dateColIndex !== -1) {
                    const rowDate = new Date(row.cells[dateColIndex].textContent);
                    const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
                    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
                    if (startDate && rowDate < startDate) passesAllFilters = false;
                    if (endDate && rowDate > endDate) passesAllFilters = false;
                }
            }

            return passesAllFilters;
        });

        // Sorting
        if (this.sortColumn !== null) {
            const header = this.thead.querySelectorAll('th')[this.sortColumn];
            const dataType = header.dataset.type || 'string';
            filteredRows.sort((a, b) => {
                let valA = a.cells[this.sortColumn].textContent.trim();
                let valB = b.cells[this.sortColumn].textContent.trim();
                if (dataType === 'date') {
                    valA = new Date(valA); valB = new Date(valB);
                } else if (dataType === 'currency') {
                    valA = parseFloat(valA.replace(/[$,]/g, ''));
                    valB = parseFloat(valB.replace(/[$,]/g, ''));
                }
                if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filteredRows;
    }

    renderPagination(totalRows) {
        const pageCount = Math.ceil(totalRows / this.rowsPerPage);
        this.paginationControls.innerHTML = '';
        if (pageCount <= 1) return;

        const startItem = (this.currentPage - 1) * this.rowsPerPage + 1;
        const endItem = Math.min(startItem + this.rowsPerPage - 1, totalRows);
        const summary = `<span class="text-sm text-gray-700">Showing <span class="font-semibold">${startItem}</span> to <span class="font-semibold">${endItem}</span> of <span class="font-semibold">${totalRows}</span> Results</span>`;

        let buttons = '';
        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
        const nextDisabled = this.currentPage === pageCount ? 'disabled' : '';
        buttons += `<button data-page="prev" ${prevDisabled} class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>`;
        for (let i = 1; i <= pageCount; i++) {
            const activeClass = i === this.currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white';
            buttons += `<button data-page="${i}" class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 ${activeClass}">${i}</button>`;
        }
        buttons += `<button data-page="next" ${nextDisabled} class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>`;
        this.paginationControls.innerHTML = `${summary}<div class="flex items-center space-x-2">${buttons}</div>`;

        this.paginationControls.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const pageAction = e.currentTarget.dataset.page;
                if (pageAction === 'prev') this.currentPage--;
                else if (pageAction === 'next') this.currentPage++;
                else this.currentPage = parseInt(pageAction, 10);
                this.render();
            });
        });
    }

    render() {
        const processedRows = this.getFilteredAndSortedRows();
        this.tbody.innerHTML = '';
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        const paginatedRows = processedRows.slice(start, end);

        if (paginatedRows.length > 0) {
            paginatedRows.forEach(row => this.tbody.appendChild(row));
            this.noResultsRow.classList.add('hidden');
        } else {
            this.noResultsRow.classList.remove('hidden');
            this.tbody.appendChild(this.noResultsRow);
        }
        this.renderPagination(processedRows.length);
    }
}


/**
 * 
 * 
 */
