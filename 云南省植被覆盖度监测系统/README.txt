云南省植被覆盖度监测系统  

![GitHub last commit](https://github.com/Coronalake/GOGO)  
![Python](https://img.shields.io/badge/python-3.11.9-blue)  
![Flask](https://img.shields.io/badge/flask-3.1.1-green)  
![OpenLayers](https://img.shields.io/badge/OpenLayers-v10.2.-blue)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.13-blue)  

1. 项目简介
本系统面向云南省全域，基于 Flask后端与OpenLayers前端，实现植被覆盖度（FVC）的实时查询、年际对比、趋势分析与专题制图制作。  
后端通过局域网共享 PostgreSQL/PostGIS 空间数据库，支持多客户端并发访问，零配置即可在内网浏览器中使用。

2. 功能特性
①地图浏览 ：基于 OpenLayers 的切片底图、影像底图切换 
②覆盖度查询：点选/框选任意区域，实时返回 FVC 值 
③时序分析 ：选择时间范围，生成折线图与统计报告 
④专题制图 ：一键导出 PDF 植被覆盖专题图 
⑤权限管理：基于 Flask-Login 的简单账号体系 
⑥局域网共享：后端部署在本地服务器，内网终端即开即用 

3. 系统架构

┌────────────┐     ┌──────────────────┐     ┌──────────────┐
│ 浏览器     │────▶│   Flask (Python) │────▶│ PostgreSQL   │
│ (OpenLayers│◀────│   REST API       │◀────│ PostGIS      │
└────────────┘     └──────────────────┘     └──────────────┘

4. 快速开始

4.1 环境要求
| Python | 3.11+ |
| Node.js | 18+（仅开发阶段打包前端） |
| PostgreSQL | 15.13+ |

 4.2 后端部署
①克隆仓库
   bash
   git clone https://github.com/Coronalake/GOGO
   cd 云南植被覆盖度监测系统

②创建虚拟环境并安装依赖
   bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   

③初始化数据库  
   确保 PostgreSQL 已安装并运行，执行：
   bash
   createdb yunnan_fvc
   psql -d fvcdb -f sql/init.sql
   

④配置环境变量  
   复制 `.env.example` 为 `.env`，按需修改：
   dotenv
   FLASK_ENV=production
   DATABASE_URL=postgresql://user:password@localhost:5432/fvcdb
   SECRET_KEY=your-secret-key
   

⑤启动服务
   bash
   flask run --host=0.0.0.0 --port=5000
   
   内网其他终端通过 `http://<服务器IP>:5000` 访问。



5. 项目结构

云南省植被覆盖度监测系统/         # 项目根目录
├─ app.py                             # Flask 主入口
├─ requirements.txt                   # Python 依赖
├─ .gitignore                         # Git 忽略规则
├─ README.md                          # 项目说明（主）
├─ README.txt                         # 补充说明（可合并）
├─ sql/                               # 数据库脚本
│  └─ init.sql                        # 初始化 SQL
├─ venv/                              # Python 虚拟环境
├─ node_modules/                      # 前端依赖
├─ css/                               # 前端样式
│  └─ style.css                       # 主样式
├─ dataType/                          # 数据类型定义或枚举
├─ lib/                               # 公共库 / 工具函数
├─ model/                             # 机器学习模型文件
├─ pic/                               # 图片资源
│  ├─ trend_10yrss.png                # 趋势图
│  └─ ...                             # 其他示意图
├─ tif/                               # GeoTIFF 栅格数据
├─ json/                              # 静态 JSON（配置 / 字典）
├─ mainjs/                            # 前端 JS（OpenLayers）
│  └─ index.html                      # 单页应用入口
├─ package.json                       # 前端依赖(Vite/NPM)
├─ package-lock.json                  # 前端锁定版本
├─ fvc_data.csv                       # 原始植被覆盖度样本
├─ fvcclassstats.csv                  # 分类统计结果
├─ prediction.csv                     # 模型预测结果
└─ Vegchange.csv                      # 植被变化时序数据


6. 联系方式
 后端技术负责：李佳倩；刘申琦钰：liushenqiyv@bjfu.edu.cn，GitHub：LiuShenqiyu
 前端技术负责：闫嘉轩：3122315330@qq.com，GitHub:sharkseatchips；范馨遥：fanfanxy0515@qq.com，GitHub：nataliefanchen；鲁硕：2961396170@qq.com，GitHub：coronalake； 刘申琦钰：liushenqiyv@bjfu.edu.cn，GitHub：LiuShenqiyu

