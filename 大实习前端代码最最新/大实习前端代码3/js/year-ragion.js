/*  fvcBarChart.js  */
(function () {
  // 1. 全局容器
  const chartDom = document.getElementById('regionBarChart');
  if (!chartDom) return;
  const myChart = echarts.init(chartDom);

  // 2. 数据缓存
  let allData = [];

  // 3. 读取 CSV
  const csvUrl = 'fvc_data.csv';
  // 浏览器无法加载外网 PapaParse 时，可手动把 papaparse.min.js 放到本地 lib 文件夹
  if (typeof Papa === 'undefined') {
    console.error('PapaParse 未加载，fvcBarChart 无法工作！');
    return;
  }
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      allData = res.data.filter(r => r.region_id && r.year && r.fvc_mean);
      bindEvents();          // 绑定交互
      updateBar();           // 首次渲染
    },
    error: err => console.error('读取 fvc_data.csv 失败', err)
  });

  // 4. 工具函数
  function getCurrentYear() {
    return document.getElementById('timeSlider').value;
  }
  function getCurrentRegion() {
    const city = document.getElementById('city-select').value;
    const county = document.getElementById('county-select').value;
    return { city, county };
  }

  // 5. 数据处理
  function buildSeries(year, { city, county }) {
    // 筛选当年数据
    const curYearData = allData.filter(d => +d.year === +year);
    if (!curYearData.length) return [];

    let list = [];
    // 情况1：只选省
    if (!city) {
      list = curYearData.filter(d => d.region_id.slice(-2) === '00');
    }
    // 情况2：选了市
    else {
      const prefix = city.slice(0, 4);
      list = curYearData.filter(
        d => d.region_id.slice(0, 4) === prefix && d.region_id.slice(-2) !== '00'
      );
    }

    // 组装柱状图数据
    return list.map(d => ({
      regionId: d.region_id,
      name: d.region_name,
      value: +d.fvc_mean,
      itemStyle: county && d.region_id === county
        ? { color: '#b5da24ff' } // 高亮颜色
        : null
    }));
  }

  // 6. 渲染
  function updateBar() {
    const year = getCurrentYear();
    const region = getCurrentRegion();
    const { city, county } = region;  
    const data = buildSeries(year, region);

    if (!data.length) {
      myChart.setOption({ series: [{ data: [] }] });
      return;
    }

    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: p => `${p[0].name}<br/>${year}年: ${p[0].value.toFixed(4)}`
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top:10,containLabel: true },
      xAxis: { type: 'category', data: data.map(d => d.name) },
      yAxis: { type: 'value', min: 0, max: 1 },
      series: [{
        type: 'bar',
        data: data,
        barWidth: '60%',
        itemStyle: { color: '#61acc1ff' } 
      }]
    }, true); // true 强制合并
    myChart.resize();
    console.log('选中的 county id:', county);
    console.log('数据中的 region_id:', data.map(d => d.region_id));
  }

  // 7. 事件绑定
  function bindEvents() {
    // 搜索按钮
    document.getElementById('region-search-btn').addEventListener('click', updateBar);
    // 时间轴滑块
    document.getElementById('timeSlider').addEventListener('input', updateBar);
  }

  
})();