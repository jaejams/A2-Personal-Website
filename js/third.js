async function render() {
  // load data
  const videoGamesData = await d3.csv("./dataset/videogames_wide.csv");

  // create a bar chart
  const vlSpec = vl
  .markBar()
  .data(videoGamesData)

  .title("Sales Distribution, Stacked by Region")
  .transform([
    // 1. Fold the four sales columns into two: 'Sales_Region' and 'Sales_Value'
    vl.fold([
      'EU_Sales', 
      'JP_Sales', 
      'NA_Sales', 
      'Other_Sales'
    ]).as(['Sales_Region', 'Sales_Value']),
  ])
  .encode(
     // X-AXIS: Year (Column/Discrete Dimension)
    vl.y()
      .fieldN('Platform')
      .title('Platform')
      .sort({
        op: 'sum',
        field: 'Global_Sales',
        order: 'descending'

      }),

    // Y-AXIS: SUM(Global Sales) (Stacked)
    vl.x()
      .aggregate('sum') 
      .field('Sales_Value')
      .title('Sales (in Millions)')
      .stack('zero'), // Optional: use 'normalize' to show proportion, or 'zero' for absolute values

      
    // COLOR MARK: Segments the bars by the FOLDED field
    vl.color()
      .field('Sales_Region') // MUST use the single folded field
      .title('Regional Sales Breakdown') // Sets the overall legend title
      .scale({
        // Define the colors for the DOMAIN (the raw data values)
        domain: ['EU_Sales', 'JP_Sales', 'NA_Sales', 'Other_Sales'],
        range: ['green', 'blue', 'red', 'gray'] 
        // Note: The legend items will still show the raw domain values (EU_Sales, etc.).
        // To change the legend item labels, we would need a calculate transform, 
        // but let's stick to simple titles first.
      }),
    

    // TOOLTIP: Shows the sales breakdown by Year and Genre for that Platform
    vl.tooltip([
      vl.field('Platform'),
      vl.field('Sales_Region'),
      {
        field: 'Sales_Value',
        aggregate: 'sum'
      },
      // vl.field('Year'),
      // Use object notation for aggregated field title
      {
        field: 'Global_Sales',
        aggregate: 'sum',
        title: 'Global Sales (Millions)'
      }
    ])
  )
  .config({
    // Add spacing between the platform facets
    row: {header: {spacing: 15}},
    view: {stroke: null}
  })
  .width(800)
  .toSpec();

  const view = await vegaEmbed("#third", vlSpec).view;
  view.run();
}

render();