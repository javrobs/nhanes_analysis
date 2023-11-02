// Variable to define whether a plot has been created:
var plotCreated=false;
const mobileWidth=767;
// let isLandscape

// This function plots the graph with the data that is received from the server:
function plot(data,yearFlag){
    // Initializes all the variables needed to plot the data:
    let yearRange=(year2007.checked)?"2007-2008":"2017-2018";
    let y=[];
    let yMaxLength=[];
    let groceries=[];
    let otherStores=[];
    let eatingOut=[];
    let delivered=[];
    let groceriesPercentage=[];
    let otherStoresPercentage=[];
    let eatingOutPercentage=[];
    let deliveredPercentage=[];
    // Populates all the created variables with the data received from the server:
    let dataLength=data.all_data.length
    for (let i=dataLength-1;i>=0;i--){
        let line=data.all_data[i];
        // Populates the data:
        let spacer=(dataLength>7&&window.innerWidth<=mobileWidth)?" ":"<br>";
        let description=`${line.description.replace("~",spacer)}${spacer}<em>(${line["count"]})</em>`;
        y.push(description);
        groceries.push(line["groceries"]);
        otherStores.push(line["other_stores"]);
        eatingOut.push(line["eating_out"]);
        delivered.push(line["delivered"]);
        groceriesPercentage.push(line["groceries_percentage"]);
        otherStoresPercentage.push(line["other_stores_percentage"]);
        eatingOutPercentage.push(line["eating_out_percentage"]);
        deliveredPercentage.push(line["delivered_percentage"]);
    };
    // Identifies how many missing values there are and adds the information to the DOM:
    data.nulls.forEach(line=>{
        if (line.year==yearRange){
            missingValueDiv.innerHTML=(line.missing!=0)?`Missing values: ${line['missing']}`:"";
        };
    });
    // Defines the trace for the 'groceries' spending data:
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
    // Defines the trace for the 'other stores' spending data:
    var trace2 = {
        x: otherStores,
        y: y,
        customdata:otherStoresPercentage,
        name: 'Other stores',
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#30AEBA"}
        // #2771A5
    };
    // Defines the trace for the 'eating out' spending data:
    var trace3 = {
        x: eatingOut,
        y: y,
        customdata:eatingOutPercentage,
        name: 'Eating out',
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#D93662"}
    };
    // Defines the trace for the 'delivered' spending data:
    var trace4 = {
        x: delivered,
        y: y,
        customdata:deliveredPercentage,
        name: 'Delivery/Take-out',
        type: 'bar',
        hovertemplate:"%{x:$.2f}<br>(%{customdata:.2f}%)",
        orientation: 'h',
        marker:{color:"#E5BB3E"}
    };
    // Creates an array with all the spending data traces:
    var data = [trace1,trace2,trace3,trace4];
    // Defines the layout of the plot:
    let height=window.innerHeight-breadcrumbDiv.offsetHeight-legendDiv.offsetHeight-padderDiv.offsetHeight;
    height=(window.innerWidth>mobileWidth)?height:height-headerDiv.offsetHeight;
    let margin=(height>700)?{b:60,l:160,t:100,r:30,autoexpand:false}:{b:40,l:160,t:60,r:30,autoexpand:false};
    var layout = {
        barmode: 'stack',
        height:height,
        width: (plotArea.offsetWidth),
        showlegend:false,
        automargin:true,
        margin:margin,
        title:`Average Monthly Spending<br>${yearRange}`,
        xaxis: {
            fixedrange:true
        },
        yaxis: {
            fixedrange:true
        }
    };
    // Plots with the correct data and layout and hides the default Plotly 'mode bar':
    Plotly.newPlot('plot', data, layout, {
        displayModeBar:false
    });
    // Starts the window resize listener the first time a plot is created:
    if (plotCreated===false){
        startListener();
    };
};

// This function creates the listener of the window resizing:
function startListener(){
    // Indicates that a plot has been created:
    plotCreated=true;
    // If the window is resized, it runs the 'resizedWindow' function after 0.1s:
    window.addEventListener("resize", ()=>{
        let doit;
        // Resets the timeout:
        clearTimeout(doit);
        // Sets the timeout to 0.1s and executes the 'resizedWindow' function if the timeout is completed:
        doit = setTimeout(resizedWindow, 100);
    });
};

// This function changes the size of plot:

function resizedWindow(){
    // console.log(window.innerWidth,window.innerHeight);
    // let statusNow=isLandscape;
    // isLandscape=window.innerWidth>window.innerHeight;
    // if (statusNow!==isLandscape){
    //     console.log("Changed orientation");
    //     refreshPlot();
    // }
    // if (window.innerWidth>mobileWidth){
    //     refreshPlot();
    // } else {

    // }
    // // Gets rid of the last plot:
    
    refreshPlot();
};

function refreshPlot(){
    Plotly.purge('plot');
    // If the 'Graph' button is active, it runs the 'filter' function with the 'current-filter' data:
    if (desktopButton.classList.contains('about-button')) {
        let lastFilter = document.querySelector('.current-filter');
        filter(lastFilter);
    };
}