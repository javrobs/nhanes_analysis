const URL = '/queries';

function filter(element){
    fetch(URL,{
        method: 'POST',
        mode :'cors',
        headers: 
            {
            "Content-Type": "application/json"
            },
        body: JSON.stringify({column: element.value})
        }).then(data=>data.json()).then(data => {
            console.log(data);
            plot(data);
            filterDeeper(data,element.value);
        })
}

function filterDeeper(data,column){
    let selectedFilter=document.querySelector(`option[value=${column}]`).innerHTML;
    let container=document.querySelector("#labelsContainer");
    container.innerHTML=`<h5>Filter deeper on <span style="color:#">${selectedFilter}</span>:</h5>`;
    let options=[];
    let newSelect=document.createElement("select")
    data.forEach(line=>{
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
