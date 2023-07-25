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
            populateTable(data);
        })
}

function populateTable(data){
    let plot=document.querySelector("#plot");
    plot.innerHTML="";
    let table=document.createElement("table");
    let headerRow=document.createElement("tr");
    headerRow.innerHTML=`
    <th>ID</th>
    <th>Description</th>
    <th>Count</th>
    <th>Eating Out</th>
    <th>Groceries</th>
    <th>Non-food</th>
    <th>Other Stores</th>
    <th>Delivered</th>
    `
    table.appendChild(headerRow);
    data.forEach(line=>{
        let row=document.createElement("tr");
        row.innerHTML=`
        <td>${line["id"]}</td>
        <td>${line["description"]}</td>
        <td>${line["count"]}</td>
        <td>${line["eating_out"]}</td>
        <td>${line["groceries"]}</td>
        <td>${line["non_food"]}
        <td>${line["other_stores"]}</td>
        <td>${line["delivered"]}</td>
        `
        table.appendChild(row);
    })
    plot.appendChild(table);
}
