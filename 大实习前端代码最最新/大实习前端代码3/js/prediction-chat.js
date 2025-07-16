// 确保这个文件保存在正确位置：项目目录/js/prediction-chart.js
console.log('预测图表脚本已加载');

// 使用DOMContentLoaded确保DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，开始初始化');
    
    // 1. 安全获取元素
    function getSafeElement(id) {
        const el = document.getElementById(id);
        if (!el) console.warn('未找到元素: #' + id);
        return el;
    }

    // 2. 获取所有需要的元素
    const elements = {
        yearRange: getSafeElement('yearRange'),
        rangeValue: getSafeElement('rangeValue'),
        regionSelect: getSafeElement('regionSelect'),
        // 更可靠的气候情景选择器获取方式
        scenarioSelect: document.querySelector('.form-group:nth-of-type(3) select'),
        predictConfirm: getSafeElement('predictConfirm'),
        reportModal: getSafeElement('reportModal'),
        closeReport: getSafeElement('closeReport'),
        reportTitle: getSafeElement('reportTitle'),
        chartContainer: getSafeElement('predictionChart')
    };

    // 3. 检查关键元素是否存在
    if (!elements.predictConfirm || !elements.reportModal) {
        console.error('关键元素缺失，功能无法正常工作');
        return;
    }

    // 4. 初始化时间轴
    if (elements.yearRange) {
        elements.yearRange.addEventListener('input', function() {
            elements.rangeValue.textContent = this.value + ' 年';
        });
        // 设置初始值
        elements.yearRange.value = 2023;
        elements.rangeValue.textContent = '2023 年';
    }

    // 5. 确认按钮功能
    elements.predictConfirm.addEventListener('click', function() {
        console.log('确认按钮被点击');
        
        try {
            // 获取选择值
            const endYear = parseInt(elements.yearRange.value) || 2023;
            const region = elements.regionSelect.value;
            const scenario = elements.scenarioSelect.value === '4.5' ? 'SSP2-4.5' : 'SSP5-8.5';
            
            if (!region) {
                alert('请选择区域');
                return;
            }

            // 获取区域名称
            const regionName = elements.regionSelect.options[elements.regionSelect.selectedIndex].text;
            
            // 使用模拟数据（实际使用时替换为真实数据加载）
            console.log('正在生成模拟数据...');
            const mockData = generateMockData(endYear, regionName, scenario);
            
            // 渲染图表
            renderChart(mockData, regionName, scenario);
            
            // 显示弹窗
            elements.reportModal.style.display = 'block';
            console.log('弹窗已显示');
            
        } catch (error) {
            console.error('生成报告出错:', error);
            alert('操作失败: ' + error.message);
        }
    });

    // 6. 关闭弹窗
    elements.closeReport.addEventListener('click', function() {
        elements.reportModal.style.display = 'none';
    });

    // 7. 模拟数据生成（测试用）
    function generateMockData(endYear, regionName, scenario) {
        const data = [];
        for (let year = 2023; year <= endYear; year++) {
            data.push({
                year: year.toString(),
                region_name: regionName,
                scenario: scenario,
                mean_pred: (0.7 + Math.random() * 0.2).toFixed(4)
            });
        }
        return data;
    }

    function renderChart(data, regionName, scenario) {
    try {
        // 清空容器并创建canvas
        const chartContainer = document.querySelector('.chart-container');
        chartContainer.innerHTML = '<canvas id="predictionChartCanvas"></canvas>';
        const canvas = document.getElementById('predictionChartCanvas');
        
        // 确保canvas有明确的尺寸
        canvas.width = chartContainer.offsetWidth;
        canvas.height = chartContainer.offsetHeight;
        
        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.map(d => d.year),
                datasets: [{
                    label: `${regionName} (${scenario})`,
                    data: data.map(d => parseFloat(d.mean_pred)),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '植被覆盖度预测趋势',
                        font: { size: 18 },
                        padding: { top: 10, bottom: 20 }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { 
                            display: true, 
                            text: '植被覆盖度值',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        title: { 
                            display: true, 
                            text: '年份',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('图表渲染失败:', error);
        document.querySelector('.chart-container').innerHTML = 
            '<div style="color:red; padding:20px; text-align:center">图表渲染失败，请刷新重试</div>';
    }
}

    console.log('预测功能初始化完成');
});