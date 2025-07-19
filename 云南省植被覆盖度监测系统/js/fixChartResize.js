(function () {
  // 等待所有图表脚本加载完成
  window.addEventListener('load', function () {
    const containers = [
      document.getElementById('coveragePieChart'),
      document.getElementById('tempRainfallChart')
    ];

    containers.forEach(dom => {
      if (!dom) return;
      const chart = echarts.getInstanceByDom(dom);
      if (chart) {
        // 强制重新计算尺寸
        chart.resize();
      }
    });
  });

  // 窗口大小变化时统一 resize
  window.addEventListener('resize', function () {
    ['coveragePieChart', 'tempRainfallChart'].forEach(id => {
      const chart = echarts.getInstanceByDom(document.getElementById(id));
      chart && chart.resize();
    });
  });
})();