// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log("sample: ", sample);
    // Get the metadata field directly from the data object
    let metadata = data.metadata;
    console.log("metadata", metadata)

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.filter(obj => obj.id == sample)[0]; // Assuming each ID is unique
    console.log("filtered metadata: ",filteredMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let div = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    div.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata.
    let formattedString = '<table>';
    for (let key in filteredMetadata) {
      formattedString += `<tr><td><strong>${key}: </strong></td><td>${filteredMetadata[key]}</td></tr>`;
    }
    formattedString += '</table>';

    // Write a new metadata table to the HTML file
    div.html(formattedString);
  });
}



function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Filter the samples for the object with the desired sample number
    let samples = data.samples.filter(s => s.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samples[0].otu_ids;
    let otu_labels = samples[0].otu_labels;
    let sample_values = samples[0].sample_values;

    // Build a Bubble Chart
    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      margin: { t: 30 }
    };
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Build a Bar Chart
    let barData = [{
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selectList = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
for (let i = 0; i < names.length; i++)
        {
            selectList.append("option").attr("value", names[i]).text(names[i]);
        }

    // Get the first sample from the list
    // Build charts and metadata panel with the first sample
    // used the optionChanged function
    optionChanged(names[0]);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
