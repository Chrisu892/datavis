(() => {
  "use strict"

  document.querySelectorAll('[data-graph]').forEach(graph => {
    var chartDiv = graph.getAttribute('id')
    var chartType = graph.dataset.type
    var chartSource = graph.dataset.source

    switch (chartType) {
      case 'xy':
        fetch('api/?type=xy&source=' + chartSource)
          .then(resp => resp.json())
          .then(resp => createXYChart(chartDiv, resp))
        break

      case 'pie':
        fetch('api/?type=pie&source=' + chartSource)
          .then(resp => resp.json())
          .then(resp => {
            createPieChart(chartDiv, resp)
          })
        break

      case 'radar':
        fetch('api/?type=radar&source=' + chartSource)
          .then(resp => resp.json())
          .then(resp => createRadarChart(chartDiv, resp))
        break
    }
  })

  /**
   * Create XY chart
   * @param {string} chartDiv
   * @param {object} data
   */
  function createXYChart(chartDiv, data) {
    // console.log('xy chart: ', data)

    // Set the chart root div
    var root = am5.Root.new(chartDiv);

    // Set the chart legend div
    var legendDiv = document.querySelector('[data-legend="' + chartDiv + '"]')
    var legendRoot = am5.Root.new(legendDiv)

    // Instantiate chart
    var chart = root.container.children.push( 
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout
      }) 
    );

    // Craete Y-axis
    var yAxis = chart.yAxes.push( 
      am5xy.ValueAxis.new(root, { 
        renderer: am5xy.AxisRendererY.new(root, {}) 
      }) 
    );

    // Create X-Axis
    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "category"
      })
    );
    xAxis.data.setAll(data.series[0].data);

    // Create chart series 1
    var series1 = chart.series.push( 
      am5xy.ColumnSeries.new(root, { 
        name: data.series[0].name, 
        xAxis: xAxis, 
        yAxis: yAxis, 
        valueYField: "value1", 
        categoryXField: "category" 
      }) 
    );
    series1.data.setAll(data.series[0].data);

    // Create chart series 2
    var series2 = chart.series.push( 
      am5xy.ColumnSeries.new(root, { 
        name: data.series[1].name, 
        xAxis: xAxis, 
        yAxis: yAxis, 
        valueYField: "value1", 
        categoryXField: "category" 
      }) 
    );
    series2.data.setAll(data.series[1].data);

    // Create chart series 3
    var series3 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: data.series[2].name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value1',
        categoryXField: 'category'
      })
    )
    series3.data.setAll(data.series[2].data)

    // Add legend
    var legend = legendRoot.container.children.push(
      am5.Legend.new(legendRoot, {
        width: am5.percent(100),
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: legendRoot.verticalLayout,
      })
    )

    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));
  }

  /**
   * Function to create a pie chart
   * @param {string} chartdiv
   * @param {object} data
   * @param {integer} index
   */
  function createPieChart(chartDiv, data, index = null) {
    // console.log('pie chart: ', data)

    // Get the last element from the data series
    if (index == null) {
      index = data.series.length - 1
    }

    // Set the chart's root div
    var root = am5.Root.new(chartDiv)

    // Set the chart's legend root div
    var legendDiv = document.querySelector('[data-legend="' + chartDiv + '"]')
    var legendRoot = am5.Root.new(legendDiv)

    // Get the reference to the graph's dropdown box
    var dropdown = document.querySelector('[data-name="' + chartDiv + '"]')

    // Generate a list of options for a dropdown
    for (let idx in data.series) {

      let option = dropdown.querySelector('[data-dynamic="' + idx + '"]') || undefined

      if (option === undefined) {

        // Create dropdown option
        let option = document.createElement('option');

        // Set the option value to be the series index
        option.setAttribute('value', idx)

        // Set the option data-dynamic to TRUE
        option.setAttribute('data-dynamic', idx)

        // Check if the option should be selected
        if (idx == index) {
          option.setAttribute('selected', true)
        }

        // Set the inner text
        option.innerText = data.series[idx].name

        // Append option to the DOM
        dropdown.appendChild(option);
      }
    }

    // Add change event listener to the dropdown
    dropdown.addEventListener('change', (evt) => {

      // Remove all elements from the root
      root.dispose()
      legendRoot.dispose()

      // Create new graph
      createPieChart(chartDiv, data, evt.target.value)
    })

    // Instantiate chart
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    )

    // Set the chart's series
    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: data.series[index].category,
        categoryField: 'category',
        valueField: 'value1'
      })
    )
    series.data.setAll(data.series[index].data)
    series.labels.template.set("visible", false)
    series.ticks.template.set("visible", false)

    var legend = legendRoot.container.children.push(
      am5.Legend.new(legendRoot, {
        width: am5.percent(100),
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: legendRoot.verticalLayout,
      })
    )

    legend.data.setAll(series.dataItems)
  }

  /**
   * Create radar chart
   * @param {string} chartdiv
   * @param {object} data
   */
  function createRadarChart(chartDiv, data) {
    // console.log('radar chart: ', data)

    // Create root and chart
    var root = am5.Root.new(chartDiv)

    // Create chart's legent root
    var legendDiv = document.querySelector('[data-legend="' + chartDiv + '"]')
    var legendRoot = am5.Root.new(legendDiv)

    // Set root theme
    root.setThemes([
      am5themes_Animated.new(root)
    ])

    // Instantiate chart
    var chart = root.container.children.push( 
      am5radar.RadarChart.new(root, {
        maxTooltipDistance: 0,
        wheelY: "zoomX",
        layout: root.verticalLayout,
        innerRadius: am5.percent(10),
        startAngle: -180,
        endAngle: 0
      })
    )

    // Create X-Axis
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "year", count: 1 },
        renderer: am5radar.AxisRendererCircular.new(root, {
          minGridDistance: 20,
          cellStartLocation: 0.2,
          cellEndLocation: 0.8
        }),
      })
    )

    xAxis.get("renderer").labels.template.setAll({
      fontSize: 12
    })

    // Create Y-axis
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        extraTooltipPrecision: 1,
        renderer: am5radar.AxisRendererRadial.new(root, {
          minGridDistance: 20
        })
      })
    )

    yAxis.get("renderer").labels.template.setAll({
      visible: false
    })

    // Create series
    function createSeries(name, field, index) {

      var series = chart.series.push( 
        am5radar.RadarColumnSeries.new(root, { 
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          valueXField: "category",
          tooltip: am5.Tooltip.new(root, {}),
          clustered: true
        })
      )

      series.columns.template.setAll({
        width: am5.percent(70)
      })

      series.get("tooltip").label.set("text", "[bold]{name}[/]\n{valueX.formatDate()}: {valueY}")

      data.series[index].data.map(object => {
        object.category = new Date(object.category).getTime()
      })

      series.data.setAll(data.series[index].data)
    }

    for (let idx in data.series) {
      createSeries(data.series[idx].name, "value1", idx)
    }

    // Add cursor
    chart.set("cursor", am5radar.RadarCursor.new(root, {
      behavior: "zoomX",
      xAxis: xAxis
    }))

    xAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }))

    yAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }))

    var legend = legendRoot.container.children.push(
      am5.Legend.new(legendRoot, {
        width: am5.percent(100),
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: legendRoot.verticalLayout,
      })
    )

    // var legend = chart.children.push(am5.Legend.new(root, {
    //   x: am5.percent(50),
    //   centerX: am5.percent(50),
    //   layout: am5.GridLayout.new(root, {
    //     maxColumns: 2,
    //     fixedWidthGrid: false
    //   })
    // }))

    legend.data.setAll(chart.series.values)
  }

  /**
   * Create treemap chart
   * 
   */
  // function createTreemapChart(chartDiv, data) {
  //   console.log('Treemap chart: ', data)
  // }
})()