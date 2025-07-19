/**
 * 图例切换控制
 * 当选择“植被覆盖度”时显示 mapLegend，隐藏 demLegend
 * 当选择“地形”时隐藏 mapLegend，显示 demLegend
 * 其它选项隐藏两个图例
 */
(function () {
  // 等待 DOM 就绪
  document.addEventListener('DOMContentLoaded', initLegendControl);

  function initLegendControl() {
    const select = document.getElementById('dataType');
    const legendVeg = document.getElementById('mapLegend');
    const legendDEM = document.getElementById('demLegend');
    const legendland =document.getElementById('landformLegend');
    // 初始状态
    updateLegend(select.value);

    // 监听下拉框变化
    select.addEventListener('change', function () {
      updateLegend(this.value);
    });

    // 根据选项值更新图例显示/隐藏
    function updateLegend(val) {
      switch (val) {
        case '1': // 植被覆盖度
          legendVeg.style.display = 'block';
          legendDEM.style.display = 'none';
          legendland.style.display= 'none';
          break;
        case '2': // 地形
          legendVeg.style.display = 'none';
          legendDEM.style.display = 'block';
          legendland.style.display= 'none';
          break;
          case '3': // 植被类型
          legendVeg.style.display = 'none';
          legendDEM.style.display = 'none';
          legendland.style.display= 'none';
          break;
         case '4': // 地貌类型
          legendland.style.display= 'block';
          legendVeg.style.display = 'none';
          legendDEM.style.display = 'none';
          break;
        default:  // 植被类型、地貌类型等
          legendVeg.style.display = 'none';
          legendDEM.style.display = 'none';
      }
    }
  }
})();