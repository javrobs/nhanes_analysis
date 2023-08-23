const URL = '/queries';
const instructions=document.querySelector("#instructions");
const plotarea=document.querySelector("#plot");
const year2007=document.querySelector("#first-year");
const year2017=document.querySelector("#second-year");
const filterElement=document.querySelector("#first-filter");

year2007.addEventListener("change",filter);

year2017.addEventListener("change",filter);

function filter(){
    let value=filterElement.value;
    if(value==="default"){
        instructions.classList.remove("d-none");
        plotarea.classList.add("d-none");
        missingValueDiv.innerHTML="";
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
            body: JSON.stringify({column: value})
            }).then(data=>data.json()).then(data => {
                console.log(data);
                plot(data,year2007.checked);
                filterDeeper(data,value);
            });
    }
}

function filterDeeper(data,column){
    let selectedFilter=document.querySelector(`option[value=${column}]`).innerHTML;
    let container=document.querySelector("#labelsContainer");
    container.innerHTML=`<h5>Filter deeper on <span style="color:#">${selectedFilter}</span>:</h5>`;
    let options=[];
    let newSelect=document.createElement("select")
    data.all_data.forEach(line=>{
        console.log(options);
        let value=line["description"];
        if (options.includes(value)===false&&value!=="Don't know"&&value!=="Refused"){
            options.push(value);
            let label=document.createElement("option");
            label.innerHTML=value;
            newSelect.appendChild(label);
        }
    });
    container.appendChild(newSelect);
};
