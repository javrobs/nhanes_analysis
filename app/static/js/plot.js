
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
            y.push(`${line.description}<br>(${line["count"]})`);
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
        orientation: 'h'
    };

    var trace2 = {
        x: non_food,
        y: y,
        name: 'Non-food',
        type: 'bar',
        orientation: 'h'
    };

    var trace3 = {
        x: other_stores,
        y: y,
        name: 'Other stores',
        type: 'bar',
        orientation: 'h'
    };

    var trace4 = {
        x: eating_out,
        y: y,
        name: 'Eating out',
        type: 'bar',
        orientation: 'h'
    };

    var trace5 = {
        x: delivered,
        y: y,
        name: 'Delivery/Take-out',
        type: 'bar',
        orientation: 'h'
    };

    var data = [trace1,trace2,trace3,trace4,trace5];

    var layout = {
        barmode: 'stack',
        autosize:true,
        height:(window.innerHeight-40),
        title:"Average Monthly Consumption in the US"};

    Plotly.newPlot('plot', data, layout);
    window.addEventListener("resize", ()=>{
        let plotWidth=document.querySelector("#plotContainer").offsetWidth-40;
        let plotHeight=window.innerHeight-40;
        Plotly.update('plot',{},{height:plotHeight,width:plotWidth});
    });
}

