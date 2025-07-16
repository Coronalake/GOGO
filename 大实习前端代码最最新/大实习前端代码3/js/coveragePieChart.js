// coveragePieChart.js - 处理植被覆盖度分等级数据的饼图可视化

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log('开始加载植被覆盖度分等级数据可视化模块');
  // 加载数据
  loadCoverageData();
  
  // 为搜索按钮添加事件监听器
  const searchBtn = document.getElementById('region-search-btn');
  if (searchBtn) {
    console.log('搜索按钮已找到，添加点击事件');
    searchBtn.addEventListener('click', function() {
      updateCoveragePieChart();
    });
  } else {
    console.error('未找到搜索按钮');
  }
  
  // 为时间轴滑块添加事件监听器
  const timeSlider = document.getElementById('timeSlider');
  if (timeSlider) {
    console.log('时间轴滑块已找到，添加变化事件');
    timeSlider.addEventListener('input', function() {
      updateCoveragePieChart();
    });
  } else {
    console.error('未找到时间轴滑块');
  }
});

// 存储所有植被覆盖度数据
let coverageData = [];
// 存储按年份组织的数据
let coverageDataByYear = {};

// 加载CSV数据
function loadCoverageData() {
  console.log('开始加载植被覆盖度CSV数据');
  fetch('fvcclassstats.csv')
    .then(response => {
      console.log('CSV响应状态:', response.status);
      return response.text();
    })
    .then(csvData => {
      console.log('CSV数据已获取，长度:', csvData.length);
      // 解析CSV数据
      const parsedData = parseCSV(csvData);
      coverageData = parsedData;
      console.log('植被覆盖度数据加载成功，数据条数:', coverageData.length);
      // 初始加载时显示图表
      updateCoveragePieChart();
    })
    .catch(error => console.error('加载植被覆盖度数据失败:', error));
}

// 解析CSV数据
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  console.log('CSV行数:', lines.length);
  
  // 创建按年份组织的数据结构
  coverageDataByYear = {};
  
  const parsedData = [];
  // 从第二行开始解析（跳过表头）
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= 6) {
      const entry = {
        coverage_id: values[0].trim(),
        region_id: values[1].trim(),
        region_name: values[2].trim(),
        level: parseInt(values[3].trim()),
        year: values[4].trim(),
        fvc_level: values[5].trim(),
        area_km2: parseFloat(values[6].trim()),
        level_name: values[7].trim()
      };
      
      parsedData.push(entry);
      
      // 按年份组织数据
      if (!coverageDataByYear[entry.year]) {
        coverageDataByYear[entry.year] = [];
      }
      coverageDataByYear[entry.year].push(entry);
    }
  }
  
  console.log('可用年份:', Object.keys(coverageDataByYear));
  return parsedData;
}

// 更新植被覆盖度饼图
function updateCoveragePieChart() {
  console.log('开始更新植被覆盖度饼图');
  
  // 如果数据未加载，则退出
  if (coverageData.length === 0) {
    console.error('植被覆盖度数据尚未加载');
    return;
  }
  
  // 获取当前选择的年份
  const timeSlider = document.getElementById('timeSlider');
  const currentYear = timeSlider ? timeSlider.value : '2020';
  console.log('当前选择的年份:', currentYear);
  
  // 如果没有当前年份的数据，使用最近的年份
  if (!coverageDataByYear[currentYear]) {
    const availableYears = Object.keys(coverageDataByYear).map(Number).sort();
    const closestYear = availableYears.reduce((prev, curr) => 
      Math.abs(curr - currentYear) < Math.abs(prev - currentYear) ? curr : prev
    );
    console.warn(`未找到${currentYear}年的数据，使用${closestYear}年的数据`);
    currentYear = closestYear.toString();
  }
  
  // 获取用户选择的地区
  const citySelect = document.getElementById('city-select');
  const countySelect = document.getElementById('county-select');
  
  let selectedRegion = '云南省';
  let selectedLevel = 1; // 省级默认为1
  
  // 如果选择了县
  if (countySelect && countySelect.value) {
    const countyName = countySelect.options[countySelect.selectedIndex].text;
    selectedRegion = countyName;
    selectedLevel = 3; // 县级
  }
  // 如果选择了市但没选县
  else if (citySelect && citySelect.value) {
    const cityName = citySelect.options[citySelect.selectedIndex].text;
    selectedRegion = cityName;
    selectedLevel = 2; // 市级
  }
  
  console.log('选中区域:', selectedRegion, '级别:', selectedLevel);
  
  // 过滤当前年份的数据
  let filteredData = [];
  if (coverageDataByYear[currentYear]) {
    filteredData = coverageDataByYear[currentYear].filter(item => 
      item.region_name === selectedRegion && item.level === selectedLevel
    );
  }
  
  // 如果没有匹配数据，使用云南省数据
  if (filteredData.length === 0) {
    console.warn(`未找到${selectedRegion}的数据，使用云南省数据`);
    filteredData = coverageDataByYear[currentYear].filter(item => 
      item.region_name === '云南省' && item.level === 1
    );
  }
  
  console.log('过滤后数据条数:', filteredData.length);
  
  // 计算各等级面积和总面积
  const coverageLevels = {};
  let totalArea = 0;
  
  filteredData.forEach(item => {
    if (!coverageLevels[item.fvc_level]) {
      coverageLevels[item.fvc_level] = {
        name: getLevelName(item.fvc_level),
        value: 0
      };
    }
    coverageLevels[item.fvc_level].value += item.area_km2;
    totalArea += item.area_km2;
  });
  
  // 转换为饼图数据格式
  const pieData = Object.values(coverageLevels);
  
  // 如果没有数据，则不更新图表
  if (pieData.length === 0 || totalArea === 0) {
    console.warn('没有足够的数据来生成饼图');
    return;
  }
  
  console.log('饼图数据:', pieData);
  
  // 创建图表
  const chartDom = document.getElementById('coveragePieChart');
  if (!chartDom) {
    console.error('未找到图表容器元素');
    return;
  }
  
  // 初始化或重用图表实例
  let myChart = echarts.getInstanceByDom(chartDom);
  if (!myChart) {
    myChart = echarts.init(chartDom);
  }
  
  // 定义颜色映射
  const colorMap = {
    '低': '#E5F5E0',
    '中低': '#A1D99B',
    '中': '#74C476',
    '中高': '#31A354',
    '高': '#006D2C'
  };
  
  // 提取颜色数组，与pieData顺序一致
  const colors = pieData.map(item => colorMap[item.name] || '#CCCCCC');
  
  // 设置图表选项
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} km² ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      data: pieData.map(item => item.name)
    },
    series: [
      {
        name: '植被覆盖度',
        type: 'pie',
        radius: ['35%', '60%'], // 环形图
        avoidLabelOverlap: false,
        top:0,
        bottom:10,
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: pieData,
        color: colors
      }
    ]
  };
  
  // 渲染图表
  myChart.setOption(option);
  
  // 窗口大小变化时调整图表大小
  window.addEventListener('resize', function() {
    myChart.resize();
  });
  
  console.log('植被覆盖度饼图已更新');
}

// 获取覆盖度等级的名称
function getLevelName(level) {
  switch(level) {
    case '低': return '低';
    case '中低': return '中低';
    case '中': return '中';
    case '中高': return '中高';
    case '高': return '高';
    default: return level;
  }
}

// 暴露给全局的更新函数，可以被时间轴调用
window.updateCoveragePieChartByYear = function(year) {
  // 更新时间轴
  const timeSlider = document.getElementById('timeSlider');
  if (timeSlider) {
    timeSlider.value = year;
    // 触发timeSlider的input事件
    const event = new Event('input');
    timeSlider.dispatchEvent(event);
  } else {
    // 如果没有找到时间轴，直接更新图表
    updateCoveragePieChart();
  }
};
