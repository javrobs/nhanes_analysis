var isListening=false;
const missingValueDiv=document.querySelector("#missingValuesNote")

function plot(data,is2007){
    let yearRange=(is2007)?"2007-2008":"2017-2018";
    let y=[];
    let groceries=[];
    let nonFood=[];
    let otherStores=[];
    let eatingOut=[];
    let delivered=[];
    let groceriesPercentage=[];
    let nonFoodPercentage=[];
    let otherStoresPercentage=[];
    let eatingOutPercentage=[];
    let deliveredPercentage=[];
    data.all_data.forEach(line=>{
        if (line.year==yearRange){
            y.push(`${line.description.replace("~","<br>")}<br><em>(${line["count"]})</em>`);
            groceries.push(line["groceries"]);
            nonFood.push(line["non_food"]);
            otherStores.push(line["other_stores"]);
            eatingOut.push(line["eating_out"]);
            delivered.push(line["delivered"]);
            groceriesPercentage.push(line["groceries_percentage"]);
            nonFoodPercentage.push(line["non_food_percentage"]);
            otherStoresPercentage.push(line["other_stores_percentage"]);
            eatingOutPercentage.push(line["eating_out_percentage"]);
            deliveredPercentage.push(line["delivered_percentage"]);
        };
    });
    data.nulls.forEach(line=>{
        if (line.year==yearRange){
            missingValueDiv.innerHTML=(line.missing!=0)?`Missing values: ${line['missing']}`:"";
        };
    });

    var trace1 = {
        x: groceries,
        y: y,
        customdata:groceriesPercentage,
        name: `Groceries`,
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#3D2F73"}
    };

    var trace2 = {
        x: nonFood,
        y: y,
        customdata:nonFoodPercentage,
        name: 'Non-food',
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#2771A5"}
    };

    var trace3 = {
        x: otherStores,
        y: y,
        customdata:otherStoresPercentage,
        name: 'Other stores',
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#30AEBA"}
    };

    var trace4 = {
        x: eatingOut,
        y: y,
        customdata:eatingOutPercentage,
        name: 'Eating out',
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#D93662"}
    };

    var trace5 = {
        x: delivered,
        y: y,
        customdata:deliveredPercentage,
        name: 'Delivery/Take-out',
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#E5BB3E"}
    };

    var data = [trace1,trace2,trace3,trace4,trace5];

    var layout = {
        barmode: 'stack',
        autosize:true,
        height:(window.innerHeight-40),
        legend:{
            orientation:'h'
        },
        automargin:true,
        margin:{b:100,l:160,t:100,r:30,autoexpand:true},
        title:`Average Monthly Spending on food in the US<br>${yearRange}`,
    };

    Plotly.newPlot('plot', data, layout);
    if (isListening===false){
        startListener();
    };
};


function startListener(){
    isListening=true;
    window.addEventListener("resize", ()=>{
    console.log("listening for resize");
    let plotWidth=document.querySelector("#plotContainer").offsetWidth-40;
    let plotHeight=window.innerHeight-40;
    Plotly.update('plot',{},{height:plotHeight,width:plotWidth});
    });
};