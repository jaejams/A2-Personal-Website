async function render() {
  // load data
  const videoGamesData = await d3.csv("./dataset/videogames_wide.csv");

  // create a bar chart
  const vlSpec = vl
  .markLine()
  .data(videoGamesData)
  .title("Total Number of Games Released Per Year")
  .encode(
    // X-AXIS: Year (Quantitative/Temporal)
    vl.x()
      .field('Year')
      .type('quantitative') 
      .title('Year of Release')
      .axis({
        format: 'd' 
      }),

    // Y-AXIS: Count of Rows (Number of Games)
    vl.y()
      .aggregate('count') // Aggregates the number of records (rows)
      .title('Number of Games Released'),

    // TOOLTIP: FIXED SYNTAX
    vl.tooltip([
      vl.fieldN('Year'), // Display Year as a category
      {
        aggregate: 'count', // Tells the tooltip to display the count aggregate
        title: 'Number of games released' // Sets the display name
      }
    ])
  )
  // .config({
  //   view: {stroke: null}
  // })
  .width(600)
  .height(400)
  .toSpec(); // .toSpec() converts the API chain into the final VL object

  const view = await vegaEmbed("#fourth", vlSpec).view;
  view.run();
}

render();