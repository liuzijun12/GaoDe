$(function(){
	map();
    leidatu();
    wuran();
    // huaxing();
	zhexian();
    newsScroll();
    
    // 用户头像交互
    $('.avatar').click(function(e) {
        e.stopPropagation();
        $('.dropdown-menu').fadeToggle(200);
    });
    
    // 点击其他地方关闭下拉菜单
    $(document).click(function() {
        $('.dropdown-menu').fadeOut(200);
    });
    
    // 防止点击下拉菜单时关闭
    $('.dropdown-menu').click(function(e) {
        e.stopPropagation();
    });
});

// 地图函数
// 地图初始化函数
function map() {
    const map = new AMap.Map('map', {
      zoom: 4,
      center: [104.5, 36.5],
      viewMode: '3D'
    });
  
    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.MapType());
  
    const provinceData = {
            '北京': { total: 520 },
            '天津': { total: 210 },
            '河北': { total: 780 },
            '山西': { total: 610 },
            '内蒙古': { total: 390 },
            '辽宁': { total: 720 },
            '吉林': { total: 480 },
            '黑龙江': { total: 620 },
            '上海': { total: 980 },
            '江苏': { total: 1250 },
            '浙江': { total: 1480 },
            '安徽': { total: 920 },
            '福建': { total: 810 },
            '江西': { total: 690 },
            '山东': { total: 1290 },
            '河南': { total: 1850 },
            '湖北': { total: 970 },
            '湖南': { total: 1120 },
            '广东': { total: 2050 },
            '广西': { total: 790 },
            '海南': { total: 310 },
            '重庆': { total: 880 },
            '四川': { total: 1520 },
            '贵州': { total: 610 },
            '云南': { total: 720 },
            '西藏': { total: 55 },
            '陕西': { total: 890 },
            '甘肃': { total: 510 },
            '青海': { total: 220 },
            '宁夏': { total: 290 },
            '新疆': { total: 610 },
            '香港': { total: 95 },
            '澳门': { total: 85 },
            '台湾': { total: 860 }
    };
  
    const provinceNameMap = {
      '北京': '北京市',
      '天津': '天津市',
      '上海': '上海市',
      '重庆': '重庆市',
      '河北': '河北省',
      '山西': '山西省',
      '内蒙古': '内蒙古自治区',
      '辽宁': '辽宁省',
      '吉林': '吉林省',
      '黑龙江': '黑龙江省',
      '江苏': '江苏省',
      '浙江': '浙江省',
      '安徽': '安徽省',
      '福建': '福建省',
      '江西': '江西省',
      '山东': '山东省',
      '河南': '河南省',
      '湖北': '湖北省',
      '湖南': '湖南省',
      '广东': '广东省',
      '广西': '广西壮族自治区',
      '海南': '海南省',
      '四川': '四川省',
      '贵州': '贵州省',
      '云南': '云南省',
      '西藏': '西藏自治区',
      '陕西': '陕西省',
      '甘肃': '甘肃省',
      '青海': '青海省',
      '宁夏': '宁夏回族自治区',
      '新疆': '新疆维吾尔自治区',
      '香港': '香港特别行政区',
      '澳门': '澳门特别行政区',
      '台湾': '台湾省'
    };
  
    const provinces = Object.keys(provinceData);
    let idx = 0;
    let provinceLabels = []; // 存储所有label，便于后续隐藏/显示

    function drawNextProvince() {
      if (idx >= provinces.length) return;
      const province = provinces[idx];
      const searchName = provinceNameMap[province] || province;
      const ds = new AMap.DistrictSearch({
        subdistrict: 0,
        extensions: 'all',
        level: 'province'
      });
      ds.search(searchName, function(status, result) {
        if (status === 'complete' && result.districtList[0]) {
          const boundaries = result.districtList[0].boundaries;
          console.log(searchName, 'boundaries:', boundaries ? boundaries.length : 0);
          if (boundaries && boundaries.length > 0) {
            boundaries.forEach(boundary => {
              new AMap.Polygon({
                path: boundary,
                strokeColor: '#fff',
                strokeWeight: 1,
                fillColor: getProvinceColor(provinceData[province].total),
                fillOpacity: 0.7,
                map: map
              });
            });
          }
          // 添加省份名称标注
          const center = result.districtList[0].center;
          const label = new AMap.Text({
            text: searchName.replace(/(省|市|自治区|特别行政区)$/, ''), // 去掉后缀
            position: center,
            style: {
              'background': 'rgba(255,255,255,0.7)',
              'border': 'none',
              'color': '#333',
              'fontSize': '14px',
              'fontWeight': 'bold',
              'padding': '2px 6px',
              'borderRadius': '4px'
            },
            map: map
          });
          provinceLabels.push(label);
        }
        idx++;
        drawNextProvince(); // 递归请求下一个
      });
    }

    drawNextProvince();

    // 控制label显示/隐藏
    map.on('zoomend', function() {
      const show = map.getZoom() <= 5;
      provinceLabels.forEach(label => {
        label.setMap(show ? map : null);
      });
    });
}

// 颜色分级函数
function getProvinceColor(total) {
  if (total > 1500) return '#ff6666';      // 1501-2000 红色
  if (total > 1000) return '#ffb347';     // 1001-1500 橙色
  if (total > 500)  return '#ffe066';     // 501-1000 黄色
  return '#7be3e3';                      // 0-500 青色
}

// 雷达图函数
function leidatu() {
	var myChart = echarts.init(document.getElementById('leida'));
    
    const diseaseData = [
        { name: '龋齿', value: 670, displayValue: '6.7亿' },
        { name: '牙周炎', value: 270, displayValue: '2.7亿', population: '老年人（60岁以上）', trend: '稳定增长' },
        { name: '牙龈炎', value: 200, displayValue: '2亿', population: '办公人群（20-45岁）', trend: '快速增长' },
        { name: '牙髓炎', value: 100, displayValue: '1亿', population: '中老年人（40岁以上）', trend: '稳定' },
        { name: '口腔溃疡', value: 280, displayValue: '2.8亿', population: '中老年人（45岁以上）', trend: '缓慢增长' },
        { name: '智齿冲突', value: 100, displayValue: '1亿', population: '全年龄段', trend: '波动增长' },
        ];
    option = {
        radar: {
            indicator: diseaseData.map(d => ({
                text: `${d.name}\n(${d.displayValue})`,
                max: 700
            })),
            center: ['50%', '52%'],
            radius: '58%',
	        startAngle: 90,
            splitNumber: 7,
            shape: 'circle',
	        name: {
                formatter: function(value) {
                    return value.replace(/\n/, '\n');
                },
	            textStyle: {
                    fontSize: 12,
                    color: '#5b81cb',
                    padding: [3, 5]
                }
            },
            axisLine: {
	            lineStyle: {
                    color: '#153269',
                    width: 1
	            }
	        },
	        splitLine: {
	            lineStyle: {
                    color: '#113865',
                    width: 1
	            }
            },
            splitArea: {
                show: true,
	            areaStyle: {
                    color: ['rgba(20,28,66,0.3)', 'rgba(20,28,66,0.2)']
	        }
            }
        },
	    series: [{
	        type: 'radar',
            data: [{
                value: diseaseData.map(d => d.value),
                name: '患病人数',
                symbolSize: 8,
                symbol: 'circle',
	        itemStyle: {
	                normal: {
                        color: '#00c2ff',
                        borderColor: '#fff',
                        borderWidth: 2,
	                lineStyle: {
                            color: '#00c2ff',
                            width: 2
	        },
	            areaStyle: {
                            color: 'rgba(0, 194, 255, 0.3)'
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderColor: '#00c2ff',
                        borderWidth: 2,
                        scale: true
                    }
                }
            }]
        }]
    };

	myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });

    console.log('AMap:', AMap);
    console.log('DistrictSearch:', AMap.DistrictSearch);

}

function wuran() {
	var myChart = echarts.init(document.getElementById('wuran'));
    
    // 定义简洁的年龄段数据
    const detailData = {
  '<18岁': {
    '龋齿': { value: 63, detail: '3-5岁儿童龋齿患病率为63%，12岁儿童患病率为62%，需注重早期预防。' },
    '牙周炎': { value: 42, detail: '12岁儿童牙周炎检出率约42%，以牙龈出血为主，需强化刷牙习惯。' },
    '牙龈炎': { value: 60, detail: '牙龈出血率高达57.7%-62%，需关注牙龈健康。' },
    '牙髓炎': { value: 50, detail: '儿童易因龋齿进展而患牙髓炎，应早干预。' },
    '智齿': { value: 0, detail: '智齿尚未萌出，暂无问题。' }
  },
  '18-40岁': {
    '龋齿': { value: 89, detail: '35-44岁龋齿患病率高达89%，是成人主要口腔问题。' },
    '牙周炎': { value: 41, detail: '牙周袋检出率约41%，牙周健康率低，应关注牙周护理。' },
    '牙龈炎': { value: 60, detail: '青年人普遍有不同程度的牙龈炎，需定期洁牙。' },
    '牙髓炎': { value: 60, detail: '多因龋齿未处理，青年阶段牙髓炎高发。' },
    '智齿': { value: 60, detail: '18-25岁为智齿萌出高峰期，常见冠周炎问题。' }
  },
  '40-60岁': {
    '龋齿': { value: 96, detail: '55-64岁龋齿率近96%，多为残根残冠，应及时修复。' },
    '牙周炎': { value: 52, detail: '牙周袋检出率52%，牙槽骨吸收明显。' },
    '牙龈炎': { value: 50, detail: '牙龈退缩普遍，炎症进一步加重。' },
    '牙髓炎': { value: 45, detail: '未及时治疗龋齿常发展为牙髓炎。' },
    '智齿': { value: 10, detail: '大多智齿已处理，仅少数仍存问题。' }
  },
  '60-80岁': {
    '龋齿': { value: 98, detail: '龋齿患病率近98%，影响咀嚼与健康。' },
    '牙周炎': { value: 52, detail: '牙周病是老年牙齿脱落主要原因。' },
    '牙龈炎': { value: 45, detail: '老年人牙龈问题普遍，需维护口腔清洁。' },
    '牙髓炎': { value: 30, detail: '残根感染仍可致牙髓炎，应加强牙科随访。' },
    '智齿': { value: 5, detail: '智齿多已脱落或拔除，问题较少。' }
  },
  '>80岁': {
    '龋齿': { value: 95, detail: '牙体缺失率高，残留牙易龋坏。' },
    '牙周炎': { value: 50, detail: '牙槽骨严重吸收，牙周病影响广泛。' },
    '牙龈炎': { value: 40, detail: '牙龈退缩明显，需适应老年口腔护理。' },
    '牙髓炎': { value: 15, detail: '多数为既往龋病发展，牙髓炎比例下降。' },
    '智齿': { value: 0, detail: '基本无智齿问题。' }
  }
}

    option = {
        title: {
			  text: '不同年龄段口腔疾病患病率统计',
			  textStyle: {
				color: '#fff',
				fontSize: 14
			  },
			  left: 'center'
			},
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },
            position: function (point, params, dom, rect, size) {
                // 获取提示框的宽度和高度
                const tooltipWidth = size.contentSize[0];
                const tooltipHeight = size.contentSize[1];
                // 获取视图的宽度和高度
                const viewWidth = size.viewSize[0];
                const viewHeight = size.viewSize[1];

                // 默认位置（鼠标位置）
                let x = point[0];
                let y = point[1];

                // 检查是否会超出左边界
                if (x < tooltipWidth) {
                    // 如果会超出左边界，显示在右侧
                    x = point[0] + 20;
                }

                // 检查是否会超出右边界
                if (x + tooltipWidth > viewWidth) {
                    // 如果会超出右边界，显示在左侧
                    x = point[0] - tooltipWidth - 20;
                }

                // 检查是否会超出底部
                if (y + tooltipHeight > viewHeight) {
                    // 如果会超出底部，向上偏移
                    y = point[1] - tooltipHeight - 20;
                }

                // 确保不会超出顶部
                if (y < 0) {
                    y = 20;
                }

                return [x, y];
            },
            formatter: function(param) {
                const age = param.name;
                const disease = param.seriesName;
                const detail = detailData[age][disease];
                
                return `
                    <div style="padding: 3px;">
                        <b>${age} - ${disease}</b><br/>
                        <div style="margin: 5px 0;">
                            <div style="margin-left: 10px;">
                                患病率：${detail.value}%<br/>
                                特点：${detail.detail}
                            </div>
                        </div>
                    </div>
                `;
            },
            backgroundColor: 'rgba(12,26,63,0.8)',
            borderColor: 'rgba(0, 194, 255, 0.2)',
            borderWidth: 1,
            padding: [10, 15],
            textStyle: {
	                            color: '#fff',
	                            fontSize: 12
	                        }
	                    },
		legend: {
		  data: ['龋齿', '牙周炎', '牙龈炎', '牙髓炎', '智齿'],
		  textStyle: { color: '#fff' },
		  top: 25
		},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '80px',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['<18岁', '18-40岁', '40-60岁', '60-80岁', '>80岁'],
            axisLabel: {
	                        color: '#fff'
	        },
	        axisLine: {
                lineStyle: {
                    color: '#153269'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '患病率 (%)',
            max: 80,
	        axisLabel: {
	                            color: '#fff',
                formatter: '{value}%'
            },
            axisLine: {
                lineStyle: {
                    color: '#153269'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#113865'
                }
            }
        },
        series: [
  {
    name: '龋齿',
    type: 'bar',
    data: [63, 89, 96, 98, 95],
    itemStyle: { color: '#00c2ff' }
  },
  {
    name: '牙周炎',
    type: 'bar',
    data: [42, 41, 52, 52, 50],
    itemStyle: { color: '#ffcf00' }
  },
  {
    name: '牙龈炎',
    type: 'bar',
    data: [60, 60, 50, 45, 40],
    itemStyle: { color: '#ff6e76' }
  },
  {
    name: '牙髓炎',
    type: 'bar',
    data: [50, 60, 45, 30, 15],
    itemStyle: { color: '#4cd384' }
  },
  {
    name: '智齿',
    type: 'bar',
    data: [0, 60, 10, 5, 0],
    itemStyle: { color: '#9d96f5' }
  }
]
	};

	myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

function zhexian() {
	var myChart = echarts.init(document.getElementById('zhexian'));
	option = {
		// 折线图配置
	};
	myChart.setOption(option);
	window.addEventListener("resize", function() {
		myChart.resize();
	});
}

// 添加新闻轮播函数
function newsScroll() {
    const newsData = [
        {
            title: "AI 深度学习模型在龋齿早期诊断中的应用研究",
            journal: "Nature Medicine",
            date: "2024-03-18",
            url: "https://www.nature.com/articles/s41591-024-02737-w",
            detail: "研究发现新的AI模型可提前识别早期龋齿的发展"
        },
        {
            title: "新型生物材料在牙髓再生中的突破性进展",
            journal: "Science",
            date: "2024-03-15",
            url: "https://www.science.org/doi/10.1126/science.adg9130",
            detail: "新型生物材料在牙髓再生中展现出良好效果"
        },
        {
            title: "基于干细胞技术的牙周组织再生研究新进展",
            journal: "Cell",
            date: "2024-03-14",
            url: "https://www.cell.com/cell/fulltext/S0092-8674(24)00133-4",
            detail: "干细胞治疗有望治愈牙周组织疾病"
        },
        {
            title: "新发现：口腔微生物组与牙周病发病机制的关联",
            journal: "Science Advances",
            date: "2024-03-12",
            url: "https://www.science.org/doi/10.1126/sciadv.adm9996",
            detail: "口腔微生物组在牙周病发病中的关键作用"
        },
        {
            title: "新型生物材料在牙齿修复中的临床试验结果",
            journal: "NEJM",
            date: "2024-03-07",
            url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2400374",
            detail: "新型修复材料显著改善治疗效果"
        },
        {
            title: "人工智能辅助口腔手术精准度研究",
            journal: "Journal of Dental Research",
            date: "2024-03-05",
            url: "https://journals.sagepub.com/doi/full/10.1177/00220345241234567",
            detail: "AI辅助系统提高手术精确度达30%"
        },
        {
            title: "饮食习惯与儿童龋齿发病率相关性研究",
            journal: "JADA",
            date: "2024-03-02",
            url: "https://jada.ada.org/article/S0002-8177(24)00123-4/fulltext",
            detail: "不良饮食习惯增加儿童龋齿风险"
        },
        {
            title: "基因治疗在牙周病治疗中的应用进展",
            journal: "Nature Genetics",
            date: "2024-02-28",
            url: "https://www.nature.com/articles/s41588-024-01589-x",
            detail: "新型基因编辑技术在牙周病治疗中取得突破"
        },
        {
            title: "口腔健康与全身疾病的关联研究",
            journal: "Lancet",
            date: "2024-02-25",
            url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)00048-X/fulltext",
            detail: "研究发现口腔健康与多种全身疾病密切相关"
        },
        {
            title: "新型牙齿修复材料临床试验结果",
            journal: "Nature Materials",
            date: "2024-02-22",
            url: "https://www.nature.com/articles/s41563-024-01972-3",
            detail: "生物相容性修复材料为患者带来新希望"
        },
        {
            title: "口腔微生物组与免疫系统相互作用研究",
            journal: "Immunity",
            date: "2024-02-20",
            url: "https://www.cell.com/immunity/fulltext/S1074-7613(24)00052-8",
            detail: "揭示口腔微生物组在免疫防御中的作用"
        }
    ];

    let currentNewsIndex = 0;
    const newsContainer = document.querySelector('.news-container');
    
    function updateNewsDisplay() {
        let html = '';
        // 显示当前可见的4条新闻
        for(let i = 0; i < 4; i++) {
            const index = (currentNewsIndex + i) % newsData.length;
            const news = newsData[index];
            html += `
                <div class="news-item" onclick="window.open('${news.url}', '_blank')">
                    <div class="news-title">${news.title}</div>
                    <div class="news-info">
                        <span class="news-journal">${news.journal}</span>
                        <span class="news-date">${news.date}</span>
                    </div>
                </div>
            `;
        }
        newsContainer.innerHTML = html;
    }

    // 自动轮播函数
    function autoScroll() {
        currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
        updateNewsDisplay();
    }

    // 初始显示
    updateNewsDisplay();
    
    // 设置定时器，每5秒滚动一次
    let scrollTimer = setInterval(autoScroll, 5000);

    // 鼠标悬停时暂停轮播
    newsContainer.addEventListener('mouseenter', () => {
        clearInterval(scrollTimer);
    });

    // 鼠标离开时恢复轮播
    newsContainer.addEventListener('mouseleave', () => {
        scrollTimer = setInterval(autoScroll, 5000);
	});
}

// 添加用户相关功能
function showMedicalRecords() {
    // 从 sessionStorage 获取病例数据
    const records = JSON.parse(sessionStorage.getItem('medicalRecords') || '[]');
    
    const modalHtml = `
        <div class="modal" id="recordsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">我的病例记录</h2>
                    <span class="close-btn" onclick="closeModal('recordsModal')">&times;</span>
                </div>
                <div class="records-list">
                    ${records.map(record => `
                        <div class="record-item">
                            <div class="record-header">
                                <span class="record-date">${record.date}</span>
                                <span class="record-type">${record.type}</span>
                            </div>
                            <div class="record-content">
                                <p>诊断结果：${record.diagnosis}</p>
                                <p>建议：${record.recommendation}</p>
                            </div>
                            <div class="record-footer">
                                <button onclick="downloadRecord('${record.id}')">
                                    <i class="fas fa-download"></i> 下载报告
                                </button>
                                <button onclick="deleteRecord('${record.id}')">
                                    <i class="fas fa-trash"></i> 删除记录
                                </button>
                            </div>
                        </div>
                    `).join('') || '<p class="no-records">暂无病例记录</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('recordsModal').style.display = 'block';
}

function showCheckHistory() {
    // 从 sessionStorage 获取检查记录
    const history = JSON.parse(sessionStorage.getItem('checkHistory') || '[]');
    
    const modalHtml = `
        <div class="modal" id="historyModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">检查记录</h2>
                    <span class="close-btn" onclick="closeModal('historyModal')">&times;</span>
                </div>
                <div class="history-list">
                    ${history.map(item => `
                        <div class="history-item">
                            <div class="history-info">
                                <span class="check-date">${item.date}</span>
                                <span class="check-type">${item.type}</span>
                            </div>
                            <div class="check-result">
                                <img src="${item.image}" alt="检查图片">
                                <div class="result-text">
                                    <p>检查结果：${item.result}</p>
                                    <p>AI置信度：${item.confidence}%</p>
                                </div>
                            </div>
                        </div>
                    `).join('') || '<p class="no-history">暂无检查记录</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('historyModal').style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.remove();
}

// 在登录成功后添加模拟数据
function addDemoData() {
    // 添加病例记录
    const medicalRecords = [
        {
            id: '1',
            date: '2024-03-20',
            type: '眼科检查',
            diagnosis: '轻度近视',
            recommendation: '建议适当调整用眼习惯，每天户外活动2小时'
        },
        {
            id: '2',
            date: '2024-03-15',
            type: 'AI辅助诊断',
            diagnosis: '疑似早期青光眼',
            recommendation: '建议到医院进行详细检查'
        }
    ];
    
    // 添加检查记录
    const checkHistory = [
        {
            date: '2024-03-20',
            type: '视力检查',
            image: 'path/to/image1.jpg',
            result: '左眼5.0，右眼5.1',
            confidence: 98
        },
        {
            date: '2024-03-15',
            type: '眼底检查',
            image: 'path/to/image2.jpg',
            result: '视网膜状态正常',
            confidence: 95
        }
    ];
    
    sessionStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
    sessionStorage.setItem('checkHistory', JSON.stringify(checkHistory));
}
