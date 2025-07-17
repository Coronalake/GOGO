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

  /* 3. 组装数据 */
  function buildSeries(year, { city, county }) {
    const curYearData = allData.filter(d => +d.year === +year);
    if (!curYearData.length) return [];

    let list = [];

    /* 省级：保留市级 */
    if (!city) {
      list = curYearData.filter(d => String(d.region_id).slice(-2) === '00');
    }
    /* 市级 or 县级：保留该市所有区县 */
    else {
      const prefix4 = String(city).slice(0, 4);
      list = curYearData.filter(
        d =>
          String(d.region_id).slice(0, 4) === prefix4 &&
          String(d.region_id).slice(-2) !== '00'
      );
    }

    /* 组装柱数据：仅高亮选中的县（前6位匹配） */
    return list.map(d => ({
      regionId: d.region_id,
      name: d.region_name,
      value: +d.fvc_mean,
      itemStyle:
        county && String(d.region_id).slice(0, 6) === String(county).slice(0, 6)
          ? { color: '#b5da24ff' } // 高亮色
          : null                  // 默认色
    }));
  }

  /* 4. 渲染 */
function updateBar() {
  const year   = getCurrentYear();
  const region = getCurrentRegion();
  const { city, county } = region;

  let data = [];

  /* 1. 筛选当年数据 */
  const curYearData = allData.filter(d => +d.year === +year);
  if (!curYearData.length) {
    myChart.setOption({ series: [{ data: [] }] });
    return;
  }

  /* 2. 根据级别组装柱子 */
  if (!city) {
    // 省级 -> 各市（region_id 末两位 00）
    data = curYearData.filter(d => String(d.region_id).slice(-2) === '00');
  } else {
    // 市级/县级 -> 该市全部区县（末两位非 00）
    const prefix4 = String(city).slice(0, 4);
    data = curYearData.filter(
      d =>
        String(d.region_id).slice(0, 4) === prefix4 &&
        String(d.region_id).slice(-2) !== '00'
    );
  }

  /* 3. 组装 ECharts 数据，高亮县（6 位匹配） */
  const chartData = data.map(d => ({
    regionId: d.region_id,
    name: d.region_name,
    value: +d.fvc_mean,
    itemStyle:
      county && String(d.region_id).slice(0, 6) === String(county).slice(0, 6)
        ? { color: '#b5da24ff' }   // 高亮色
        : null                     // 默认色
  }));

  /* 4. 渲染 */
  myChart.setOption(
    {
      tooltip: {
        trigger: 'axis',
        formatter: p => `${p[0].name}<br/>${year}年: ${p[0].value.toFixed(4)}`
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 10, containLabel: true },
      xAxis: { type: 'category', data: chartData.map(d => d.name) },
      yAxis: { type: 'value', min: 0, max: 1 },
      series: [
        {
          type: 'bar',
          data: chartData,
          barWidth: '60%',
          itemStyle: { color: '#61acc1ff' } // 默认
        }
      ]
    },
    { notMerge: true }  // 强制重绘
  );
  myChart.resize();
}

  /* 5. 事件绑定 */
  function bindEvents() {
    document.getElementById('region-search-btn').addEventListener('click', updateBar);
    document.getElementById('timeSlider').addEventListener('input', updateBar);
  }
})();