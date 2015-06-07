svg = d3.select 'svg'
dataset = [1, 2, 3, 4, 5, 6, 7, 8, 9]

svg.selectAll('circle').data(dataset).enter()
  .append('circle').attr('cx', (d, i) -> i * 101 + 50)
  .attr('cy', 150).attr('r', (d) -> d * 5)
