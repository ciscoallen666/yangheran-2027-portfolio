export type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  cover: string;
  coverPosition?: string;
  summary: string;
  tags: string[];
  role: string;
  evidence: string[];
  outputs: string[];
  relevance: string;
  media?: { src: string; label: string }[];
};

export const profile = {
  name: '杨赫然',
  title: '文化内容 / 文旅文创 / AIGC 视觉',
  subtitle: '文旅文创 / 交互展示 / AI 辅助视觉表达',
  summary:
    '设计硕士在读，本科数字媒体艺术。作品围绕传统文化转译、文创产品、数字交互展示、视觉物料与手工模型展开。',
  email: 'yangheran20000@163.com',
  phone: '18092115338',
  location: '北上广深，西安均可',
  graduation: '2027.07 硕士预计毕业',
  target: '文旅 / 文创 / AIGC视觉 / 交互体验',
};

export const filters = ['全部', '文旅', 'AIGC', '交互', '材料', '动态'];

export const fitCards = [
  {
    title: '文旅文创',
    keywords: '文化转译 / 产品表达',
    proof: '瓦当迷宫、四羊方尊贴花、马勺脸谱、农产品包装。',
  },
  {
    title: 'AIGC 视觉',
    keywords: '概念发散 / 视觉重构',
    proof: '铜镜交互、视觉方案整理与文化元素重构。',
  },
  {
    title: '交互体验',
    keywords: '数字展示 / 信息分层',
    proof: '铜镜数字展示系统、非遗 APP、校园 H5。',
  },
  {
    title: '视觉内容',
    keywords: '平面物料 / 动态输出',
    proof: '定格动画、展陈视觉与后期素材。',
  },
];

export const workflow = [
  {
    step: '资料整理',
    text: '用 AI 辅助拆分文化关键词、用户场景和叙事方向，再回到文献、图像与项目要求中做人工筛选。',
  },
  {
    step: '视觉推演',
    text: '生成参考图、氛围方向和构图候选，重点判断形制、纹样比例、色彩气质是否符合文化对象。',
  },
  {
    step: '人工重构',
    text: '用 PS、AI、三维/交互工具进行二次设计、落位校正、图文整合和输出规范控制。',
  },
  {
    step: '质量检查',
    text: '检查文本可读性、风格一致性、素材来源、模型/字体/图片授权记录，不把 AI 初稿当最终作品。',
  },
];

export const projects: Project[] = [
  {
    id: 'wadang-maze',
    title: '珠走迷宫：吉言汉瓦“永受嘉福”文创设计',
    year: '2026',
    category: '文旅文创',
    cover: '/assets/portfolio/wadang-prop-object.webp',
    coverPosition: '50% 38%',
    summary:
      '以汉代吉语瓦当为原型，将“永受嘉福”的圆形形制、篆书笔意与回环纹样转译为可把玩的滚珠迷宫文创产品。',
    tags: ['文创产品', '互动结构', '传统纹样转译', '礼赠场景'],
    role: '负责文化原型梳理、结构表达、视觉呈现与参赛材料整理。',
    evidence: [
      '从瓦当纹样中提取圆形结构、文字路径和祈福寓意，转化为可参与的互动机制。',
      '结构表达包含透明保护层、迷宫路径层、纹样表现层、木质底座和铜珠组件。',
      '项目获得第十七届蓝桥杯视觉艺术设计赛文创设计非命题陕西赛区一等奖。',
    ],
    outputs: [
      '产品效果图',
      '结构层级说明',
      '动态展示素材',
      '参赛说明与奖项证书',
    ],
    relevance:
      '对应文创产品岗位中的文化内容转译、产品形态设定、互动体验设计和可落地材料表达。',
  },
  {
    id: 'tang-mirror',
    title: '唐瑞兽葡萄纹铜镜数字交互展示系统',
    year: '2026',
    category: '文旅文创',
    cover: '/assets/portfolio/copper-mirror-pattern-system.webp',
    summary:
      '围绕唐代铜镜的纹样、形制和材质层级构建数字展示系统，通过旋转、缩放、解构、复原与手势交互理解文物结构。',
    tags: ['AIGC辅助', 'WebGL', '手势识别', '交互展示'],
    role: '参与交互逻辑、视觉系统控制、算法效果调校与页面表达。',
    evidence: [
      '使用 Google Gemini AI 进行方向验证与方案推演，并对输出进行筛选、重构和再设计。',
      '交互逻辑围绕“探照、拆解、观察、复原”展开，强化文物信息的分层理解。',
      '项目获得第十七届蓝桥杯视觉艺术设计赛交互设计 UI 非命题陕西赛区三等奖。',
    ],
    outputs: ['交互演示页面', '系统架构图', '宣传图', '作品说明'],
    relevance:
      '适合投文旅交互、AIGC 视觉、交互展示类岗位，重点证明 AI 辅助流程和文化内容表达能力。',
  },
  {
    id: 'four-sheep',
    title: '青铜御风：四羊方尊摩托车贴花设计',
    year: '2025',
    category: '文旅文创',
    cover: '/assets/portfolio/four-sheep-application.webp',
    coverPosition: '50% 18%',
    summary:
      '从四羊方尊中提取羊纹、卷云纹和夔龙纹等元素，转化为适配摩托车油箱与车身表面的版花方案。',
    tags: ['AIGC视觉', '版花系统', '曲面适配', '国潮视觉'],
    role: '参与纹样拆解、AI 参考图筛选、贴花落位与版花系统表达。',
    evidence: [
      '项目资料中保留了 AI 版花系统效果、油箱细节效果和严格落位参考等过程文件。',
      '从器物纹样到现代载体，重点处理曲面位置、纹样尺度、古铜质感和整体视觉统一。',
      '作品《青铜御风：方尊巡狩录》获 2024 年两岸数字艺术设计三等奖。',
    ],
    outputs: ['主海报', '纹样拆解', '部件落位图', '应用效果图'],
    relevance:
      '适配 AIGC 视觉、文创 IP 衍生、品牌视觉和交通/潮流载体图案设计岗位。',
    media: [
      {
        src: '/assets/portfolio/four-sheep-application.webp',
        label: '应用效果',
      },
      { src: '/assets/portfolio/four-sheep-concept.webp', label: '设计概念' },
      { src: '/assets/portfolio/four-sheep-system.webp', label: '版花系统' },
      {
        src: '/assets/portfolio/four-sheep-tank-detail.webp',
        label: '油箱细节',
      },
    ],
  },
  {
    id: 'mashao',
    title: '秦韵马勺脸谱：APP 交互与文创样机',
    year: '2024',
    category: '交互展示',
    cover: '/assets/portfolio/mashao-interaction.webp',
    summary:
      '以马勺脸谱非遗文化为内容核心，完成移动端信息架构、高保真页面、交互动效与文创周边延展。',
    tags: ['非遗转译', 'APP设计', 'IP延展', '文创样机'],
    role: '完成界面结构、高保真页面、角色视觉与文创样机方向整理。',
    evidence: [
      'APP 包含登录、浏览、搜索、内容展示、购买和个人中心等核心页面。',
      '文创样机覆盖包装袋、帆布袋、口罩、本子等载体，验证 IP 图形的延展能力。',
      '项目与本科数字媒体艺术背景、用户体验设计课程和交互原型能力相匹配。',
    ],
    outputs: [
      '移动端高保真页面',
      '交互动效',
      '文创样机',
      '毕业设计论文/展示材料',
    ],
    relevance: '对应交互设计、文旅体验、文创 IP 运营视觉和新媒体内容展示岗位。',
    media: [
      { src: '/assets/portfolio/mashao-interaction.webp', label: 'APP 交互' },
      { src: '/assets/portfolio/mashao-cultural.webp', label: '文创样机' },
    ],
  },
  {
    id: 'paper-light',
    title: '三教学楼纸雕灯',
    year: '2024',
    category: '材料手工',
    cover: '/assets/portfolio/san-jiao-paper-light-01.webp',
    coverPosition: '50% 78%',
    summary:
      '以校园建筑轮廓为对象，通过纸雕分层、镂空切割和灯光透射形成可陈列的手工灯具方案。',
    tags: ['纸雕', '镂空', '光影', '材料表达'],
    role: '完成建筑轮廓提取、线稿清理、正负形控制与分层展示素材整理。',
    evidence: [
      '作品保留成品视图、纸雕稿、细节图和实物记录，适合展示手工执行与边缘控制。',
      '纸材、透光和分层关系能补充文创产品与展陈视觉中的材料表达能力。',
      '可作为舞美/展陈方向参考，但在本版本中主要用于证明材料与手工基础。',
    ],
    outputs: ['纸雕灯效果', '切割稿', '局部细节', '实物记录'],
    relevance: '支撑文创产品打样、展陈视觉、材料装置和手工模型相关岗位表达。',
    media: [
      {
        src: '/assets/portfolio/san-jiao-paper-light-01.webp',
        label: '成品视图',
      },
      {
        src: '/assets/portfolio/san-jiao-paper-light-02.webp',
        label: '纸雕稿 01',
      },
      {
        src: '/assets/portfolio/san-jiao-paper-light-03.webp',
        label: '纸雕稿 02',
      },
      {
        src: '/assets/portfolio/san-jiao-paper-light-04.webp',
        label: '细节 01',
      },
      {
        src: '/assets/portfolio/san-jiao-paper-light-05.webp',
        label: '细节 02',
      },
      {
        src: '/assets/portfolio/san-jiao-paper-light-06.webp',
        label: '实物记录',
      },
    ],
  },
  {
    id: 'visual-motion',
    title: '定格动画与动态内容补充',
    year: '2025-2026',
    category: '动态视觉',
    cover: '/assets/portfolio/day-stop-motion.webp',
    summary:
      '以定格动画和短片素材补充镜头节奏、逐帧执行、PR/AE 后期和多媒体输出能力。',
    tags: ['定格动画', 'PR/AE', '多媒体视觉'],
    role: '完成或参与视频剪辑、分镜/帧画面整理与视觉输出。',
    evidence: [
      '定格动画素材能够证明逐帧执行、镜头节奏、场景组织和后期剪辑能力。',
      '影视后期助理经历补充了现场拍摄、素材整理和项目流程理解。',
    ],
    outputs: ['定格动画封面', '分镜/内容帧', '视频剪辑素材'],
    relevance:
      '适合 AIGC 视觉、运营视觉、广告素材和多媒体创意方向作为辅助项目。',
    media: [
      {
        src: '/assets/portfolio/day-stop-motion.webp',
        label: '定格动画《一天》',
      },
      {
        src: '/assets/portfolio/oil-noodles-stop-motion.webp',
        label: '定格动画《油泼面》',
      },
    ],
  },
];

export const resume = {
  education: [
    {
      time: '2024.09 - 2027.07',
      title: '西安外国语大学｜设计｜硕士在读',
      text: '研究生阶段持续进行设计研究、文化转译、视觉叙事和作品系统化表达。',
    },
    {
      time: '2019.09 - 2023.07',
      title: '西安邮电大学｜数字媒体艺术｜本科',
      text: '课程覆盖构成基础、数字摄影摄像、三维设计基础、高级三维动画制作、用户体验设计、交互原型设计、声音设计、数字特效合成。',
    },
  ],
  experience: [
    {
      time: '2022.03 - 2022.08',
      title: '新东方教育有限公司｜网宣中级 / 运营助教 / 带班助教',
      text: '参与少儿美术课程助教、课件整理、海报制作、活动执行、摄影与后期修图；曾获大区四月优秀助教。',
    },
    {
      time: '2021.07 - 2021.08',
      title: '德润文化广告有限公司｜影视后期助理',
      text: '了解广告制作流程，参与策划、分镜、场景、模特选择、拍摄计划与后期素材整理。',
    },
    {
      time: '2019.07 - 2020.03',
      title: '西安太乙画室｜素描 / 速写老师',
      text: '负责约 25 人班级的素描、速写教学、示范、课后辅导和课堂管理。',
    },
  ],
  skills: [
    'PS',
    'AI',
    'PR',
    'AE',
    '3DMAX',
    'Office',
    '手绘',
    '交互原型',
    '摄影摄像',
    'ChatGPT',
    'Gemini',
    'Codex Skills',
    'AI 资料整理',
    'AI 方案发散',
    'AI 视觉参考筛选',
    'AI 视频生成',
    '生成视频分镜',
  ],
  awards: [
    '2026｜《吉言汉瓦“永受嘉福”文创设计》｜第十七届蓝桥杯视觉艺术设计赛文创设计非命题陕西赛区一等奖',
    '2026｜《唐瑞兽葡萄纹铜镜数字交互展示系统》｜第十七届蓝桥杯视觉艺术设计赛交互设计 UI 非命题陕西赛区三等奖',
    '2026｜《朔·离散》｜米兰设计周中国高校设计学科师生优秀作品展二等奖',
    '2025｜《青铜御风：方尊巡狩录》｜两岸数字艺术设计三等奖',
    '2024｜佳县红润枣业产品包装设计｜陕西高校“双百工程”乡村特色产品创意设计大赛三等奖',
    '普通话二乙｜高中美术教师资格证｜全媒体运营｜心理咨询师',
  ],
};
