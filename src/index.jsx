export const title = "NUAR Data Model Codelist Visualisation";
export const layout = "layout.jsx";

export default function () {
  return (
    <div className="visualization-container">
      <h1>{title}</h1>
      <p>Interactive visualisation of NUAR code list values</p>

      <div id="codelist-viz"></div>

      <script src="https://d3js.org/d3.v7.min.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        document.addEventListener('DOMContentLoaded', () => {
          // Sample data from your SQL codelists
          const codelistData = [
            { 
              name: "actortypevalue", 
              values: [
                "Data Owner", "Object Owner", "Data Provider", 
                "Object Operator", "Service Provider", 
                "Utility Survey Commissioner", "Utility Surveyor"
              ]
            },
            { 
              name: "horizontalmeasurementmethodvalue", 
              values: [
                "Not Applicable", "Estimated", "Sensed", 
                "Measured", "Surveyed", "Unknown", "Assumed"
              ]
            },
            { 
              name: "materialvalue", 
              values: [
                "Steel", "Plastic", "PVC", "Clay", "Concrete", "Copper", 
                "Iron", "HDPE", "Lead", "Unknown"
              ]
            },
            { 
              name: "utilitytypevalue", 
              values: [
                "Electricity", "Gas", "Water", "Drainage", "Sewer", 
                "Telecommunication", "Oil", "Petroleum"
              ]
            }
          ];

          // Calculate layout
          const margin = {top: 40, right: 20, bottom: 20, left: 200};
          const width = 800 - margin.left - margin.right;
          const height = 600 - margin.top - margin.bottom;
          
          // Create SVG
          const svg = d3.select("#codelist-viz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", \`translate(\${margin.left},\${margin.top})\`);
          
          // Create scales
          const x = d3.scaleLinear()
            .domain([0, d3.max(codelistData, d => d.values.length)])
            .range([0, width]);
          
          const y = d3.scaleBand()
            .domain(codelistData.map(d => d.name))
            .range([0, height])
            .padding(0.3);
          
          // Color scale for the bars
          const color = d3.scaleOrdinal()
            .domain(codelistData.map(d => d.name))
            .range(d3.schemeCategory10);
            
          // Add X axis
          svg.append("g")
            .attr("transform", \`translate(0,\${height})\`)
            .call(d3.axisBottom(x).ticks(5));
            
          // Add Y axis
          svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "12px")
            .style("font-weight", "bold");
            
          // Add title
          svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("NUAR Codelist Values Count");
            
          // Add the bars
          const bars = svg.selectAll(".bar")
            .data(codelistData)
            .enter()
            .append("g");
            
          bars.append("rect")
            .attr("class", "bar")
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", d => x(d.values.length))
            .attr("fill", d => color(d.name))
            .attr("rx", 4)
            .on("mouseover", function(event, d) {
              d3.select(this).attr("opacity", 0.8);
              tooltip
                .style("opacity", 1)
                .html(\`<strong>\${d.name}</strong><br>Values: \${d.values.length}<br>\${d.values.join(", ")}\`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function() {
              d3.select(this).attr("opacity", 1);
              tooltip.style("opacity", 0);
            });
            
          // Add value counts
          bars.append("text")
            .attr("x", d => x(d.values.length) + 5)
            .attr("y", d => y(d.name) + y.bandwidth() / 2)
            .attr("dy", ".35em")
            .text(d => d.values.length)
            .attr("fill", "black");
            
          // Create tooltip
          const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("padding", "8px")
            .style("font-size", "12px")
            .style("background", "white")
            .style("border-radius", "4px")
            .style("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.2)")
            .style("pointer-events", "none");
            
          // Add interaction to change displayed values
          let currentCodelist = null;
          const valuesList = d3.select("#codelist-viz")
            .append("div")
            .attr("class", "values-list")
            .style("margin-top", "20px")
            .style("padding", "10px")
            .style("border", "1px solid #ddd")
            .style("border-radius", "4px")
            .style("background", "#f9f9f9");
            
          valuesList.append("h3")
            .text("Hover over a bar or click to see values");
            
          // Click to display values in detail
          bars.select("rect").on("click", function(event, d) {
            if (currentCodelist === d.name) {
              // Clear selection if clicking the same codelist
              currentCodelist = null;
              valuesList.selectAll("*").remove();
              valuesList.append("h3").text("Hover over a bar or click to see values");
              d3.selectAll(".bar").attr("stroke-width", 0);
            } else {
              // Display values for the selected codelist
              currentCodelist = d.name;
              
              // Update selected bar appearance
              d3.selectAll(".bar").attr("stroke-width", 0);
              d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
              
              // Update values list
              valuesList.selectAll("*").remove();
              valuesList.append("h3").text(\`\${d.name} (\${d.values.length} values)\`);
              
              const valueItems = valuesList.append("ul")
                .selectAll("li")
                .data(d.values)
                .enter()
                .append("li")
                .style("margin", "5px 0")
                .text(d => d);
            }
          });
        });
      `,
        }}
      />
    </div>
  );
}
