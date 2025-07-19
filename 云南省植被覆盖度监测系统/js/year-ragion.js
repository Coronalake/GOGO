/* fvcBarChart.js */
(function () {
  const chartDom = document.getElementById('regionBarChart');
  if (!chartDom) return;
  const myChart = echarts.init(chartDom);

  let allData = [];

  /* 1. 读取 CSV */
  if (typeof Papa === 'undefined') {
    console.error('PapaParse 未加载，fvcBarChart 无法工作！');
    return;
  }
  Papa.parse('fvc_data.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allData = res.data.filter(r => r.region_id && r.year && r.fvc_mean);
      bindEvents();
      updateBar();
    },
    error: err => console.error('读取 fvc_data.csv 失败', err)
  });

  /* 2. 工具函数 */
  function getCurrentYear() {
    return document.getElementById('timeSlider').value;
  }
  function getCurrentRegion() {
    const city   = document.getElementById('city-select').value;
    const county = document.getElementById('county-select').value;
    return { city, county };
  }

  /* 3. 渲染 */
  function updateBar() {
    const year   = getCurrentYear();
    const region = getCurrentRegion();
    const { city, county } = region;

    /* 1. 筛选当年数据 */
    const curYearData = allData.filter(d => +d.year === +year);
    if (!curYearData.length) {
      myChart.setOption({ series: [{ data: [] }] });
      return;
    }

    /* 2. 根据级别组装柱子 */
    let data = [];
    if (!city) {
      data = curYearData.filter(d => String(d.region_id).slice(-2) === '00');
    } else {
      const prefix4 = String(city).slice(0, 4);
      data = curYearData.filter(
        d =>
          String(d.region_id).slice(0, 4) === prefix4 &&
          String(d.region_id).slice(-2) !== '00'
      );
    }

    /* 3. 组装 ECharts 数据 */
    const chartData = data.map(d => ({
      regionId: d.region_id,
      name: d.region_name,
      value: +d.fvc_mean
    }));

    /* 4. 找到当前选中的县名（中文） */
    const selectedCountyName = county
      ? document.getElementById('county-select').selectedOptions[0].textContent.trim()
      : null;

    /* 5. 红色三角数据：向上偏移 5px */
    const markPointData = [];
    if (selectedCountyName) {
      const target = chartData.find(d => d.name === selectedCountyName);
      if (target) {
        markPointData.push({
          name: target.name,
          value: target.value,
          xAxis: target.name,
          yAxis: target.value,
          symbolOffset: [0, -10]   // 关键：向上 5px
        });
      }
    }

    /* 6. 渲染 */
    myChart.setOption(
      {
        tooltip: {
          trigger: 'axis',
          formatter: p => `${p[0].name}<br/>${year}年: ${p[0].value.toFixed(4)}`
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: 30, containLabel: true },
        xAxis: { type: 'category', data: chartData.map(d => d.name) },
        yAxis: { type: 'value', min: 0, max: 1 },
        series: [
          {
            type: 'bar',
            data: chartData,
            barWidth: '60%',
            itemStyle: { color: '#61acc1ff' },
            markPoint: {
            symbol: 'triangle',
            symbolSize: 14,
            itemStyle: { color: '#ffa600c5' },
            label: {
              show: true,
              position: 'top',      // 文字在三角之上
              offset: [0, -2],     // 再往上 10 px，避免压住三角
              fontSize: 12,
              color: '#000'
            },
  data: markPointData
}
          }
        ]
      },
      { notMerge: true }
    );
    myChart.resize();
  }

  /* 5. 事件绑定 */
  function bindEvents() {
    document.getElementById('region-search-btn').addEventListener('click', updateBar);
    document.getElementById('timeSlider').addEventListener('input', updateBar);
  }
})();