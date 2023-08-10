
function plot(data){
    let y=[];
    let groceries=[];
    let non_food=[];
    let other_stores=[];
    let eating_out=[];
    let delivered=[];
    data.forEach(line=>{
        if (line.year=="2007-2008"){
            // console.log(line);
            y.push(`${line.description.replace("~","<br>")}<br><em>(${line["count"]})</em>`);
            groceries.push(line["groceries"]);
            non_food.push(line["non_food"]);
            other_stores.push(line["other_stores"]);
            eating_out.push(line["eating_out"]);
            delivered.push(line["delivered"]);
        }
    
    });
    console.log(y);
    console.log(groceries);
    console.log(non_food);
    console.log(other_stores);
    console.log(eating_out);
    console.log(delivered);

    var trace1 = {
        x: groceries,
        y: y,
        name: `Groceries`,
        type: 'bar',
        orientation: 'h',
        marker:{color:"#3D2F73"}
    };

    var trace2 = {
        x: non_food,
        y: y,
        name: 'Non-food',
        type: 'bar',
        orientation: 'h',
        marker:{color:"#2771A5"}
    };

    var trace3 = {
        x: other_stores,
        y: y,
        name: 'Other stores',
        type: 'bar',
        orientation: 'h',
        marker:{color:"#30AEBA"}
    };

    var trace4 = {
        x: eating_out,
        y: y,
        name: 'Eating out',
        type: 'bar',
        orientation: 'h',
        marker:{color:"#D93662"}
    };

    var trace5 = {
        x: delivered,
        y: y,
        name: 'Delivery/Take-out',
        type: 'bar',
        orientation: 'h',
        marker:{color:"#E5BB3E"}
    };

    var data = [trace1,trace2,trace3,trace4,trace5];

    var layout = {
        barmode: 'stack',
        autosize:true,
        height:(window.innerHeight-40),
        legend:{"orientation":"h"},
        automargin:true,
        margin:{b:200,l:160,t:100,r:30,autoexpand:true},
        title:"Average Monthly Spending on food in the US (2007-2008 ONLY)"};

    Plotly.newPlot('plot', data, layout);
    window.addEventListener("resize", ()=>{
        console.log("listening for resize");
        let plotWidth=document.querySelector("#plotContainer").offsetWidth-40;
        let plotHeight=window.innerHeight-40;
        Plotly.update('plot',{},{height:plotHeight,width:plotWidth});
    });
}

