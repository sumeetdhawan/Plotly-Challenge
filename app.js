// create the function to get the necessary data
function buildMetadata(id) {
// read the json file to get data
    d3.json("samples.json").then((data)=> {

        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        
        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        
        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function buildCharts(id) {
// Use D3 fetch to read the JSON file
    d3.json("samples.json").then (sampledata =>{
        

        //filter sample values by id
        var samples = sampledata.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);

        //Getting the top 10 
        var sampleValues =  samples.sample_values.slice(0,10).reverse();
        console.log(sampleValues);

        // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        // get the otu id's for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d);
        // console.log(`OTU IDS: ${OTU_id}`)

        // get the top 10 labels for the plot
        var labels =  samples.otu_labels.slice(0,10);
        console.log(`OTU_labels: ${labels}`)

        //for guage chart
        var wfreq = sampledata.metadata.map (d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        var trace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            marker: {
            color: 'yellow'},
            type:"bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text:  samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout1 = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // creating data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout1); 

        // The guage chart
  
        var data2 = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `Weekly Washing Frequency ` },
            type: "indicator",
            
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                    
                     steps: [
                      { range: [0, 2], color: "red" },
                      { range: [2, 4], color: "cyan" },
                      { range: [4, 6], color: "yellow" },
                      { range: [6, 8], color: "lime" },
                      { range: [8, 9], color: "green" },
                    ]}
                
            }
        ];
        var layout2 = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
        };
        Plotly.newPlot("gauge", data2, layout2);
    
    });
}  

// create the function for the change event
function optionChanged(id) {
    buildCharts(id);
    buildMetadata(id);
}


// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        buildCharts(data.names[0]);
        buildMetadata(data.names[0]);
    });
}

init();