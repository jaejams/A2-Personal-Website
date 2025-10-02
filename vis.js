// SVG XML Namespace, essential for creating SVG elements. This is a web address telling the browser which language a certain element associates with. 
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
const svgNS = "http://www.w3.org/2000/svg";

// Function to create an SVG rectangle element
function createSvgRect(x, y, width, height, fill) {
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('rx', 4);
    rect.setAttribute('ry', 4);
    return rect;
}

// Function to create an SVG text element
function createSvgText(x, y, textContent, fill, fontSize) {
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('font-family', 'Roboto, sans-serif');
    text.setAttribute('font-size', fontSize);
    text.setAttribute('fill', fill);
    text.textContent = textContent;
    return text;
}

// Function to create an SVG line element
function createSvgLine(x1, y1, x2, y2, strokeColor, strokeWidth) {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', strokeColor);
    line.setAttribute('stroke-width', strokeWidth);
    return line;
} 

// Function to create an SVG ellipse 
function createSvgEllipse(cx, cy, rx, ry, fill) {
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttribute('cx', cx);
    ellipse.setAttribute('cy', cy);
    ellipse.setAttribute('rx', rx);
    ellipse.setAttribute('ry', ry);
    ellipse.setAttribute('fill', fill);    
    return ellipse;
}

// Finally going into a function creating a bar chart
function createBarChart() {

    // Define the data and their properties for the visualization
    const chartData = [
        { label: "Green Tea", value: 2, color: "#f87171" },
        { label: "Black Coffee", value: 9, color: "#3b82f6" },
        { label: "Soy Milk", value: 5, color: "#22c55e" },
        { label: "Sparkling Water", value: 15, color: "#f97316" }
    ];

    // Chart dimensions
    const svgWidth = 550;
    const svgHeight = 450;
    
    // Max value for scaling the bar heights.
    const maxDataValue = 15;
    
    const maxBarHeight = svgHeight - 150; //make sure it's lower than viewBox's height, which is 500, so it leaves some space for title/labels. 
    
    // Fixed properties for vertical bars
    const barWidth = 80;
    
    // The Y-coordinate for the base line of the chart (bottom margin)
    const baseLineY = svgHeight - 50; 
    
    // Get the main container element
    const container = document.getElementById('visualizations-container');

    // Clear the loading message
    container.innerHTML = '';

    // create SVG elements using document.createElementNS
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'bar-graph');
    svg.setAttribute('width', '100%'); //setting the external size of the SVG. SVG will take up 100% of the parent container's width. 
    svg.setAttribute('height', '70vh'); //SVG will take up 60vh of the viewport's height. 
    svg.setAttribute('viewBox', '0 0 550 450'); //maintaining the aspect ratio. 
    // In combination with setAttributes 'width' and 'height' set in % and vh, this line is making  this visualization responsive. 
    
    container.appendChild(svg);

    // Make a for loop to make a rectangle and corresponding label one at a time. 
    for (let i = 0; i < chartData.length; i++) { //there are 4 items in chartData, so looping 4 times. 
        const item = chartData[i];
        
        // 1) Calculate horizontal position
        const xPosition = barWidth + i * 120;
        
        // 2) Calculate bar height
        const currentBarHeight = (item.value / maxDataValue) * maxBarHeight; //making a ratio, multiplied by the maximum value that the bar could be. 
        
        // 3) Calculate vertical position (Y starts from the top, so subtract the height from the baseline)
        const yPosition = baseLineY - currentBarHeight;
        
        // Create the bar using createSvgRect function
        const rect = createSvgRect(
            xPosition,    // X position
            yPosition,    // Y position (grows up from the baseLineY)
            barWidth,     // Width (fixed)
            currentBarHeight, // Height (responsive)
            item.color
        );

        // Create the skill label (centered below the bar)
        const label = createSvgText(
            xPosition + barWidth / 2,       // Center X
            baseLineY + 20,               // Y position's 20px below the bar
            item.label,
            'blue',                         //color
            16
        );
        label.setAttribute('text-anchor', 'middle');

        // Create the value text (centered above the bar)
        const valueText = createSvgText(
            xPosition + barWidth / 2, // Center X
            yPosition - 10,           // Y position is 10px above the bar
            `${item.value}`,    // Get the current item in the array's 'value' property. Making it a string because createSvgText requires a string. 
            'blue',
            14
        );
        valueText.setAttribute('text-anchor', 'middle');
        
        // append all elements
        svg.appendChild(rect);
        svg.appendChild(label);
        svg.appendChild(valueText);
        
        // add hovering interactive effect 
        rect.addEventListener('mouseover', () => {
            valueText.setAttribute('font-weight', 'bold');
            label.setAttribute('font-weight', 'bold');
        });

        rect.addEventListener('mouseout', () => {
            valueText.setAttribute('font-weight', 'normal');
            label.setAttribute('font-weight', 'normal');
        });
    }
    
    const xAxis = createSvgLine(
        0,              //x1 pos
        baseLineY,      //y1 pos
        svgWidth + 50,
        baseLineY,
        'black',
        2
    );

    svg.appendChild(xAxis);

    // Add a title to the chart
    const chartTitle = createSvgText(
        svgWidth / 2,
        30,
        "The kinds of drinks I had last week other than water (in cup)",
        'black',
        20
    );
    chartTitle.setAttribute('text-anchor', 'middle');
    svg.appendChild(chartTitle);

}

function createCuteGraphics(){
    // dimensions
    const svgWidth = 500;
    const svgHeight = 500;

    // Get the main container element
    const container = document.getElementById('cute-graphics-container');

    // create SVG elements using document.createElementNS
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'cute-graphic');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '30vh');
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    container.appendChild(svg);

    const faceOne = createSvgEllipse(
        svgWidth/2,
        svgHeight/2,
        svgWidth/2,
        svgHeight/2,
        '#D9D9D9',        
    );

    const faceTwo = createSvgEllipse(
        svgWidth/2,
        svgHeight/2.5,
        svgWidth/2,
        svgHeight/5*2,
        '#171717',    
    );

    const eyeOne = createSvgEllipse(
        svgWidth/3,
        svgHeight/2,
        svgWidth/30,
        svgHeight/30,
        '#D9D9D9',      
    );

    const eyeTwo = createSvgEllipse(
        svgWidth/3*2,
        svgHeight/2,
        svgWidth/30,
        svgHeight/30,
        '#D9D9D9',     
    );

    const mouth = createSvgEllipse(
        svgWidth/2,
        svgHeight/1.35,
        svgWidth/5,
        svgHeight/8,
        '#FFA600',             
    )

    const beakPoints = [
        `${svgWidth * 0.33},${svgHeight * 0.73}`,
        `${svgWidth * 0.50},${svgHeight * 0.78}`,
        `${svgWidth * 0.65},${svgHeight * 0.73}`
    ].join(' ');

    const beak = document.createElementNS(svgNS, 'polyline');
    beak.setAttribute('points', beakPoints);
    beak.setAttribute('stroke', 'white');
    beak.setAttribute('fill', 'none');
    beak.setAttribute('stroke-width', 5);

    svg.appendChild(faceOne);
    svg.appendChild(faceTwo);
    svg.appendChild(eyeOne);
    svg.appendChild(eyeTwo);        
    svg.appendChild(mouth);     
    svg.appendChild(beak);    

}

function createCuteGraphicsTwo(){
    // dimensions
    const svgWidth = 500;
    const svgHeight = 500;

    // Get the main container element
    const container = document.getElementById('cute-graphics-container-two');

    // create SVG elements using document.createElementNS
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'cute-graphic');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '30vh');
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    container.appendChild(svg);

    const faceOne = createSvgEllipse(
        svgWidth/2,
        svgHeight/2,
        svgWidth/2,
        svgHeight/2,
        '#00F6FF',        
    );

    const eyeOne = createSvgEllipse(
        svgWidth/3,
        svgHeight/2,
        svgWidth/35,
        svgHeight/35,
        'black',      
    );

    const eyeTwo = createSvgEllipse(
        svgWidth/3*2,
        svgHeight/2,
        svgWidth/35,
        svgHeight/35,
        'black',     
    );

    const beakPoints = [
        `${svgWidth * 0.33},${svgHeight * 0.70}`,
        `${svgWidth * 0.50},${svgHeight * 0.80}`,
        `${svgWidth * 0.65},${svgHeight * 0.70}`,
        `${svgWidth * 0.50},${svgHeight * 0.60}`,        
    ].join(' ');

    const beak = document.createElementNS(svgNS, 'polygon');
    beak.setAttribute('points', beakPoints);
    beak.setAttribute('stroke', 'none');
    beak.setAttribute('fill', '#FFA600');
    beak.setAttribute('stroke-width', 5);

    svg.appendChild(faceOne);
    svg.appendChild(eyeOne);
    svg.appendChild(eyeTwo);         
    svg.appendChild(beak);    

}

function createUpArrow(){
    // dimensions
    const svgWidth = 50;
    const svgHeight = 50;

    // Get the main container element
    const container = document.getElementById('frame-up-arrow');

    // create SVG elements using document.createElementNS
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'upArrowSvg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '5vh');
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    container.appendChild(svg);

    const points = [
        `0,${svgHeight * 0.8}`,
        `${svgWidth * 0.5},${svgHeight * 0.1}`,
        `${svgWidth},${svgHeight * 0.8}`
    ].join(' ');

    const arrow = document.createElementNS(svgNS, 'polyline');
    arrow.setAttribute('points', points);
    arrow.setAttribute('stroke', 'black');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke-width', 5);

    svg.appendChild(arrow);    

}

// Ensure the function runs once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', createBarChart);
document.addEventListener('DOMContentLoaded', createCuteGraphics);
document.addEventListener('DOMContentLoaded', createCuteGraphicsTwo);
document.addEventListener('DOMContentLoaded', createUpArrow);