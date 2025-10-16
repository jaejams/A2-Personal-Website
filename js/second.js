async function render() {
  const videoGamesData = await d3.csv("./dataset/videogames_wide.csv");

  // Extract unique platforms and genres
  const platforms = Array.from(new Set(videoGamesData.map(d => d.Platform))).sort();
  const genres = Array.from(new Set(videoGamesData.map(d => d.Genre))).sort();
  const publishers = Array.from(new Set(videoGamesData.map(d => d.Publisher))).sort();

  // Populate dropdowns
  const platformSelect = document.getElementById("platformSelectTwo");
  const genreSelect = document.getElementById("genreSelectTwo");
  const publisherSelect = document.getElementById("publisherSelectTwo");

  const defaultPlatforms = ["PS2", "PS3", "PS4", "Wii"];

  platforms.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    if (defaultPlatforms.includes(p)){
      option.selected = true;
    }

    platformSelect.appendChild(option);
  });

  genres.forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;

    option.selected = true;

    genreSelect.appendChild(option);
  });

  publishers.forEach(b => {
    const option = document.createElement("option");
    option.value = b;
    option.textContent = b;

    option.selected = true;

    publisherSelect.appendChild(option);
  });

  // Helper to get selected values
  function getSelected(selectElement) {
    return Array.from(selectElement.selectedOptions).map(opt => opt.value);
  }

  // Render chart based on selections
  function updateChart() {
    const selectedPlatforms = getSelected(platformSelect);
    const selectedGenres = getSelected(genreSelect);
    const selectedPublishers = getSelected(publisherSelect);

    const filteredData = videoGamesData.filter(d =>
      selectedPlatforms.includes(d.Platform) &&
      selectedGenres.includes(d.Genre) &&
      selectedPublishers.includes(d.Publisher)
    );

    // Define selections
    const brush = vl.selectInterval().encodings('x');   // drag across x-axis (Year)
    const click = vl.selectPoint().encodings('color');  // click on color (Genre)

    // Shared color scale
    const genreScale = { scheme: "category20" };

    // Top chart: Area chart
    const plotArea = vl.markArea({ stroke: "gray" })
      .encode(
        vl.color()
          .if(click, vl.color().fieldN('Genre').scale(genreScale).title('Genre'))
          .value('lightgray'),
        vl.x().fieldO("Year").title("Year"),
        vl.y().aggregate('sum').field('Global_Sales').title('Global Sales')
      )
      .width(600)
      .height(300)
      .params(click)
      .transform(vl.filter(brush));

    // Bottom chart: Faceted bar chart
    const plotAll = vl.markBar()
      .title("Annual Global Sales Trend by Platform, Stacked by Genre")
      .encode(
        vl.row().field('Platform').header({ title: "Gaming Platform", titleOrient: "left" }),
        vl.x().field('Year').type('ordinal').axis({
          title: "Year of Release",
          labelAngle: -45,
          orient: 'bottom'
        }),
        vl.y().aggregate('sum').field('Global_Sales')
          .title('Total Global Sales (in Millions)')
          .stack('zero'),
        vl.color()
          .value('lightgray')
          .if(brush, vl.color().fieldN('Genre').scale(genreScale).title('Genre')),
        vl.tooltip([
          vl.field('Platform'),
          vl.field('Year'),
          vl.field('Genre'),
          vl.field('Publisher'),
          { field: 'Global_Sales', aggregate: 'sum', title: 'Global Sales (Millions)' }
        ])
      )
      .width(600)
      .params(brush)
      .transform(vl.filter(click))
      .config({
        row: { header: { spacing: 15 } },
        view: { stroke: null }
      });

    // Assign the final spec
    const spec = vl.vconcat(plotArea, plotAll)
      .data(filteredData)
      .toSpec(); // ← this was missing

    // Embed the chart
    vegaEmbed("#second", spec);
  }


  // Initial render
  updateChart();

  // Update chart when selections change
  platformSelect.addEventListener("change", updateChart);
  genreSelect.addEventListener("change", updateChart);
  publisherSelect.addEventListener("change", updateChart);

}

render();