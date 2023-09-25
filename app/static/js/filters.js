const URL = '/queries';
const instructions=document.querySelector("#instructions");
const plotContainer=document.querySelector('#plot-container');
const plotArea=document.querySelector("#plot");
const year2007=document.querySelector("#first-year");
const year2017=document.querySelector("#second-year");
const errorMessage=document.querySelector("#error-message");
const parentDiv = document.querySelector("#filter-by");
var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
const breadcrumbDiv=document.querySelector("#breadcrumb");
const desktopButtonDiv=document.querySelector('#desktop-button-div');
const desktopButton=document.querySelector('#desktop-button');
const mobileButtons=document.querySelectorAll(".mobile-button");
const mobileTabs=document.querySelectorAll('.mobile-tab');
var plotCreated=false;
const missingValueDiv=document.querySelector("#missingValuesNote");
const legendDiv=document.querySelector('#legend');


mobileButtons.forEach(each => {
    each.addEventListener('click', showTab);
});

function filter(element){
    let value;
    let filterCount;
    let filtersDictionary={};
    let currentFilter=document.querySelector(".current-filter");
    let pastFilters=document.querySelectorAll(".filter-past");
    let categories=document.querySelectorAll(".category");
    if (element.classList.contains('filter-past')){
        value=element.value;
        filterCount=Number(element.id.split("-")[1]);
        for (let i=0;i<filterCount-1;i++){
            filtersDictionary[pastFilters[i].value]=categories[i].value;
        };
        killTree(filterCount);
    } else if (currentFilter.value==='default'&&pastFilters.length>0&&element.tagName!=='SELECT') {
        let lastFilter=pastFilters[pastFilters.length-1];
        filterCount=Number(lastFilter.id.split("-")[1]);
        value=lastFilter.value;
        for (let i=0;i<pastFilters.length-1;i++){
            filtersDictionary[pastFilters[i].value]=categories[i].value;
        };
        console.log(value, filtersDictionary);
    } else {
        value=currentFilter.value;
        filterCount=Number(currentFilter.id.split("-")[1]);
        for (let i=0;i<pastFilters.length;i++){
            filtersDictionary[pastFilters[i].value]=categories[i].value;
        };
        // console.log(value, filtersDictionary);
    };
    if(value!=="default"){
    //     instructions.classList.remove("d-none");
    //     plotArea.classList.add("d-none");
    //     breadcrumbDiv.innerHTML="";
    //     missingValueDiv.innerHTML="";
    //     // filterDeeperDiv.innerHTML="";
    //     errorMessage.classList.add("d-none");
    //     let currentCategory = document.querySelector(`#category-${filterCount}`);
    //     if (currentCategory!==null){
    //         currentCategory.remove();
    //         let title = document.querySelector(`#title-on-${filterCount}`);
    //         title.remove();
    //     };
    // } else {
        instructions.classList.add("d-none");
        plotContainer.classList.remove("d-none");
        buildingBreadcrumb(filterCount);
        fetch(URL,{
            method: 'POST',
            mode :'cors',
            headers: 
                {
                "Content-Type": "application/json"
                },
            body: JSON.stringify({column:value, previousFilters:filtersDictionary, selectedYear:year2007.checked})
            }).then(data=>data.json()).then(data => {
            console.log(data);
            if(data.all_data.length!==0){
                plot(data,year2007.checked);
                errorMessage.classList.add("d-none");
                desktopButtonDiv.classList.remove("d-none");
                if (element.tagName==='SELECT'){
                    filterOn(data,value,filterCount);
                };
                // };
                plotArea.classList.remove("d-none");
            } else {
                plotArea.classList.add("d-none");
                errorMessage.classList.remove("d-none");
            };
        });
    };
};

function filterOn(data,column,counter){
    let currentCategory = document.querySelector(`#category-${counter}`);
    // console.log(currentCategory);
    if (currentCategory!==null){
        currentCategory.remove();
        let title = document.querySelector(`#title-on-${counter}`);
        title.remove();
        killTree(counter);
        // let filterToRun = document.querySelector(`#filter-${counter}`);
        // console.log(filterToRun);
        // filter(filterToRun);
    };
    // console.log(currentCategory);
    let selectedFilter=document.querySelector(`option[value=${column}]`).innerHTML;
    let filterOnDiv = document.querySelector(`#filter-div-${counter}`);
    if (counter===1) {
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
        h6Title.innerHTML=`On <span class="highlight">${selectedFilter}</span>:`
        h6Title.classList.add("py-1");
        h6Title.classList.add("m-0");
        h6Title.id = `title-on-${counter}`
        filterOnDiv.appendChild(h6Title);
    }    
    let options=[];
    let newSelect=document.createElement("select");
    let defaultOption=document.createElement("option");
    defaultOption.innerHTML="Select an option..";
    defaultOption.value="default";
    defaultOption.disabled=true;
    defaultOption.selected=true;
    newSelect.appendChild(defaultOption);
    data.all_data.forEach(line=>{
        // console.log(options);
        let text=line["description"];
        text=text.replaceAll("~"," ");
        if (options.includes(text)===false&&text!=="Don't know"&&text!=="Refused"){
            options.push(text);
            let oneOption=document.createElement("option");
            oneOption.innerHTML=text;
            oneOption.setAttribute("value",line["id"])
            newSelect.appendChild(oneOption);
        };
    });
    newSelect.id=`category-${counter}`;
    newSelect.classList.add("category");
    newSelect.addEventListener("change",(event)=>{
        filterDeeper(event,column,counter+1);
    });
    filterOnDiv.appendChild(newSelect);
};

function filterDeeper(event,column,counter){
    let currentDiv = document.querySelector(`#filter-div-${counter}`)
    if (currentDiv!==null){
        // currentDiv.remove();
        let valueToKeep = Number(event.target.value);
        killTree(counter-1);
        let filterToRun = document.querySelector(`#filter-${counter-1}`);
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
    let allFilters=document.querySelectorAll(".filter");
    allFilters.forEach(one=>{
        one.classList.add("filter-past");
        one.classList.remove("current-filter");
    });
    let title = document.createElement('div');
    title.innerHTML="<h4 class='m-0'>Filter deeper by:</h4> <i class='bi bi-x-square-fill icon-close' onclick='iconKillTree(this);'></i>";
    // h6Title.classList.add("pt-3");
    title.classList.add("pb-2");
    title.classList.add("align-items-baseline");
    title.classList.add("d-flex");
    title.classList.add("justify-content-between");
    let lastFilter=document.querySelector(`#filter-${counter-1}`);
    let newFilter=lastFilter.cloneNode(true);
    newFilter.classList.add("current-filter");
    newFilter.classList.remove("filter-past");
    newFilter.setAttribute("id",`filter-${counter}`);
    let optionToRemove=newFilter.querySelector(`[value=${column}]`);
    newFilter.removeChild(optionToRemove);
    filterDeeperDiv.appendChild(title);
    filterDeeperDiv.appendChild(newFilter);
    parentDiv.appendChild(filterDeeperDiv);
    changeFilterBackground(counter);
};

function killTree(numberOfFiltersToKeep){
    console.log('killed a Tree!!', numberOfFiltersToKeep);
    let currentFilter=document.querySelector('.current-filter');
    let currentFilterCount=Number(currentFilter.id.split("-")[1]);
    console.log(currentFilter, currentFilterCount);
    for (let i=numberOfFiltersToKeep+1;i<=currentFilterCount;i++){
        let divToDelete = document.querySelector(`#filter-div-${i}`);
        console.log(i);
        divToDelete.remove();
    };
    let killingFilter=document.querySelector(`#filter-${numberOfFiltersToKeep}`);
    killingFilter.classList.add("current-filter");
    killingFilter.classList.remove("filter-past");
    buildingBreadcrumb(numberOfFiltersToKeep);
};

function iconKillTree(element){
    let iconParentDiv = element.parentElement.parentElement;
    let numberIcon=iconParentDiv.id.split("-")[2];
    console.log(element, iconParentDiv, numberIcon);
    killTree(numberIcon-1);
    let selectedFilter = document.querySelector(`#filter-${numberIcon-1}`)
    filter(selectedFilter);
};

function buildingBreadcrumb(filterCount) {
    let breadcrumbString="";
    for(let i=1; i<=filterCount; i++){
        let filter = document.querySelector(`#filter-${i}>option:checked`).innerHTML;
        let category = document.querySelector(`#category-${i}>option:checked`);
        breadcrumbString += (i==filterCount)? "<b class='last-breadcrumb'>" + filter + "</b>":"<b>" + filter + "</b>";
        if (category!==null&&category.value!=='default'){
            category = category.innerHTML;
            breadcrumbString += "&nbsp- " + category + '&nbsp <i class="bi bi-arrow-right d-flex align-content-center"></i>&nbsp ';
        }
    };
    breadcrumbDiv.innerHTML = breadcrumbString;
};

function changeFilterBackground(counter){
    // let style = getComputedStyle(document.querySelector('#filter-div-1'));
    // let backgroundColor = style.backgroundColor;
    // console.log(backgroundColor);
    // backgroundColor.split(",")
    for (let i=1; i<=counter; i++){
        let filterDiv = document.querySelector(`#filter-div-${i}`);
        filterDiv.style = `background-color: rgba(31, 90, 132, ${i/counter});`
    };
};

function showTab(event){
    let element = event.target;
    let tabID = element.id.split('-button')[0];
    mobileButtons.forEach(each => {
        if (each===element){
            each.classList.add("active");
        } else {
            each.classList.remove("active");
        };
    });
    console.log(tabID);
    let tab = document.querySelector(`#${tabID}`);
    mobileTabs.forEach(each => {
        if (each===tab){
            each.classList.remove('mobile-tab-inactive');
        } else {
            each.classList.add('mobile-tab-inactive');
        };
    });
    if (element.id==='plot-container-button') {
        resizedWindow();
        graphToggle();
        // instructions.classList.add("d-none");
        // plotContainer.classList.remove("d-none");
    };
    if (element.id==='instructions-button') {
        // instructions.classList.remove("d-none");
        // plotContainer.classList.add("d-none");
        aboutToggle();
    };
};

function aboutToggle(){
    instructions.classList.remove("d-none");
    plotContainer.classList.add("d-none");
    desktopButton.innerHTML = '<i class="bi bi-bar-chart-fill pe-1"></i>Graph';
    desktopButton.setAttribute('onclick', 'graphToggle();')
};

function graphToggle(){
    instructions.classList.add("d-none");
    plotContainer.classList.remove("d-none");
    desktopButton.innerHTML = '<i class="bi bi-info-circle-fill pe-1"></i>About';
    desktopButton.setAttribute('onclick', 'aboutToggle();')
};