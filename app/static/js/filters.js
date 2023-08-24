const URL = '/queries';
const instructions=document.querySelector("#instructions");
const plotarea=document.querySelector("#plot");
const year2007=document.querySelector("#first-year");
const year2017=document.querySelector("#second-year");
const filterElement=document.querySelector("#filter-1");
const filterDeeperDiv=document.querySelector("#filter-deeper");
const errorMessage=document.querySelector("#error-message")
var filterCount=0

year2007.addEventListener("change",filter);
year2017.addEventListener("change",filter);

// function filter(element){
    // let value=element.value;
function filter(element){
    let value=element.value
    let pastFilters=document.querySelectorAll(".filter-past");
    let categories=document.querySelectorAll(".category");
    console.log(pastFilters);
    console.log(categories);
    let filtersDictionary={};
    for (let i=0;i<pastFilters.length;i++){
        filtersDictionary[pastFilters[i].value]=categories[i].value
    };
    console.log(filtersDictionary);
    if(value==="default"){
        instructions.classList.remove("d-none");
        plotarea.classList.add("d-none");
        missingValueDiv.innerHTML="";
        filterDeeperDiv.innerHTML="";
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
            body: JSON.stringify({column: value,previousFilters:filtersDictionary})
            }).then(data=>data.json()).then(data => {
                console.log(data);
                if(data.all_data.length!==0){
                    plot(data,year2007.checked);
                    errorMessage.classList.add("d-none");
                    filterDeeper(data,value);
                } else {
                    plotarea.classList.add("d-none");
                    errorMessage.classList.remove("d-none");
                };
            });
    }
}

function filterDeeper(data,column){
    let selectedFilter=document.querySelector(`option[value=${column}]`).innerHTML;
    // filterDeeperDiv.innerHTML+=`<h5 class="pt-3 pb-2 m-0">Filter deeper on <span class="highlight">${selectedFilter}</span>:</h5>`;
    let h5Title = document.createElement("h5");
    h5Title.innerHTML=`Filter deeper on <span class="highlight">${selectedFilter}</span>:`
    h5Title.classList.add("pt-3");
    h5Title.classList.add("pb-2");
    h5Title.classList.add("m-0");
    filterDeeperDiv.appendChild(h5Title);
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
        } 
    });
    newSelect.classList.add("category");
    newSelect.addEventListener("change",(event)=>{
        createFilter(event,column);
    });
    filterDeeperDiv.appendChild(newSelect);
};

function createFilter(event,column){
    console.log(event.target.value);
    let allFilters=document.querySelectorAll(".filter");
    allFilters.forEach(one=>{
        one.classList.add("filter-past");
    });
    let newFilter=filterElement.cloneNode(true);
    newFilter.classList.remove("filter-past");
    newFilter.removeAttribute("id");
    let optionToRemove=newFilter.querySelector(`[value=${column}]`);
    newFilter.removeChild(optionToRemove);
    filterDeeperDiv.appendChild(newFilter);
};


