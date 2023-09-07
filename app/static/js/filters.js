const URL = '/queries';
const instructions=document.querySelector("#instructions");
const plotarea=document.querySelector("#plot");
const year2007=document.querySelector("#first-year");
const year2017=document.querySelector("#second-year");
// const filterElement=document.querySelector("#filter-1");
// const filterDeeperDiv=document.querySelector("#filter-deeper");
const errorMessage=document.querySelector("#error-message");
const parentDiv = document.querySelector("#filter-by");

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
    } else {
        value=currentFilter.value;
        filterCount=Number(currentFilter.id.split("-")[1]);
        for (let i=0;i<pastFilters.length;i++){
            filtersDictionary[pastFilters[i].value]=categories[i].value;
        };
    };
    if(value==="default"){
        instructions.classList.remove("d-none");
        plotarea.classList.add("d-none");
        missingValueDiv.innerHTML="";
        // filterDeeperDiv.innerHTML="";
        errorMessage.classList.add("d-none");
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
                    filterOn(data,value,filterCount);
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
        currentDiv.remove();
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
    let h6Title = document.createElement('h4');
    h6Title.innerHTML="Filter deeper by:";
    // h6Title.classList.add("pt-3");
    h6Title.classList.add("pb-2");
    h6Title.classList.add("m-0");
    let lastFilter=document.querySelector(`#filter-${counter-1}`);
    let newFilter=lastFilter.cloneNode(true);
    newFilter.classList.add("current-filter");
    newFilter.classList.remove("filter-past");
    newFilter.setAttribute("id",`filter-${counter}`);
    let optionToRemove=newFilter.querySelector(`[value=${column}]`);
    newFilter.removeChild(optionToRemove);
    filterDeeperDiv.appendChild(h6Title);
    filterDeeperDiv.appendChild(newFilter);
    parentDiv.appendChild(filterDeeperDiv);
};


function killTree(numberOfFiltersToKeep){
    let currentFilter=document.querySelector('.current-filter');
    let currentFilterCount=Number(currentFilter.id.split("-")[1]);
    for (let i=numberOfFiltersToKeep+1;i<=currentFilterCount;i++){
        let divToDelete = document.querySelector(`#filter-div-${i}`);
        divToDelete.remove();
    };
};