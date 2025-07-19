document.addEventListener('DOMContentLoaded', function () {
  console.log('页面加载完毕，初始化气候图表');

  updateTempRainChart(); // 页面首次加载时渲染默认城市数据

  const searchButton = document.getElementById('region-search-btn');
  if (searchButton) {
    searchButton.addEventListener('click', updateTempRainChart);
  }
});

function updateTempRainChart() {
  const citySelector = document.getElementById('city-select');
  const countySelector = document.getElementById('county-select');

  let selectedRegion = '昆明市';  // 默认值
  if (countySelector && countySelector.value) {
    selectedRegion = countySelector.options[countySelector.selectedIndex].text;
  } else if (citySelector && citySelector.value) {
    selectedRegion = citySelector.options[citySelector.selectedIndex].text;
  }

  console.log('请求区域：', selectedRegion);

  fetch(`http://192.168.230.206:5000/api/climate_data?region_name=${encodeURIComponent(selectedRegion)}`)
  fetch(`http://192.168.230.206:5000/api/climate_data?region_name=${encodeURIComponent(selectedRegion)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应错误');
      }
      return response.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        console.warn('没有获取到后端返回的数据');
        return;
      }

      const yearLabels = data.map(d => d.year);
      const tempValues = data.map(d => d.temp_mean);
      const rainValues = data.map(d => d.pre_mean);

      const chartElement = document.getElementById('tempRainfallChart');
      if (!chartElement) {
        console.error('图表容器不存在');
        return;
      }

      chartElement.style.width = '100%';
      chartElement.style.height = '250px';

      let chartInstance = echarts.getInstanceByDom(chartElement);
      if (!chartInstance) {
        chartInstance = echarts.init(chartElement);
      }

      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['平均气温', '平均降水量'], bottom: 10 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: yearLabels,
          name: '年份',
          nameLocation: 'middle',
          nameGap: 30,
          axisLabel: { rotate: 45 }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true

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

      chartInstance.setOption(option);
    })
    .catch(err => {
      console.error('获取并渲染气候数据失败:', err);
    });
}
