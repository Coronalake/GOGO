// tempRainfall.js - 修改版本

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log('开始加载温度降水数据可视化模块');
  // 加载温度降水数据
  loadTemperatureRainfallData();
  
  // 为搜索按钮添加事件监听器
  const searchBtn = document.getElementById('region-search-btn');
  if (searchBtn) {
    console.log('搜索按钮已找到，添加点击事件');
    searchBtn.addEventListener('click', updateTemperatureRainfallChart);
  } else {
    console.error('未找到搜索按钮');
  }
});

// 加载CSV数据
function loadTemperatureRainfallData() {
  console.log('开始加载CSV数据');
  fetch('tempre.csv')
    .then(response => {
      console.log('CSV响应状态:', response.status);
      return response.text();
    })
    .then(csvData => {
      console.log('CSV数据已获取，长度:', csvData.length);
      // 解析CSV数据
      window.temperatureRainfallData = parseCSV(csvData);
      console.log('温度降水数据加载成功，数据条数:', window.temperatureRainfallData.length);
      // 初始加载时显示云南省数据
      updateTemperatureRainfallChart();
    })
    .catch(error => console.error('加载温度降水数据失败:', error));
}

// 解析CSV数据
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  console.log('CSV行数:', lines.length);
  const headers = lines[0].split(',');
  console.log('CSV表头:', headers);
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= 5) {  // 确保有足够的列
      const entry = {
        region_code: values[0].trim(),
        region_name: values[1].trim(),
        year: values[2].trim(),
        temp_mean: parseFloat(values[3].trim()),
        pre_mean: parseFloat(values[4].trim())
      };
      data.push(entry);
    } else {
      console.warn(`第${i}行数据列数不足:`, values);
    }
  }
  
  return data;
}

// 更新温度降水图表
function updateTemperatureRainfallChart() {
  console.log('开始更新温度降水图表');
  
  // 如果数据未加载，则退出
  if (!window.temperatureRainfallData) {
    console.error('温度降水数据尚未加载');
    return;
  }
  
  // 获取用户选择的地区
  const citySelect = document.getElementById('city-select');
  const countySelect = document.getElementById('county-select');
  
  let selectedRegion = '云南省';
  
  // 如果选择了县
  if (countySelect && countySelect.value) {
    const countyName = countySelect.options[countySelect.selectedIndex].text;
    selectedRegion = countyName;
  }
  // 如果选择了市但没选县
  else if (citySelect && citySelect.value) {
    const cityName = citySelect.options[citySelect.selectedIndex].text;
    selectedRegion = cityName;
  }
  
  console.log('选中区域:', selectedRegion);
  
  // 过滤数据 - 精确匹配区域名称
  let filteredData = window.temperatureRainfallData.filter(item => 
    item.region_name === selectedRegion
  );
  
  console.log('过滤后数据条数:', filteredData.length);
  
  // 如果没有匹配数据，使用云南省数据
  if (filteredData.length === 0) {
    console.warn('未找到匹配的数据，使用云南省数据');
    filteredData = window.temperatureRainfallData.filter(item => 
      item.region_name === '云南省'
    );
  }
  
  // 按年份排序
  filteredData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  
  // 提取年份、温度和降水量数据
  const years = filteredData.map(item => item.year);
  const temperatures = filteredData.map(item => item.temp_mean);
  const rainfall = filteredData.map(item => item.pre_mean);
  
  console.log('年份数据:', years);
  console.log('温度数据:', temperatures);
  console.log('降水量数据:', rainfall);
  
  // 创建图表
  const chartDom = document.getElementById('tempRainfallChart');
  if (!chartDom) {
    console.error('未找到图表容器元素');
    return;
  }
  
  console.log('图表容器已找到');
  
  try {
    // 初始化或重用图表实例
    let myChart = echarts.getInstanceByDom(chartDom);
    if (!myChart) {
      console.log('创建新的图表实例');
      myChart = echarts.init(chartDom);
    } else {
      console.log('使用现有图表实例');
    }
    
    // 设置图表选项 - 移除title配置
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['平均气温', '平均降水量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: years,
        name: '年份'
      },
      yAxis: [
        {
          type: 'value',
          name: '温度(°C)',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#FF4500'
            }
          }
        },
        {
          type: 'value',
          name: '降水量(mm)',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#1E90FF'
            }
          }
        }
      ],
      series: [
        {
          name: '平均气温',
          type: 'line',
          yAxisIndex: 0,
          data: temperatures,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#FF4500'
          },
          itemStyle: {
            color: '#FF4500'
          }
        },
        {
          name: '平均降水量',
          type: 'line',
          yAxisIndex: 1,
          data: rainfall,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#1E90FF'
          },
          itemStyle: {
            color: '#1E90FF'
          },
          areaStyle: {
            opacity: 0.2,
            color: '#1E90FF'
          }
        }
      ]
    };
    
    console.log('图表配置已设置');
    
    // 渲染图表
    myChart.setOption(option);
    console.log('图表已渲染');
    
    // 窗口大小变化时调整图表大小
    window.addEventListener('resize', function() {
      myChart.resize();
    });
  } catch (error) {
    console.error('图表渲染出错:', error);
  }
}
