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
            showLabels(data);
        })
}

function showLabels(data){
    let container=document.querySelector("#labelsContainer");
    container.innerHTML="<h5>Filter deeper:</h5>";
    let labelsShowing=[]
    data.forEach(line=>{
        console.log(labelsShowing);
        let value=line["description"];
        if (labelsShowing.includes(value)===false){
            labelsShowing.push(value);
            let label=document.createElement("div");
            label.classList.add("label");
            label.classList.add("d-flex");
            label.innerHTML=`${value}`;
            container.appendChild(label);
        }
    });


}

// // DEMONSTRATIVE FUNCTION, NOT FINAL 
// function populateTable(data){
//     let plot=document.querySelector("#table");
//     plot.innerHTML="";
//     let table=document.createElement("table");
//     let headerRow=document.createElement("tr");
//     headerRow.innerHTML=`
//     <th>ID</th>
//     <th>Year</th>
//     <th>Description</th>
//     <th>Count</th>
//     `
//     table.appendChild(headerRow);
//     data.forEach(line=>{
//         let row=document.createElement("tr");
//         row.innerHTML=`
//         <td>${line["id"]}</td>
//         <td>${line["year"]}</td>
//         <td>${line["description"]}</td>
//         <td>${line["count"]}</td>
//         `
//         table.appendChild(row);
//     })
//     plot.appendChild(table);
// }
