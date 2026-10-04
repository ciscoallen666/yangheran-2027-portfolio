(() => {
  const projects = [{"id":"wadang-maze","title":"珠走迷宫：吉言汉瓦“永受嘉福”文创设计","year":"2026","category":"文旅文创","cover":"/assets/portfolio/wadang-prop-object.webp","summary":"以汉代吉语瓦当为原型，将“永受嘉福”的圆形形制、篆书笔意与回环纹样转译为可把玩的滚珠迷宫文创产品。","tags":["文创产品","互动结构","传统纹样转译","礼赠场景"],"role":"负责文化原型梳理、结构表达、视觉呈现与参赛材料整理。"},{"id":"tang-mirror","title":"唐瑞兽葡萄纹铜镜数字交互展示系统","year":"2026","category":"文旅文创","cover":"/assets/portfolio/copper-mirror-pattern-system.webp","summary":"围绕唐代铜镜的纹样、形制和材质层级构建数字展示系统，通过旋转、缩放、解构、复原与手势交互理解文物结构。","tags":["AIGC辅助","WebGL","手势识别","交互展示"],"role":"参与交互逻辑、视觉系统控制、算法效果调校与页面表达。"},{"id":"four-sheep","title":"青铜御风：四羊方尊摩托车贴花设计","year":"2025","category":"文旅文创","cover":"/assets/portfolio/four-sheep-application.webp","summary":"从四羊方尊中提取羊纹、卷云纹和夔龙纹等元素，转化为适配摩托车油箱与车身表面的版花方案。","tags":["AIGC视觉","版花系统","曲面适配","国潮视觉"],"role":"参与纹样拆解、AI 参考图筛选、贴花落位与版花系统表达。","media":[{"src":"/assets/portfolio/four-sheep-application.webp","label":"应用效果"},{"src":"/assets/portfolio/four-sheep-concept.webp","label":"设计概念"},{"src":"/assets/portfolio/four-sheep-system.webp","label":"版花系统"},{"src":"/assets/portfolio/four-sheep-tank-detail.webp","label":"油箱细节"}]},{"id":"mashao","title":"秦韵马勺脸谱：APP 交互与文创样机","year":"2024","category":"交互展示","cover":"/assets/portfolio/mashao-interaction.webp","summary":"以马勺脸谱非遗文化为内容核心，完成移动端信息架构、高保真页面、交互动效与文创周边延展。","tags":["非遗转译","APP设计","IP延展","文创样机"],"role":"完成界面结构、高保真页面、角色视觉与文创样机方向整理。","media":[{"src":"/assets/portfolio/mashao-interaction.webp","label":"APP 交互"},{"src":"/assets/portfolio/mashao-cultural.webp","label":"文创样机"}]},{"id":"paper-light","title":"三教学楼纸雕灯","year":"2024","category":"材料手工","cover":"/assets/portfolio/san-jiao-paper-light-01.webp","summary":"以校园建筑轮廓为对象，通过纸雕分层、镂空切割和灯光透射形成可陈列的手工灯具方案。","tags":["纸雕","镂空","光影","材料表达"],"role":"完成建筑轮廓提取、线稿清理、正负形控制与分层展示素材整理。","media":[{"src":"/assets/portfolio/san-jiao-paper-light-01.webp","label":"成品视图"},{"src":"/assets/portfolio/san-jiao-paper-light-02.webp","label":"纸雕稿 01"},{"src":"/assets/portfolio/san-jiao-paper-light-03.webp","label":"纸雕稿 02"},{"src":"/assets/portfolio/san-jiao-paper-light-04.webp","label":"细节 01"},{"src":"/assets/portfolio/san-jiao-paper-light-05.webp","label":"细节 02"},{"src":"/assets/portfolio/san-jiao-paper-light-06.webp","label":"实物记录"}]},{"id":"visual-motion","title":"定格动画与动态影像","year":"2025-2026","category":"动态视觉","cover":"/assets/portfolio/day-stop-motion.webp","summary":"收录《一天》《油泼面》《企鹅》定格动画与《法师的决斗》2D 动画，呈现从分镜、场景制作、逐帧拍摄到剪辑输出的动态创作过程。","tags":["定格动画","2D动画","PR/AE","多媒体视觉"],"role":"完成定格拍摄、分镜与场景整理，并参与动画制作、视频剪辑和最终输出。","media":[{"src":"/assets/portfolio/day-stop-motion.mp4","label":"《一天》成片","kind":"video","poster":"/assets/portfolio/day-stop-motion.webp","captions":"/assets/portfolio/day-stop-motion.zh.vtt"},{"src":"/assets/portfolio/day-stop-motion.webp","label":"《一天》画面"},{"src":"/assets/portfolio/oil-noodles-stop-motion.webp","label":"《油泼面》画面"},{"src":"/assets/portfolio/oil-noodles-storyboard.png","label":"《油泼面》分镜"},{"src":"/assets/portfolio/penguin-stop-motion.jpg","label":"《企鹅》画面"},{"src":"/assets/portfolio/penguin-making-of.jpg","label":"《企鹅》制作过程"},{"src":"/assets/portfolio/wizard-duel.mp4","label":"《法师的决斗》成片","kind":"video","captions":"/assets/portfolio/wizard-duel.zh.vtt"}]}];
  const aliases = {
    '文旅': ['文旅', '文创'],
    'AIGC': ['AIGC'],
    '交互': ['交互', 'APP'],
    '材料': ['材料', '纸雕', '手工'],
    '动态': ['动态', '定格动画', 'PR/AE', '2D动画']
  };
  const projectList = document.querySelector('.project-list');
  const article = document.querySelector('.surface-block');
  const filterBar = document.querySelector('[aria-label="作品筛选"]');
  const projectButtons = Array.from(projectList?.querySelectorAll('button') || []);
  const filterButtons = Array.from(filterBar?.querySelectorAll('button') || []);
  let selectedProject = projects[0];
  let activeMedia = 0;
  let selectionRequest = 0;
  let pendingProject = false;
  const motion = window.PortfolioMotion;
  const root = document.querySelector('main');
  if (root && motion) motion.initPortfolioMotion(root);

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
  const assetPath = (value) => value ? '.' + value : '';
  const matchesFilter = (project, filter) => {
    if (filter === '全部') return true;
    return (aliases[filter] || [filter]).some((alias) =>
      project.category.includes(alias) ||
      project.title.includes(alias) ||
      project.tags.some((tag) => tag.includes(alias))
    );
  };

  function setFilterState(activeFilter) {
    filterButtons.forEach((button) => {
      const active = button.textContent.trim() === activeFilter;
      button.setAttribute('aria-pressed', String(active));
      button.style.background = active
        ? (activeFilter === '全部' ? '#000' : '#4f654a')
        : 'rgba(255,255,255,.44)';
      button.style.color = active ? '#fff' : 'rgba(0,0,0,.58)';
      button.style.borderColor = active ? 'transparent' : 'rgba(0,0,0,.14)';
    });
  }

  function setProjectState() {
    projectButtons.forEach((button, index) => {
      const active = projects[index]?.id === selectedProject.id;
      button.setAttribute('aria-pressed', String(active));
    });
  }

  async function selectMedia(project, mediaIndex, projectSelection = false) {
    if (pendingProject && !projectSelection) return;
    const request = ++selectionRequest;
    const changingProject = projectSelection;
    if (changingProject) {
      pendingProject = true;
      article?.setAttribute('aria-busy', 'true');
      article?.querySelectorAll('[data-media-index]').forEach((button) => { button.disabled = true; });
    }
    const mediaItems = project.media?.length
      ? project.media
      : [{ src: project.cover, label: project.title }];
    const nextMedia = Math.min(mediaIndex, mediaItems.length - 1);
    const item = mediaItems[nextMedia];
    const image = item.kind === 'video' ? item.poster : item.src;
    if (motion && image) await motion.preparePortfolioMedia(assetPath(image));
    if (request !== selectionRequest) return;
    pendingProject = false;
    article?.setAttribute('aria-busy', 'false');
    selectedProject = project;
    activeMedia = nextMedia;
    renderProject();
  }

  function renderMedia(mediaItems) {
    const item = mediaItems[activeMedia] || mediaItems[0];
    if (item.kind === 'video') {
      return '<video class="h-[384px] w-full object-contain max-md:h-[280px]" controls playsinline preload="metadata"' +
        (item.poster ? ' poster="' + escapeHtml(assetPath(item.poster)) + '"' : '') +
        ' aria-label="' + escapeHtml(item.label) + '">' +
        '<source src="' + escapeHtml(assetPath(item.src)) + '" type="video/mp4">' +
        (item.captions ? '<track kind="captions" src="' + escapeHtml(assetPath(item.captions)) + '" srclang="zh-CN" label="中文">' : '') +
        '当前浏览器不支持视频播放。</video>';
    }
    return '<img class="h-[384px] w-full object-contain max-md:h-[280px]" src="' +
      escapeHtml(assetPath(item.src)) + '" alt="' + escapeHtml(item.label) + '">';
  }

  function renderProject() {
    if (!article || !selectedProject) return;
    const mediaItems = selectedProject.media?.length
      ? selectedProject.media
      : [{ src: selectedProject.cover, label: selectedProject.title }];
    activeMedia = Math.min(activeMedia, mediaItems.length - 1);
    article.innerHTML =
      '<div class="project-media-stage overflow-hidden rounded-[20px] bg-[#111]">' + renderMedia(mediaItems) + '</div>' +
      (mediaItems.length > 1
        ? '<div class="mt-3 flex gap-2 overflow-x-auto pb-1">' + mediaItems.map((item, index) =>
            '<button class="min-h-8 shrink-0 border px-3 text-xs rounded-full ' +
            (index === activeMedia ? 'border-black bg-black text-white' : 'border-black/12 bg-[#efefea] text-black/48') +
            '" type="button" data-media-index="' + index + '" aria-pressed="' + (index === activeMedia) + '" aria-label="查看' + escapeHtml(item.label) + '">' +
            escapeHtml(item.label) + '</button>'
          ).join('') + '</div>'
        : '') +
      '<div class="project-copy mt-6">' +
        '<p class="text-xs font-semibold text-[#5f6f5a]">' + escapeHtml(selectedProject.year) + ' / ' + escapeHtml(selectedProject.category) + '</p>' +
        '<div class="project-title-row">' +
          '<h3 class="text-3xl font-black leading-tight tracking-normal text-black/88 max-md:text-2xl">' + escapeHtml(selectedProject.title) + '</h3>' +
          '<div class="tag-row">' + selectedProject.tags.map((tag) => '<span class="project-tag">' + escapeHtml(tag) + '</span>').join('') + '</div>' +
        '</div>' +
        '<p class="mt-3 max-w-2xl text-base leading-7 text-black/56">' + escapeHtml(selectedProject.summary) + '</p>' +
        '<section><h4 class="text-sm font-black text-black/82">项目角色</h4>' +
          '<ul class="mt-2 grid gap-2"><li class="border-t border-black/8 pt-2 text-sm leading-7 text-black/50 first:border-t-0 first:pt-0">' +
          escapeHtml(selectedProject.role) + '</li></ul></section>' +
      '</div>';

    article.querySelectorAll('[data-media-index]').forEach((button) => {
      button.addEventListener('click', () => {
        void selectMedia(selectedProject, Number(button.dataset.mediaIndex));
      });
    });
    setProjectState();
    article.dispatchEvent(new Event('portfolio:media-change'));
  }

  projectButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      void selectMedia(projects[index], 0, true);
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.textContent.trim();
      projectButtons.forEach((projectButton, index) => {
        projectButton.hidden = !matchesFilter(projects[index], filter);
      });
      const nextProject = projects.find((project) => matchesFilter(project, filter)) || projects[0];
      setFilterState(filter);
      void selectMedia(nextProject, 0, true);
    });
  });

  const header = document.querySelector('.site-header');
  const updateHeader = () => {
    if (header) header.classList.toggle('site-header--visible', window.scrollY > Math.max(window.innerHeight * .72, 520));
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
  setFilterState('全部');
  setProjectState();
  updateHeader();
  window.scrollTo(0, 0);
})();
