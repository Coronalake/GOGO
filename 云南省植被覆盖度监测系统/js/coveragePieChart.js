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
  updateCoveragePieChart(); // 初始化加载图表（调用已修改的函数）
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
  const timeSlider = document.getElementById('timeSlider');
  let currentYear = timeSlider ? timeSlider.value : '2020';

  const citySelect = document.getElementById('city-select');
  const countySelect = document.getElementById('county-select');

  let selectedRegion = '云南省';
  let selectedLevel = 1;

  if (countySelect && countySelect.value) {
    selectedRegion = countySelect.options[countySelect.selectedIndex].text;
    selectedLevel = 3;
  } else if (citySelect && citySelect.value) {
    selectedRegion = citySelect.options[citySelect.selectedIndex].text;
    selectedLevel = 2;
  }

  console.log('请求区域:', selectedRegion, '级别:', selectedLevel, '年份:', currentYear);
  // 对区域名称进行URL编码
  const encodedRegion = encodeURIComponent(selectedRegion);

  // 请求后端数据
  fetch(`http://192.168.89.206:5000/api/fvc-summary?year=${currentYear}&region_name=${encodedRegion}&level=${selectedLevel}`)
    .then(response => {
      if (!response.ok) {
        return response.json().then(errData => {
          throw new Error(`后端错误: ${errData.error || response.statusText}`);
        });
      }
      return response.json();
    })
    .then(initialData => {
      // 确保数据是数组
      if (!Array.isArray(initialData)) {
        console.warn('后端返回的不是数组:', initialData);
        
        // 尝试回退到云南省
        return fetch(`http://192.168.89.206:5000/api/fvc-summary?year=${currentYear}&region_name=云南省&level=1`)
          .then(res => res.json());
      }
      return initialData; // ✅ 关键修复：返回原始数据
    })
    .then(pieData => {
      // ✅ 添加调试日志
      console.log('接收到的饼图数据:', pieData);
      
      if (!pieData || pieData.length === 0) {
        console.warn('饼图数据为空，终止绘图');
        return;
      }
      
      if (!Array.isArray(pieData)) {
        console.warn('后端返回的不是数组:', pieData);
        return;
      }
      
      // 定义颜色映射
      const colorMap = {
        '低': '#E5F5E0',
        '中低': '#8cc3d2ff',
        '中': '#61acc1ff',
        '中高': '#47899bff',
        '高': '#f3ad5dff'
      };

      const colors = pieData.map(item => colorMap[item.name] || '#CCCCCC');

      const chartDom = document.getElementById('coveragePieChart');
      if (!chartDom) return;
      
      let myChart = echarts.getInstanceByDom(chartDom);
      if (!myChart) myChart = echarts.init(chartDom);

      // ✅ 确保数据有值属性
      const chartData = pieData.map(item => ({
        name: item.name,
        value: item.value
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} km² ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: chartData.map(item => item.name)
        },
        series: [
          {
            name: '植被覆盖度',
            type: 'pie',
            radius: ['35%', '60%'],
            avoidLabelOverlap: false,
            top: 0,
            bottom: 10,
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
            labelLine: { show: true },
            data: chartData, // ✅ 使用处理后的数据
            color: colors
          }
        ]
      };

      myChart.setOption(option);
      window.addEventListener('resize', function() {
        myChart.resize();
      });
      
      // ✅ 添加成功日志
      console.log('饼图成功渲染');
    })
    .catch(err => {
      console.error('获取饼图数据失败:', err);
      // ✅ 可以在这里显示错误提示给用户
    });
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
