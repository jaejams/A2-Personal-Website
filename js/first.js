async function render() {
  const videoGamesData = await d3.csv("./dataset/videogames_wide.csv");

  // Extract unique platforms and genres
  const platforms = Array.from(new Set(videoGamesData.map(d => d.Platform))).sort();
  const genres = Array.from(new Set(videoGamesData.map(d => d.Genre))).sort();

  // Populate dropdowns
  const platformSelect = document.getElementById("platformSelect");
  const genreSelect = document.getElementById("genreSelect");

  const defaultPlatforms = ["PS2", "PS3", "PS4", "Wii"];
  const defaultGenres = ["Action", "Fighting", "Strategy", "Puzzle", "Shooter"];

  platforms.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    if (defaultPlatforms.includes(p)) {
      option.selected = true;
    }
    platformSelect.appendChild(option);
  });

  genres.forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    if (defaultGenres.includes(g)) {
      option.selected = true;
    }
    genreSelect.appendChild(option);
  });

  // Helper to get selected values
  function getSelected(selectElement) {
    return Array.from(selectElement.selectedOptions).map(opt => opt.value);
  }

  // Render chart based on selections
  function updateChart() {
    const selectedPlatforms = getSelected(platformSelect);
    const selectedGenres = getSelected(genreSelect);

    const filteredData = videoGamesData.filter(d =>
      selectedPlatforms.includes(d.Platform) &&
      selectedGenres.includes(d.Genre)
    );

    const spec = vl
      .markBar()
      .data(filteredData)
      .encode(
        vl.row().fieldN('Genre').header({ title: "Video Game Genre" }),

        vl.y().fieldN('Platform').sort('-x').title('Platform'),

        vl.x().aggregate('sum').fieldQ('Global_Sales').title('Total Global Sales (in Millions)'),

        vl.tooltip([
          vl.fieldN('Genre'),
          vl.fieldN('Platform'),
          {
            field: "Global_Sales",
            title: 'Global Sales in Millions'
          }
        ])
      )
      .config({
        view: { stroke: "gray" },
        bar: { continuousBandSize: 15 }
      })
      .width(600)
      .height(200)
      .toSpec();

    vegaEmbed("#first", spec);
  }

  // Initial render
  updateChart();

  // Update chart when selections change
  platformSelect.addEventListener("change", updateChart);
  genreSelect.addEventListener("change", updateChart);
}

render();