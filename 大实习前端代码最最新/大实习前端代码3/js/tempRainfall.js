// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log('开始加载气温降水数据可视化模块');
  // 加载数据
  loadTempRainData();
  
  // 为搜索按钮添加事件监听器
  const searchButton = document.getElementById('region-search-btn');
  if (searchButton) {
    console.log('搜索按钮已找到，添加点击事件');
    searchButton.addEventListener('click', function() {
      updateTempRainChart();
    });
  } else {
    console.error('未找到搜索按钮');
  }
});

// 存储所有气温降水数据
let climateData = [];

// 加载CSV数据
function loadTempRainData() {
  console.log('开始加载气温降水CSV数据');
  fetch('tempre.csv')
    .then(response => {
      console.log('CSV响应状态:', response.status);
      return response.text();
    })
    .then(csvData => {
      console.log('CSV数据已获取，长度:', csvData.length);
      // 解析CSV数据
      const parsedData = parseClimateCSV(csvData);
      climateData = parsedData;
      console.log('气温降水数据加载成功，数据条数:', climateData.length);
      // 初始加载时显示图表
      updateTempRainChart();
    })
    .catch(error => console.error('加载气温降水数据失败:', error));
}

// 解析CSV数据
function parseClimateCSV(csvText) {
  const lines = csvText.trim().split('\n');
  console.log('CSV行数:', lines.length);
  
  const parsedData = [];
  // 从第二行开始解析（跳过表头）
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= 5) {
      const entry = {
        region_code: values[0].trim(),
        region_name: values[1].trim(),
        year: values[2].trim(),
        temp_mean: parseFloat(values[3].trim()),
        pre_mean: parseFloat(values[4].trim())
      };
      
      parsedData.push(entry);
    }
  }
  
  return parsedData;
}

// 更新气温降水图表
function updateTempRainChart() {
  console.log('开始更新气温降水图表');
  
  try {
    // 如果数据未加载，则退出
    if (!climateData || climateData.length === 0) {
      console.error('气温降水数据尚未加载');
      return;
    }
    
    // 获取用户选择的地区
    const citySelector = document.getElementById('city-select');
    const countySelector = document.getElementById('county-select');
    
    let selectedRegion = '云南省';
    
    // 如果选择了县
    if (countySelector && countySelector.value) {
      const countyName = countySelector.options[countySelector.selectedIndex].text;
      selectedRegion = countyName;
    }
    // 如果选择了市但没选县
    else if (citySelector && citySelector.value) {
      const cityName = citySelector.options[citySelector.selectedIndex].text;
      selectedRegion = cityName;
    }
    
    console.log('选中区域:', selectedRegion);
    
    // 过滤选定地区的所有年份数据
    let filteredClimateData = climateData.filter(item => 
      item.region_name === selectedRegion
    );
    
    // 如果没有匹配数据，使用云南省数据
    if (filteredClimateData.length === 0) {
      console.warn(`未找到${selectedRegion}的数据，使用云南省数据`);
      filteredClimateData = climateData.filter(item => 
        item.region_name === '云南省'
      );
    }
    
    console.log('过滤后数据条数:', filteredClimateData.length);
    
    // 按年份排序
    filteredClimateData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    // 提取年份、温度和降水量数据
    const yearLabels = filteredClimateData.map(item => item.year);
    const tempValues = filteredClimateData.map(item => item.temp_mean);
    const rainValues = filteredClimateData.map(item => item.pre_mean);
    
    console.log('年份数据:', yearLabels);
    console.log('温度数据:', tempValues);
    console.log('降水量数据:', rainValues);
    
    // 创建图表
    const chartElement = document.getElementById('tempRainfallChart');
    if (!chartElement) {
      console.error('未找到图表容器元素');
      return;
    }
    
    // 设置容器样式确保可见
    chartElement.style.width = '100%';
    chartElement.style.height = '250px';
    chartElement.style.minHeight = '200px';
    
    // 初始化或重用图表实例
    let climateChart = echarts.getInstanceByDom(chartElement);
    if (!climateChart) {
      climateChart = echarts.init(chartElement);
    }
    
    // 设置图表选项
    const chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['平均气温', '平均降水量'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: yearLabels,
        name: '年份',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '温度(°C)',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#f3ad5dff'
            }
          }
        },
        {
          type: 'value',
          name: '降水量(mm)',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#61acc1ff'
            }
          }
        }
      ],
      series: [
        {
          name: '平均气温',
          type: 'line',
          yAxisIndex: 0,
          data: tempValues,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#f3ad5dff'
          },
          itemStyle: {
            color: '#f3ad5dff'
          }
        },
        {
          name: '平均降水量',
          type: 'line',
          yAxisIndex: 1,
          data: rainValues,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#61acc1ff'
          },
          itemStyle: {
            color: '#61acc1ff'
          },
          areaStyle: {
            opacity: 0.2,
            color: '#61acc1ff'
          }
        }
      ]
    };
    
    // 渲染图表
    climateChart.setOption(chartOptions);
    console.log('气温降水图表已渲染');
    
    // 窗口大小变化时调整图表大小
    window.addEventListener('resize', function() {
      climateChart.resize();
    });
  } catch (error) {
    console.error('图表更新失败:', error);
  }
}
