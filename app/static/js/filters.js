// Created constants for:
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

// Created variables for the tooltips:
var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Created a listener so the mobile buttons execute the 'ShowTab' function when clicked:
mobileButtons.forEach(each => {
    each.addEventListener('click', showTab);
});

// Created a function to call the server and get the data to correctly populate the filter dropdown and the graph:
function filter(element) {
    console.log("running filter function");
    // Defined the local variables needed:
    let value;
    let filterCount;
    let filtersDictionary = {};
    let caseOfFilter;
    // Created local variables that read the filters and categories:
    let currentFilter = document.querySelector(".current-filter");
    let pastFilters = document.querySelectorAll(".filter-past");
    let categories = document.querySelectorAll(".category");
    // Specified a condition that prepares the data that will be sent to the server:
    if (element.classList.contains('filter-past')) {
        value = element.value;
        filterCount = Number(element.id.split("-")[1]);
        for (let i = 0; i < filterCount - 1; i++) {
            filtersDictionary[pastFilters[i].value] = categories[i].value;
        };
        killTree(filterCount);
        caseOfFilter = 1;
        console.log("if 1: element contains filter past");
    } else if (currentFilter.value === 'default' && pastFilters.length > 0) {
        // && element.tagName !== 'SELECT'
        let lastFilter = pastFilters[pastFilters.length - 1];
        filterCount = Number(lastFilter.id.split("-")[1]);
        value = lastFilter.value;
        for (let i = 0; i < pastFilters.length - 1; i++) {
            filtersDictionary[pastFilters[i].value] = categories[i].value;
        };
        caseOfFilter = 2;
        console.log("if 2: default & past-filterz > 0");
    } else {
        value = currentFilter.value;
        filterCount = Number(currentFilter.id.split("-")[1]);
        for (let i = 0; i < pastFilters.length; i++) {
            filtersDictionary[pastFilters[i].value] = categories[i].value;
        };
        caseOfFilter = 3;
        console.log("if 3: else");
    };
    // Created a condition that calls the server if the filter has a valid value:
    graphToggle(false);
    if (value !== "default") {
        // instructionsContainer.classList.add("d-none");
        // plotContainer.classList.remove("d-none");
        fetch(URL, {
            method: 'POST',
            mode: 'cors',
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ column: value, previousFilters: filtersDictionary, selectedYear: year2007.checked })
        }).then(data => data.json()).then(data => {
            mobileNoGraphMessage.classList.add("d-none");
            if (data.all_data.length !== 0) {
                plot(data, year2007.checked);
                errorMessage.classList.add("d-none");
                desktopButtonDiv.classList.remove("d-none");
                if (caseOfFilter!==2) {
                    filterOn(data, value, filterCount);
                    buildingBreadcrumb(filterCount);
                } else {
                    buildingBreadcrumb(filterCount, false);
                };
                plotArea.classList.remove("d-none");
            } else {
                plotArea.classList.add("d-none");
                errorMessage.classList.remove("d-none");
            };
        });
    } else {
        console.log("value is default, do nothing. enjoy");
    };
};

function filterOn(data, column, counter) {
    let currentCategory = document.querySelector(`#category-${counter}`);
    // console.log(currentCategory);
    if (currentCategory !== null) {
        currentCategory.remove();
        let title = document.querySelector(`#title-on-${counter}`);
        title.remove();
        killTree(counter);
        // let filterToRun = document.querySelector(`#filter-${counter}`);
        // console.log(filterToRun);
        // filter(filterToRun);
    };
    // console.log(currentCategory);
    let selectedFilter = document.querySelector(`option[value=${column}]`).innerHTML;
    let filterOnDiv = document.querySelector(`#filter-div-${counter}`);
    if (counter === 1) {
        let categoryTitleDiv = document.createElement('div');
        categoryTitleDiv.innerHTML = `<h6 class="py-1 m-0">On <span class="highlight">${selectedFilter}</span>:</h6>
            <div class="on-hover-parent" data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip" data-bs-placement="left" data-bs-html="true" data-bs-title="<b>Select a '${selectedFilter}' category.</b>">
            <i class="bi bi-info-square-fill icon-info"></i>
            </div>`;
        categoryTitleDiv.classList.add("align-items-baseline");
        categoryTitleDiv.classList.add("d-flex");
        categoryTitleDiv.classList.add("justify-content-between");
        categoryTitleDiv.id = `title-on-${counter}`
        filterOnDiv.appendChild(categoryTitleDiv);
        tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    } else {
        let h6Title = document.createElement("h6");
        h6Title.innerHTML = `On <span class="highlight">${selectedFilter}</span>:`
        h6Title.classList.add("py-1");
        h6Title.classList.add("m-0");
        h6Title.id = `title-on-${counter}`
        filterOnDiv.appendChild(h6Title);
    }
    let options = [];
    let newSelect = document.createElement("select");
    let defaultOption = document.createElement("option");
    defaultOption.innerHTML = "Select an option..";
    defaultOption.value = "default";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    newSelect.appendChild(defaultOption);
    data.all_data.forEach(line => {
        // console.log(options);
        let text = line["description"];
        text = text.replaceAll("~", " ");
        if (options.includes(text) === false && text !== "Don't know" && text !== "Refused") {
            options.push(text);
            let oneOption = document.createElement("option");
            oneOption.innerHTML = text;
            oneOption.setAttribute("value", line["id"])
            newSelect.appendChild(oneOption);
        };
    });
    newSelect.id = `category-${counter}`;
    newSelect.classList.add("category");
    newSelect.addEventListener("change", (event) => {
        filterDeeper(event, column, counter + 1);
    });
    filterOnDiv.appendChild(newSelect);
};

function filterDeeper(event, column, counter) {
    let currentDiv = document.querySelector(`#filter-div-${counter}`)
    if (currentDiv !== null) {
        // currentDiv.remove();
        let valueToKeep = Number(event.target.value);
        killTree(counter - 1);
        let filterToRun = document.querySelector(`#filter-${counter - 1}`);
        // console.log(filterToRun);
        // filter(filterToRun).then(() => {
        //     let categoryToRun = document.querySelector(`#category-${counter-1}`);
        //     categoryToRun.value = valueToKeep;
        //     console.log("THIS IS THE VALUE TO KEEP:", valueToKeep);
        // });
    };
    // console.log(event.target.value);
    let filterDeeperDiv = document.createElement("div");
    filterDeeperDiv.id = `filter-div-${counter}`;
    filterDeeperDiv.classList.add('px-3');
    filterDeeperDiv.classList.add('py-3');
    let allFilters = document.querySelectorAll(".filter");
    allFilters.forEach(one => {
        one.classList.add("filter-past");
        one.classList.remove("current-filter");
    });
    let title = document.createElement('div');
    title.innerHTML = "<h4 class='m-0'>Filter deeper by:</h4> <i class='bi bi-x-square-fill icon-close' onclick='iconKillTree(this);'></i>";
    // h6Title.classList.add("pt-3");
    title.classList.add("pb-2");
    title.classList.add("align-items-baseline");
    title.classList.add("d-flex");
    title.classList.add("justify-content-between");
    let lastFilter = document.querySelector(`#filter-${counter - 1}`);
    let newFilter = lastFilter.cloneNode(true);
    newFilter.classList.add("current-filter");
    newFilter.classList.remove("filter-past");
    newFilter.setAttribute("id", `filter-${counter}`);
    let optionToRemove = newFilter.querySelector(`[value=${column}]`);
    newFilter.removeChild(optionToRemove);
    filterDeeperDiv.appendChild(title);
    filterDeeperDiv.appendChild(newFilter);
    parentDiv.appendChild(filterDeeperDiv);
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
    killingFilter.classList.remove("filter-past");
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

function graphToggle(executeFilter=true) {
    instructionsContainer.classList.add("d-none");
    plotContainer.classList.remove("d-none");
    desktopButton.classList.remove('graph-button');
    desktopButton.classList.add('about-button');
    desktopButton.innerHTML = '<i class="bi bi-info-circle-fill pe-1"></i>About';
    desktopButton.setAttribute('onclick', 'aboutToggle();');
    if (executeFilter) {
        let lastFilter = document.querySelector('.current-filter');
        filter(lastFilter);
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