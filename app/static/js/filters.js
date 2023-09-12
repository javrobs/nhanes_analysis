const URL = '/queries';
const instructions=document.querySelector("#instructions");
const plotarea=document.querySelector("#plot");
const year2007=document.querySelector("#first-year");
const year2017=document.querySelector("#second-year");
// const filterElement=document.querySelector("#filter-1");
// const filterDeeperDiv=document.querySelector("#filter-deeper");
const errorMessage=document.querySelector("#error-message");
const parentDiv = document.querySelector("#filter-by");
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// year2007.addEventListener("change",filter);
// year2017.addEventListener("change",filter);

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
    } else if (currentFilter.value==='default'&&pastFilters.length>0&&element.tagName==='INPUT') {
        let lastFilter=pastFilters[pastFilters.length-1];
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
        console.log(value, filtersDictionary);
    };
    if(value==="default"){
        instructions.classList.remove("d-none");
        plotarea.classList.add("d-none");
        missingValueDiv.innerHTML="";
        // filterDeeperDiv.innerHTML="";
        errorMessage.classList.add("d-none");
        let currentCategory = document.querySelector(`#category-${filterCount}`);
        if (currentCategory!==null){
            currentCategory.remove();
            let title = document.querySelector(`#title-on-${filterCount}`);
            title.remove();
        };
    } else {
        instructions.classList.add("d-none");
        plotarea.classList.remove("d-none");
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
                    if (element.tagName==='SELECT'){
                        filterOn(data,value,filterCount);
                    };
                    // };                    
                } else {
                    plotarea.classList.add("d-none");
                    errorMessage.classList.remove("d-none");
                };
            });
    }
}

function filterOn(data,column,counter){
    let currentCategory = document.querySelector(`#category-${counter}`);
    console.log(currentCategory);
    if (currentCategory!==null){
        currentCategory.remove();
        let title = document.querySelector(`#title-on-${counter}`);
        title.remove();
        killTree(counter);
    };
    // console.log(currentCategory);
    let selectedFilter=document.querySelector(`option[value=${column}]`).innerHTML;
    // filterDeeperDiv.innerHTML+=`<h5 class="pt-3 pb-2 m-0">Filter deeper on <span class="highlight">${selectedFilter}</span>:</h5>`;
    let h6Title = document.createElement("h6");
    h6Title.innerHTML=`On <span class="highlight">${selectedFilter}</span>:`
    h6Title.classList.add("pt-1");
    h6Title.classList.add("pb-1");
    h6Title.classList.add("m-0");
    h6Title.id = `title-on-${counter}`
    let filterOnDiv = document.querySelector(`#filter-div-${counter}`);
    filterOnDiv.appendChild(h6Title);
    let options=[];
    let newSelect=document.createElement("select");
    let defaultOption=document.createElement("option");
    defaultOption.innerHTML="Select an option..";
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
        killTree(counter-1);
    };
    console.log(event.target.value);
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
};

function iconKillTree(element){
    let iconParentDiv = element.parentElement.parentElement;
    let numberIcon=iconParentDiv.id.split("-")[2];
    console.log(numberIcon);
    killTree(numberIcon-1);
}