import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');


const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.textContent = `My Projects (${projects.length})`;
}

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );


  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = (selectedIndex === i) ? -1 : i;
        
        
        svg.selectAll('path').attr('class', (_, idx) => 
          idx === selectedIndex ? 'selected' : ''
        );
        
        
        legend.selectAll('li').attr('class', (_, idx) => 
          idx === selectedIndex ? 'legend-item selected' : 'legend-item'
        );
        
        
        if (selectedIndex === -1) {
          
          renderProjects(projectsGiven, projectsContainer, 'h2');
          projectsTitle.textContent = `My Projects (${projectsGiven.length})`;
        } else {
          
          let selectedYear = data[selectedIndex].label;
          let filtered = projectsGiven.filter(p => p.year === selectedYear);
          renderProjects(filtered, projectsContainer, 'h2');
          projectsTitle.textContent = `My Projects (${filtered.length})`;
        }
      });
  });


  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);


let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });
  
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
  

  projectsTitle.textContent = `My Projects (${filteredProjects.length})`;
  
 
  selectedIndex = -1;
});