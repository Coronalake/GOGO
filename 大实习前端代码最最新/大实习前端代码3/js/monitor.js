document.addEventListener('DOMContentLoaded', () => {
  // 1. 获取所有关键 DOM 元素
  const areaSelect = document.getElementById('dataType');
  const startTimeSelect = document.getElementById('startTimeSelect');
  const endTimeSelect = document.getElementById('endTimeSelect');
  const confirmBtn = document.querySelector('.confirm-btn');
  const cancelBtn = document.querySelector('.cancel-btn');
  const reportModal = document.getElementById('reportModal');
  const reportMainTitle = document.getElementById('reportMainTitle');
  const reportTime = document.getElementById('reportTime'); // 报告生成时间
  const reportRange = document.getElementById('reportRange');
  const reportChart = document.getElementById('reportChart');
  const closeBtns = document.querySelectorAll('.close-btn');


  // 2. 确认按钮点击事件：填充报告 + 显示弹窗
  confirmBtn.addEventListener('click', () => {

    const startYear = startTimeSelect.value;
    const endYear = endTimeSelect.value;
    const regiontext = dataType.options[dataType.selectedIndex].text;

    // 校验时间有效性
    if (+endYear < +startYear) {
      alert('结束时间不能早于起始时间，请重新选择！');
      return;
    }

    // 填充报告内容
    reportMainTitle.textContent = `云南省${regiontext}${startYear}年至${endYear}年双年植被覆盖度变化监测报告`;
    reportRange.textContent = regiontext;

    // ✅ 关键修改：显示当前日期时间
    reportTime.textContent = new Date().toLocaleString(); // 格式：2023/10/15 14:30:00

    // 动态加载对应图片
    const areaCode = areaSelect.value;                 // 实际下拉框 value
    const areaText = areaSelect.options[areaSelect.selectedIndex].text; // 中文名
    // 如果你想用中文名做文件名：
    const imageUrl = `pic/report-chart/${areaText}-${startYear}-${endYear}.jpg`;
    reportChart.style.backgroundImage = `url('${imageUrl}')`;

    // 处理图片加载失败
    const img = new Image();
    img.src = imageUrl;
    img.onerror = () => {
      reportChart.style.backgroundImage = `url('pic/background.png')`;
      alert(`未找到对应图片：\n${imageUrl}\n请检查文件是否存在或命名是否正确！`);
    };

    // 显示报告模态框
    reportModal.style.display = 'flex';
  });


  // 3. 关闭弹窗逻辑
  function hideReportModal() {
    reportModal.style.display = 'none';
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', hideReportModal);
  });

  cancelBtn.addEventListener('click', hideReportModal);
});