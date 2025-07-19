document.addEventListener('DOMContentLoaded', function() {

    // 1. 动态生成时间选择选项
    // --------------------------
    const startTimeSelect = document.getElementById('startTimeSelect');
    const endTimeSelect = document.getElementById('endTimeSelect');

    // 生成近10年的时间选项（可精确到月份）
    function generateTimeOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 9; // 近10年
        
        // 遍历年份和月份，生成选项
        for (let year = startYear; year <= currentYear; year++) {
            for (let month = 1; month <= 12; month++) {
                const monthStr = month.toString().padStart(2, '0'); // 月份补0（如1→01）
                const value = `${year}-${monthStr}`; // 选项值：2014-01
                const text = `${year}年${month}月`; // 显示文本：2014年1月

                // 创建起始时间选项
                const startOption = document.createElement('option');
                startOption.value = value;
                startOption.textContent = text;
                startTimeSelect.appendChild(startOption);

                // 复制选项到结束时间（避免重复创建）
                const endOption = startOption.cloneNode(true);
                endTimeSelect.appendChild(endOption);
            }
        }

        // 默认选中：起始时间为5年前，结束时间为当前
        const defaultStart = `${currentYear - 5}-01`;
        const defaultEnd = `${currentYear}-12`;
        startTimeSelect.value = defaultStart;
        endTimeSelect.value = defaultEnd;
    }

    //2.动态监测报告
    // 找到动态监测页面下的确认按钮（根据实际结构，确保在 .monitor-page 下）
    const confirmBtn = document.querySelector('.monitor-page .confirm-btn');
    const reportModal = document.getElementById('reportModal');
    const reportcloseBtns = document.querySelectorAll('.monitor-page .close-btn');
    const downloadReportBtn = document.getElementById('downloadReport');

    // 点击确认按钮时触发报告模态框
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 1. 收集筛选条件
          const startTime = document.getElementById('startTimeSelect').value;
          const endTime = document.getElementById('endTimeSelect').value;
          const region = document.getElementById('dataType').value;

          // 2. 填充报告内容
          document.getElementById('reportTime').textContent = `${startTime} 至 ${endTime}`;
          document.getElementById('reportRange').textContent = region;

          // 3. 显示报告模态框
          reportModal.style.display = 'flex';
      });
    }

    // 关闭报告模态框
    reportcloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (reportModal) {
              reportModal.style.display = 'none';
            }
        });
    });

    // 关闭报告模态框
    window.addEventListener('click', function(e) {
        if (e.target === reportModal && reportModal) {
            reportModal.style.display = 'none';
        }
    });

    // 3.模型预测页面逻辑
  if (document.body.classList.contains('model-predict-page')) {
    const confirmBtn = document.getElementById('predictConfirm');
    const reportModal = document.getElementById('reportModal');
    const closeReport = document.getElementById('closeReport');
    const yearRange = document.getElementById('yearRange');
    const rangeValue = document.getElementById('rangeValue');
    const regionSelect = document.getElementById('regionSelect');
    const reportTitle = document.getElementById('reportTitle');
    
    // 时间范围滑块实时更新
    if (yearRange && rangeValue) {
      yearRange.addEventListener('input', function() {
        const unit = this.getAttribute('data-unit');
        rangeValue.textContent = `${this.value} ${unit}`;
      });
    }
    
    // 确认按钮点击事件
    if (confirmBtn && reportModal && regionSelect && reportTitle) {
      confirmBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 获取参数
        const year = yearRange ? yearRange.value : '1';
        const regionText = regionSelect.options[regionSelect.selectedIndex].text;
        const climateText = climateSelect.options[climateSelect.selectedIndex].text;

        // 更新报告标题
        reportTitle.textContent = `2022年至${year}年云南省${regionText}${climateText}植被覆盖度预测折线图`;

        // 显示报告模态框
        reportModal.style.display = 'block';
      });
    }
    
    // 关闭报告模态框
    if (closeReport && reportModal) {
      closeReport.addEventListener('click', function() {
        reportModal.style.display = 'none';
      });
    }
    
    // 点击空白区域关闭
    window.addEventListener('click', function(e) {
      if (e.target === reportModal) {
        reportModal.style.display = 'none';
      }
    });
  }
    // 登录和注册模态框控制
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const registerLink = document.querySelector('.register-link');
    const forgotPwdLink = document.querySelector('.forgot-pwd');

    // 打开登录模态框
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });

    // 打开注册模态框
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'flex';
    });

    // 从登录切换到注册
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });

    // 从登录切换到重置密码
    forgotPwdLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex'; // 这里使用相同的注册模态框来重置密码
    });

    // 关闭模态框
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // 时间轴控制
    const timeSlider = document.getElementById('timeSlider');
    timeSlider.addEventListener('input', function() {
        updateMapData(this.value);
    });

    // 筛选控制
    const dataTypeSelect = document.getElementById('dataType');
    const regionRadios = document.querySelectorAll('input[name="region"]');

    dataTypeSelect.addEventListener('change', function() {
        updateFilters();
    });

    regionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateFilters();
        });
    });

    function updateFilters() {
        const dataType = dataTypeSelect.value;
        const regionType = document.querySelector('input[name="region"]:checked').value;
        updateMapData(timeSlider.value, dataType, regionType);
    }


// 区域级联下拉框功能
(function() {
    // 确保DOM完全加载后再执行
    function initRegionSelectors() {
        console.log('初始化区域选择器...');
        
        // 检查元素是否存在
        const citySelect = document.getElementById('city-select');
        const countySelect = document.getElementById('county-select');
        const searchBtn = document.getElementById('region-search-btn');
        
        if (!citySelect || !countySelect || !searchBtn) {
            console.error('找不到区域选择器元素，请检查HTML结构');
            return;
        }
        
        // 县级数据（按市级代码组织）
        const countyData = {
            '530100': [ // 昆明市
                {code: '530102', name: '五华区'},
                {code: '530103', name: '盘龙区'},
                {code: '530111', name: '官渡区'},
                {code: '530112', name: '西山区'},
                {code: '530113', name: '东川区'},
                {code: '530114', name: '呈贡区'},
                {code: '530115', name: '晋宁区'},
                {code: '530124', name: '富民县'},
                {code: '530125', name: '宜良县'},
                {code: '530126', name: '石林彝族自治县'},
                {code: '530127', name: '嵩明县'},
                {code: '530128', name: '禄劝彝族苗族自治县'},
                {code: '530129', name: '寻甸回族彝族自治县'},
                {code: '530181', name: '安宁市'}
            ],
            '530300': [ // 曲靖市
                {code: '530302', name: '麒麟区'},
                {code: '530303', name: '沾益区'},
                {code: '530304', name: '马龙区'},
                {code: '530322', name: '陆良县'},
                {code: '530323', name: '师宗县'},
                {code: '530324', name: '罗平县'},
                {code: '530325', name: '富源县'},
                {code: '530326', name: '会泽县'},
                {code: '530381', name: '宣威市'}
            ],
            '530400': [ // 玉溪市
                {code: '530402', name: '红塔区'},
                {code: '530403', name: '江川区'},
                {code: '530422', name: '澄江市'},
                {code: '530423', name: '通海县'},
                {code: '530424', name: '华宁县'},
                {code: '530425', name: '易门县'},
                {code: '530426', name: '峨山彝族自治县'},
                {code: '530427', name: '新平彝族傣族自治县'},
                {code: '530428', name: '元江哈尼族彝族傣族自治县'}
            ],
            '530500': [ // 保山市
                {code: '530502', name: '隆阳区'},
                {code: '530521', name: '施甸县'},
                {code: '530523', name: '龙陵县'},
                {code: '530524', name: '昌宁县'},
                {code: '530581', name: '腾冲市'}
            ],
            '530600': [ // 昭通市
                {code: '530602', name: '昭阳区'},
                {code: '530621', name: '鲁甸县'},
                {code: '530622', name: '巧家县'},
                {code: '530623', name: '盐津县'},
                {code: '530624', name: '大关县'},
                {code: '530625', name: '永善县'},
                {code: '530626', name: '绥江县'},
                {code: '530627', name: '镇雄县'},
                {code: '530628', name: '彝良县'},
                {code: '530629', name: '威信县'},
                {code: '530681', name: '水富市'}
            ],
            '530700': [ // 丽江市
                {code: '530702', name: '古城区'},
                {code: '530721', name: '玉龙纳西族自治县'},
                {code: '530722', name: '永胜县'},
                {code: '530723', name: '华坪县'},
                {code: '530724', name: '宁蒗彝族自治县'}
            ],
            '530800': [ // 普洱市
                {code: '530802', name: '思茅区'},
                {code: '530821', name: '宁洱哈尼族彝族自治县'},
                {code: '530822', name: '墨江哈尼族自治县'},
                {code: '530823', name: '景东彝族自治县'},
                {code: '530824', name: '景谷傣族彝族自治县'},
                {code: '530825', name: '镇沅彝族哈尼族拉祜族自治县'},
                {code: '530826', name: '江城哈尼族彝族自治县'},
                {code: '530827', name: '孟连傣族拉祜族佤族自治县'},
                {code: '530828', name: '澜沧拉祜族自治县'},
                {code: '530829', name: '西盟佤族自治县'}
            ],
            '530900': [ // 临沧市
                {code: '530902', name: '临翔区'},
                {code: '530921', name: '凤庆县'},
                {code: '530922', name: '云县'},
                {code: '530923', name: '永德县'},
                {code: '530924', name: '镇康县'},
                {code: '530925', name: '双江拉祜族佤族布朗族傣族自治县'},
                {code: '530926', name: '耿马傣族佤族自治县'},
                {code: '530927', name: '沧源佤族自治县'}
            ],
            '532300': [ // 楚雄彝族自治州
                {code: '532301', name: '楚雄市'},
                {code: '532322', name: '双柏县'},
                {code: '532323', name: '牟定县'},
                {code: '532324', name: '南华县'},
                {code: '532325', name: '姚安县'},
                {code: '532326', name: '大姚县'},
                {code: '532327', name: '永仁县'},
                {code: '532328', name: '元谋县'},
                {code: '532329', name: '武定县'},
                {code: '532331', name: '禄丰县'}
            ],
            '532500': [ // 红河哈尼族彝族自治州
                {code: '532501', name: '个旧市'},
                {code: '532502', name: '开远市'},
                {code: '532503', name: '蒙自市'},
                {code: '532504', name: '弥勒市'},
                {code: '532523', name: '屏边苗族自治县'},
                {code: '532524', name: '建水县'},
                {code: '532525', name: '石屏县'},
                {code: '532527', name: '泸西县'},
                {code: '532528', name: '元阳县'},
                {code: '532529', name: '红河县'},
                {code: '532530', name: '金平苗族瑶族傣族自治县'},
                {code: '532531', name: '绿春县'},
                {code: '532532', name: '河口瑶族自治县'}
            ],
            '532600': [ // 文山壮族苗族自治州
                {code: '532601', name: '文山市'},
                {code: '532622', name: '砚山县'},
                {code: '532623', name: '西畴县'},
                {code: '532624', name: '麻栗坡县'},
                {code: '532625', name: '马关县'},
                {code: '532626', name: '丘北县'},
                {code: '532627', name: '广南县'},
                {code: '532628', name: '富宁县'}
            ],
            '532800': [ // 西双版纳傣族自治州
                {code: '532801', name: '景洪市'},
                {code: '532822', name: '勐海县'},
                {code: '532823', name: '勐腊县'}
            ],
            '532900': [ // 大理白族自治州
                {code: '532901', name: '大理市'},
                {code: '532922', name: '漾濞彝族自治县'},
                {code: '532923', name: '祥云县'},
                {code: '532924', name: '宾川县'},
                {code: '532925', name: '弥渡县'},
                {code: '532926', name: '南涧彝族自治县'},
                {code: '532927', name: '巍山彝族回族自治县'},
                {code: '532928', name: '永平县'},
                {code: '532929', name: '云龙县'},
                {code: '532930', name: '洱源县'},
                {code: '532931', name: '剑川县'},
                {code: '532932', name: '鹤庆县'}
            ],
            '533100': [ // 德宏傣族景颇族自治州
                {code: '533102', name: '瑞丽市'},
                {code: '533103', name: '芒市'},
                {code: '533122', name: '梁河县'},
                {code: '533123', name: '盈江县'},
                {code: '533124', name: '陇川县'}
            ],
            '533300': [ // 怒江傈僳族自治州
                {code: '533301', name: '泸水市'},
                {code: '533323', name: '福贡县'},
                {code: '533324', name: '贡山独龙族怒族自治县'},
                {code: '533325', name: '兰坪白族普米族自治县'}
            ],
            '533400': [ // 迪庆藏族自治州
                {code: '533401', name: '香格里拉市'},
                {code: '533422', name: '德钦县'},
                {code: '533423', name: '维西傈僳族自治县'}
            ]
        };

        // 市级下拉框变化时更新县级下拉框
        citySelect.addEventListener('change', function() {
            const cityCode = this.value;
            console.log('选择了市:', cityCode);
            updateCountyOptions(cityCode);
        });

        // 搜索按钮点击事件
        searchBtn.addEventListener('click', function() {
            const provinceCode = document.getElementById('province-select').value;
            const cityCode = citySelect.value;
            const countyCode = countySelect.value;
            
            // 构建查询参数
            const params = {
                province: provinceCode,
                city: cityCode || '',
                county: countyCode || ''
            };
            
            console.log('搜索参数:', params);
            
            // 这里可以添加调用搜索API或更新图表的代码
            // 例如: searchRegionData(params);
            
            // 临时提示
           // alert(`搜索条件: 省=${params.province}, 市=${params.city || '全省'}, 县=${params.county || '全市'}`);

            
        });

        // 更新县级下拉框选项
        function updateCountyOptions(cityCode) {
            // 清空当前选项
            countySelect.innerHTML = '<option value="">请选择县</option>';
            
            // 如果选择了市，且有对应的县级数据
            if (cityCode && countyData[cityCode]) {
                const counties = countyData[cityCode];
                
                // 添加新选项
                counties.forEach(county => {
                    const option = document.createElement('option');
                    option.value = county.code;
                    option.textContent = county.name;
                    countySelect.appendChild(option);
                });
                
                // 启用县级下拉框
                countySelect.disabled = false;
            } else {
                // 禁用县级下拉框
                countySelect.disabled = true;
            }
        }

        // 初始化县级下拉框
        updateCountyOptions('');
        console.log('区域选择器初始化完成');
    }

    // 确保DOM加载完成后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRegionSelectors);
    } else {
        // 如果DOM已经加载完成，直接执行
        initRegionSelectors();
    }
})(); // 立即执行函数，避免全局变量污染

});

// 在main.js开头添加
// 定义全局标题变量
let chartTitles = {
  coverageArea: '云南省不同等级植被覆盖度面积',
  averageCoverage: '云南省平均植被覆盖度',
  temperature: '云南省十年温度变化和降水量',
  tenYearCoverage: '云南省十年平均植被覆盖度'
};

// 创建一个函数来更新图表标题
function updateChartTitles() {
  // 更新DOM中的实际标题文本
  document.querySelectorAll('h3').forEach(h3 => {
    for (const key in chartTitles) {
      if (h3.textContent.includes('云南省') && 
          (h3.textContent.includes('不同等级植被覆盖度面积') || 
           h3.textContent.includes('平均植被覆盖度') || 
           h3.textContent.includes('十年温度变化和降水量') || 
           h3.textContent.includes('十年平均植被覆盖度'))) {
        // 找到需要替换的标题并更新
        const newText = h3.textContent.replace(/云南省.*?(不同等级植被覆盖度面积|平均植被覆盖度|十年温度变化和降水量|十年平均植被覆盖度)/, chartTitles[key]);
        h3.textContent = newText;
        break;
      }
    }
  });
}

// 在搜索按钮点击事件中
document.getElementById('region-search-btn').addEventListener('click', function() {
  // 获取当前选中的市县
  const citySelect = document.getElementById('city-select');
  const countySelect = document.getElementById('county-select');
  
  // 默认区域名称
  let regionText = '云南省';
  
  // 如果选择了市
  if (citySelect && citySelect.value && citySelect.value !== '') {
    const cityName = citySelect.options[citySelect.selectedIndex].text;
    regionText += cityName;
    
    // 如果选择了县
    if (countySelect && countySelect.value && countySelect.value !== '') {
      const countyName = countySelect.options[countySelect.selectedIndex].text;
      regionText += countyName;
    }
  }
  
  // 更新全局标题变量
  chartTitles.coverageArea = regionText + '不同等级植被覆盖度面积';
  chartTitles.averageCoverage = regionText + '平均植被覆盖度';
  chartTitles.temperature = regionText + '十年温度变化和降水量';
  chartTitles.tenYearCoverage = regionText + '十年平均植被覆盖度';
  
  console.log('标题已更新:', chartTitles);
  
  // 手动替换HTML中的标题文本
  const allH3Elements = document.querySelectorAll('h3');
  
  allH3Elements.forEach(h3 => {
    const text = h3.textContent.trim();
    
    if (text.includes('不同等级植被覆盖度面积')) {
      h3.textContent = chartTitles.coverageArea;
    } 
    else if (text.includes('平均植被覆盖度') && !text.includes('十年')) {
      h3.textContent = chartTitles.averageCoverage;
    }
    else if (text.includes('十年温度变化和降水量')) {
      h3.textContent = chartTitles.temperature;
    }
    else if (text.includes('十年平均植被覆盖度')) {
      h3.textContent = chartTitles.tenYearCoverage;
    }
  });
  
  
});

