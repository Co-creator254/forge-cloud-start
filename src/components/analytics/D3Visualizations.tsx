
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
  category: string;
}

interface D3VisualizationsProps {
  data: DataPoint[];
  title: string;
  type: 'bar' | 'pie' | 'scatter' | 'line';
}

const D3Visualizations: React.FC<D3VisualizationsProps> = ({ data, title, type }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    switch (type) {
      case 'bar':
        renderBarChart(g, data, width, height);
        break;
      case 'pie':
        renderPieChart(g, data, width, height);
        break;
      case 'scatter':
        renderScatterPlot(g, data, width, height);
        break;
      case 'line':
        renderLineChart(g, data, width, height);
        break;
    }
  }, [data, type]);

  const renderBarChart = (g: any, data: DataPoint[], width: number, height: number) => {
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d: DataPoint) => x(d.name) || 0)
      .attr("width", x.bandwidth())
      .attr("y", (d: DataPoint) => y(d.value))
      .attr("height", (d: DataPoint) => height - y(d.value))
      .attr("fill", "#22c55e")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#16a34a");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("fill", "#22c55e");
      });
  };

  const renderPieChart = (g: any, data: DataPoint[], width: number, height: number) => {
    // Filter out zero/negative values to prevent pie chart rendering issues
    const validData = data.filter(d => d.value > 0);
    if (validData.length === 0) return;

    const radius = Math.min(width, height) / 2 - 10;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<DataPoint>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    const labelArc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    const pieData = pie(validData);

    // Center the pie chart properly
    const chartGroup = g.attr("transform", `translate(${width / 2 + 20},${height / 2})`);

    // Add slices
    const slices = chartGroup.selectAll(".arc")
      .data(pieData)
      .enter().append("g")
      .attr("class", "arc");

    slices.append("path")
      .attr("d", arc)
      .attr("fill", (d: any, i: number) => color(i.toString()))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Add labels only for slices with enough space
    slices.filter((d: any) => (d.endAngle - d.startAngle) > 0.3)
      .append("text")
      .attr("transform", (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .text((d: any) => d.data.name.substring(0, 8));
  };

  const renderScatterPlot = (g: any, data: DataPoint[], width: number, height: number) => {
    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d, i) => i) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d: DataPoint, i: number) => x(i))
      .attr("cy", (d: DataPoint) => y(d.value))
      .attr("r", 5)
      .attr("fill", "#3b82f6");
  };

  const renderLineChart = (g: any, data: DataPoint[], width: number, height: number) => {
    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d, i) => i) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([height, 0]);

    const line = d3.line<DataPoint>()
      .x((d, i) => x(i))
      .y(d => y(d.value));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", line);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef}></svg>
      </CardContent>
    </Card>
  );
};

export default D3Visualizations;
