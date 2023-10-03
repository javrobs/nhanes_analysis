// Constants for:
// 1. The URL:
const URL = '/queries';
// 2. The desktop button:
const desktopButtonDiv = document.querySelector('#desktop-button-div');
const desktopButton = document.querySelector('#desktop-button');
// 3. The mobile version:
const mobileButtons = document.querySelectorAll('.mobile-button');
const mobileTabs = document.querySelectorAll('.mobile-tab');
const instructionsButton = document.querySelector('#instructions-button');
const filterButton = document.querySelector('#filter-button');
const plotContainerButton = document.querySelector('#plot-container-button');
// 4. The instructions container:
const instructionsContainer = document.querySelector('#instructions-container');
// 5. The filters:
const filterContainer = document.querySelector('#filter-container');
const year2007 = document.querySelector('#first-year');
const parentDiv = document.querySelector('#filter-by');
// 6. The plot container:
const plotContainer = document.querySelector('#plot-container');
const mobileNoGraphMessage = document.querySelector('#mobile-no-graph-message');
const plotArea = document.querySelector('#plot');
const errorMessage = document.querySelector('#error-message');
const breadcrumbDiv = document.querySelector('#breadcrumb');
const missingValueDiv=document.querySelector("#missingValuesNote");
const legendDiv=document.querySelector('#legend');

// Variables for the tooltips:
var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// This listener enables the mobile buttons to change the tab in the mobile version:
mobileButtons.forEach(each => {
    each.addEventListener('click', showTab);
});

// This function calls the server and gets the data to correctly populate the filter dropdown and the graph:
function filter(element) {
    // Local variables declared:
    let column; // This is the variable that defines what the graph shows.
    let filterCount;
    let filtersDictionary = {};
    let caseOfFilter;
    // Local variables assigned that reads the filters and categories:
    let currentFilter = document.querySelector(".current-filter"); // This is the most recent filter.
    let pastFilters = document.querySelectorAll(".filter:not(.current-filter)"); // These are the filters created before 'currentFilter'.
    let categories = document.querySelectorAll(".category");
    // This condition prepares the data that will be sent to the server:
    // 1. In this case, the 'filter' function was run by a past filter:
    if (element.classList.contains("filter")&&(element.classList.contains("current-filter")===false)) {
        // 'column' gets the value from the filter that runs the function:
        column = element.value;
        // Gets the identifiable number from the id of the filter:
        filterCount = Number(element.id.split("-")[1]);
        // This loop gets a dictionary of all the filters previous to this one:
        for (let i = 0; i < filterCount - 1; i++) {
            filtersDictionary[pastFilters[i].value] = categories[i].value;
        };
        // This 'killTree' function gets rid of all the filters and categories after the filter:
        killTree(filterCount);
        // Assigns the number of case that is run:
        caseOfFilter = 1;
    // 2. In this case, the function was run by an element when the value of current is default and there are filters selected:
    } else if (currentFilter.value === 'default' && pastFilters.length > 0) {
        // 'lastFilter' equals to the filter right before 'current-filter':
        let lastFilter = pastFilters[pastFilters.length - 1];
        // Gets the identifiable number from the id of 'lastFilter':
        filterCount = Number(lastFilter.id.split("-")[1]);
        // 'column' equals the value of 'lastFilter':
        column = lastFilter.value;
        // This loop gets a dictionary of all the pastFilters before 'lastFilter':
        for (let i = 0; i < pastFilters.length - 1; i++) {
            filtersDictionary[pastFilters[i].value] = categories[i].value;
        };
        // Assigns the number of case that is run:
        caseOfFilter = 2;
    // 3. In this case, the function was run by the current filter:
    } else {
        // 'column' equals the value of 'currentFilter':
        column = currentFilter.value;
        // Gets the identifiable number from the id of 'currentFilter':
        filterCount = Number(currentFilter.id.split("-")[1]);
        // This loop gets a dictionary of all the pastFilters:
        for (let i = 0; i < pastFilters.length; i++) {
            filtersDictionary[pastFilters[i].value] = categories[i].value;
        };
        // Assigns the number of case that is run:
        caseOfFilter = 3;
    };
    console.log({
        column: column,
        previousFilters: filtersDictionary,
        selectedYear: year2007.checked
    })
    // This function is run to inform the desktop version sidebar button and the mobile version 'Graph' button that the 'filter' function was run:
    graphToggle(false);
    // This condition calls the server if the filter has a valid column value:
    if (column !== "default") {
        // Calls the server to get the data:
        fetch(URL, {
            method: 'POST',
            mode: 'cors',
            headers:
            {
                "Content-Type": "application/json"
            },
            // Sends a stringified JSON with the column, the 'filtersDictionary' with the relevant past filters and categories, and the selected year:
            body: JSON.stringify({
                column: column,
                previousFilters: filtersDictionary,
                selectedYear: year2007.checked
            })
        // Waits until a server's response is received:
        }).then(data => data.json()).then(data => {
            mobileNoGraphMessage.classList.add("d-none");
            // This condition defines what to show once the server's response is received:
            // 1. In this case, the received data is plotted:
            if (data.all_data.length > 0) {
                desktopButtonDiv.classList.remove("d-none");
                // This condition defines what will appear in the breadcrumb and whether there will be further filtering available:
                // 1. In this case, further filtering is enabled and the breadcrumb is created:
                if (caseOfFilter!==2) {
                    // This function adds a category under the filter that runs the 'filter' function:
                    createCategory(data, column, filterCount);
                    // This function creates the breadcrumb:
                    buildingBreadcrumb(filterCount);
                // 2. In this case, only the breadcrumb is created:
                } else {
                    // This function creates the breadcrumb without the last category:
                    buildingBreadcrumb(filterCount, false);
                };
                
                breadcrumbDiv.classList.remove("d-none");
                missingValueDiv.classList.remove("d-none");
                legendDiv.classList.remove("d-none");
                legendDiv.classList.add("d-flex");
                plotArea.classList.remove("d-none");
                errorMessage.classList.add("d-none");
                plot(data, year2007.checked);
            // 2. In this case, the 'plotArea' is hidden and an error message is shown:
            } else {
                plotArea.classList.add("d-none");
                breadcrumbDiv.classList.add("d-none");
                missingValueDiv.classList.add("d-none");
                legendDiv.classList.add("d-none");
                legendDiv.classList.remove("d-flex");
                errorMessage.classList.remove("d-none");
                killCategory(filterCount);
            };
        });
    };
};

// This function adds a new category:
function createCategory(data, column, counter) {
    // Check if a category already exists and delete it with "killCategory" function:
    killCategory(counter);
    // Local variable assigned to get the clean string equivalent to the selected column:
    let cleanTextWithinOption = document.querySelector(`option[value=${column}]`).innerHTML;
    // Local variable assigned to read the parent div of the counter:
    let parentDiv = document.querySelector(`#filter-div-${counter}`);
    // This condition defines the title elements that will appear when a category is created:
    // 1. In this case, the first category is created, therefore, a title and an info button and its tooltip are added:
    if (counter === 1) {
        let categoryTitleDiv = document.createElement('div');
        categoryTitleDiv.innerHTML = `<h6 class="py-1 m-0">On <span class="highlight">${cleanTextWithinOption}</span>:</h6>
            <div class="on-hover-parent" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip" data-bs-placement="left" data-bs-html="true" data-bs-title="<b>Select a '${cleanTextWithinOption}' category.</b>">
            <i class="bi bi-info-square-fill icon-info"></i>
            </div>`;
        categoryTitleDiv.classList.add("align-items-baseline");
        categoryTitleDiv.classList.add("d-flex");
        categoryTitleDiv.classList.add("justify-content-between");
        categoryTitleDiv.id = `title-on-${counter}`
        parentDiv.appendChild(categoryTitleDiv);
        tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    // 2. In this case, only the title right above the category dropdown is added:
    } else {
        let h6Title = document.createElement("h6");
        h6Title.innerHTML = `On <span class="highlight">${cleanTextWithinOption}</span>:`
        h6Title.classList.add("py-1");
        h6Title.classList.add("m-0");
        h6Title.id = `title-on-${counter}`
        parentDiv.appendChild(h6Title);
    };
    // Local variables assigned to create new DOM elements:
    let newSelect = document.createElement("select");
    let defaultOption = document.createElement("option");
    // Defines the default option text and its parameters:
    defaultOption.innerHTML = "Select an option..";
    defaultOption.value = "default";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    // Appends the 'defaultOption' element to the newly created select:
    newSelect.appendChild(defaultOption);
    // For each line of the server's response, a new option for the category dropwdown is created:
    data.all_data.forEach(line => {
        // Local variable assigned to read the category from the server's response:
        let text = line["description"];
        // Replaces '~' with spaces:
        text = text.replaceAll("~", " ");
        // This condition adds all the options to the dropdown, except two:
        if (text !== "Don't know" && text !== "Refused") {
            // Local variable assigned to create a new 'option' element:
            let oneOption = document.createElement("option");
            // Adds 'text' to the newly created option element:
            oneOption.innerHTML = text;
            // Adds an id to each option's value:
            oneOption.setAttribute("value", line["id"])
            // Appends the 'oneOption' element to 'newSelect':
            newSelect.appendChild(oneOption);
        };
    });
    // Creates a 'class' and 'id' for the 'newSelect' element:
    newSelect.id = `category-${counter}`;
    newSelect.classList.add("category");
    // This listener creates the next filter when the category is selected:
    newSelect.addEventListener("change", (event) => {
        createNewFilter(event, column, counter + 1);
    });
    // Appends 'newSelect' to the 'parentDiv':
    parentDiv.appendChild(newSelect);
};


//This function checks if there is an existing category and deletes it:
function killCategory(counter){
    // Look up category in document
    let category = document.querySelector(`#category-${counter}`);
    // If it exists remove it, as well as the title and all filter divs after it:
    if (category!==null){
        // Category is removed:
        category.remove();
        // Local variable assigned to read the title of the current category:
        let title = document.querySelector(`#title-on-${counter}`);
        // The title of the current category is removed:
        title.remove();
        // Any filter div after the category is removed:
        killTree(counter);
    }
};

// This function adds a new div and populates it with a new filter:
function createNewFilter(event, column, counter) {
    // Look up if there is a div already created in the document:
    let currentDiv = document.querySelector(`#filter-div-${counter}`)
    // If there is, run kill tree function to delete the div and filter:
    if (currentDiv !== null) killTree(counter - 1);
    // Create a new div to contain the new filter and set up classes and id:
    let newFilterDiv = document.createElement("div");
    newFilterDiv.id = `filter-div-${counter}`;
    newFilterDiv.classList.add('px-3');
    newFilterDiv.classList.add('py-3');
    // Search the document for any filters and remove the current-filter class from all:
    let allFilters = document.querySelectorAll(".filter");
    allFilters.forEach(one => {
        // one.classList.add("filter-past");
        one.classList.remove("current-filter");
    });
    // Create a div element for the title that will go above the filter:
    let title = document.createElement('div');
    // The inner HTML of this div contains the title and an icon button to delete the filter and everything after it through the "iconKillTree" function:
    title.innerHTML = "<h4 class='m-0'>Filter deeper by:</h4> <i class='bi bi-x-square-fill icon-close' onclick='iconKillTree(this);'></i>";
    // Enable flexbox behavior and specify format by classes:
    title.classList.add("pb-2");
    title.classList.add("align-items-baseline");
    title.classList.add("d-flex");
    title.classList.add("justify-content-between");
    // Find the latest filter and clone it to use it as the new element:
    let latestFilter = document.querySelector(`#filter-${counter - 1}`);
    let newFilter = latestFilter.cloneNode(true);
    // Set up the created filter as "current-filter" 
    newFilter.classList.add("current-filter");
    // newFilter.classList.remove("filter-past");
    newFilter.setAttribute("id", `filter-${counter}`);
    let optionToRemove = newFilter.querySelector(`[value=${column}]`);
    newFilter.removeChild(optionToRemove);
    newFilterDiv.appendChild(title);
    newFilterDiv.appendChild(newFilter);
    parentDiv.appendChild(newFilterDiv);
    changeFilterBackground(counter);
};

function killTree(numberOfFiltersToKeep) {
    console.log('killed a Tree!!', numberOfFiltersToKeep);
    let currentFilter = document.querySelector('.current-filter');
    let currentFilterCount = Number(currentFilter.id.split("-")[1]);
    console.log(currentFilter, currentFilterCount);
    for (let i = numberOfFiltersToKeep + 1; i <= currentFilterCount; i++) {
        let divToDelete = document.querySelector(`#filter-div-${i}`);
        console.log(i);
        divToDelete.remove();
    };
    let killingFilter = document.querySelector(`#filter-${numberOfFiltersToKeep}`);
    killingFilter.classList.add("current-filter");
    // killingFilter.classList.remove("filter-past");
    buildingBreadcrumb(numberOfFiltersToKeep, false);
};

function iconKillTree(element) {
    let iconParentDiv = element.parentElement.parentElement;
    let numberIcon = iconParentDiv.id.split("-")[2];
    console.log(element, iconParentDiv, numberIcon);
    killTree(numberIcon - 1);
    let selectedFilter = document.querySelector(`#filter-${numberIcon - 1}`)
    filter(selectedFilter);
};

// This function builds a breadcrumb based on a chosen number of filters and whether the last category needs to be in the breadcrumb:
function buildingBreadcrumb(filterCount, showLastCategory=true) {
    // Initialized a local string:
    let breadcrumbString = "";
    // Ran a loop to read the values of filters and categories to string:
    for (let i = 1; i <= filterCount; i++) {
        let filter = document.querySelector(`#filter-${i}>option:checked`).innerHTML;
        let category = document.querySelector(`#category-${i}>option:checked`);
        // Created a ternary to format only the last filter on the breadcrumb:
        breadcrumbString += (i == filterCount) ? "<b class='last-breadcrumb'>" + filter + "</b>" : "<b>" + filter + "</b>";
        // Created a condition to add the categories to the breadcrumb if
        // 1. the current category exists AND
        // 2. the value is not 'default' AND
        // 3. whenever 'showLastCategory' is true OR the last isn't being run:
        if (category !== null && category.value !== 'default' && (showLastCategory || i<filterCount)) {
            category = category.innerHTML;
            breadcrumbString += "&nbsp- " + category + '&nbsp <i class="bi bi-arrow-right d-flex align-content-center"></i>&nbsp ';
        };
    };
    // Added the string to the breadcrumb div:
    breadcrumbDiv.innerHTML = breadcrumbString;
};

function changeFilterBackground(counter) {
    // let style = getComputedStyle(document.querySelector('#filter-div-1'));
    // let backgroundColor = style.backgroundColor;
    // console.log(backgroundColor);
    // backgroundColor.split(",")
    for (let i = 1; i <= counter; i++) {
        let filterDiv = document.querySelector(`#filter-div-${i}`);
        filterDiv.style = `background-color: rgba(31, 90, 132, ${i / counter});`
    };
};

function showTab(event) {
    let element = (event.target.tagName==='I')?event.target.parentElement:event.target;
    console.log(element);
    // let tabID = element.id.split('-button')[0];
    // mobileButtons.forEach(each => {
    //     if (each===element){
    //         each.classList.add("active");
    //     } else {
    //         each.classList.remove("active");
    //     };
    // });
    // console.log(tabID);
    // let tab = document.querySelector(`#${tabID}`);
    // mobileTabs.forEach(each => {
    //     if (each===tab){
    //         each.classList.remove('mobile-tab-inactive');
    //     } else {
    //         each.classList.add('mobile-tab-inactive');
    //     };
    // });
    switch (element.id) {
        case 'plot-container-button':
            graphToggle(false);
            resizedWindow();
            console.log('hello');
            break;
        case 'instructions-button':
            aboutToggle();
            break;
        case 'filter-button':
            mobileButtons.forEach(each => {
                if (each === filterButton) {
                    each.classList.add("active");
                } else {
                    each.classList.remove("active");
                };
            });
            mobileTabs.forEach(each => {
                if (each === filterContainer) {
                    each.classList.remove('mobile-tab-inactive');
                } else {
                    each.classList.add('mobile-tab-inactive');
                };
            });
    };
};

function aboutToggle() {
    instructionsContainer.classList.remove("d-none");
    plotContainer.classList.add("d-none");
    desktopButton.classList.add('graph-button');
    desktopButton.classList.remove('about-button');
    desktopButton.innerHTML = '<i class="bi bi-bar-chart-fill pe-1"></i>Graph';
    desktopButton.setAttribute('onclick', 'graphToggle();');
    mobileButtons.forEach(each => {
        if (each === instructionsButton) {
            each.classList.add("active");
        } else {
            each.classList.remove("active");
        };
    });
    mobileTabs.forEach(each => {
        if (each === instructionsContainer) {
            each.classList.remove('mobile-tab-inactive');
        } else {
            each.classList.add('mobile-tab-inactive');
        };
    });

};

// This function changes the desktop version sidebar button to 'About' and activates the 'graph' button in the mobile version:
function graphToggle(executeFilter=true) {
    instructionsContainer.classList.add("d-none");
    plotContainer.classList.remove("d-none");
    desktopButton.classList.remove('graph-button');
    desktopButton.classList.add('about-button');
    desktopButton.innerHTML = '<i class="bi bi-info-circle-fill pe-1"></i>About';
    desktopButton.setAttribute('onclick', 'aboutToggle();');
    if (executeFilter) {
        let currentFilter = document.querySelector('.current-filter');
        filter(currentFilter);
    }
    let button = document.querySelector('#plot-container-button');
    mobileButtons.forEach(each => {
        if (each === button) {
            each.classList.add("active");
        } else {
            each.classList.remove("active");
        };
    });
    mobileTabs.forEach(each => {
        if (each === plotContainer) {
            each.classList.remove('mobile-tab-inactive');
        } else {
            each.classList.add('mobile-tab-inactive');
        };
    });
};