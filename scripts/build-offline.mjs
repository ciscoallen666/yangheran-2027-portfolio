import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { projects } from '../app/portfolio-data.ts';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const clientDirectory = path.join(projectDirectory, 'dist', 'client');
const exportDirectory = path.join(
  projectDirectory,
  'exports',
  'YangHeran-Portfolio-Offline',
);

if (!exportDirectory.startsWith(`${projectDirectory}${path.sep}`)) {
  throw new Error('Offline export path is outside the project directory.');
}

const response = await fetch('http://127.0.0.1:3000/');
if (!response.ok) {
  throw new Error(`Unable to read the production preview: ${response.status}`);
}

let html = await response.text();
const stylesheetPaths = Array.from(
  html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi),
  (match) => match[1],
).filter((href) => href.startsWith('/_next/static/css/'));
html = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?\s*>/gi, '')
  .replace(/(href|src|poster)="\/(?!\/)/g, '$1="./')
  .replace(
    '</body>',
    '<script src="./offline.js"></script></body>',
  );

await rm(exportDirectory, { recursive: true, force: true });
await mkdir(exportDirectory, { recursive: true });
await cp(
  path.join(clientDirectory, 'assets'),
  path.join(exportDirectory, 'assets'),
  { recursive: true },
);
for (const stylesheetPath of stylesheetPaths) {
  const relativePath = stylesheetPath.replace(/^\//, '');
  const destination = path.join(exportDirectory, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(path.join(clientDirectory, relativePath), destination);
}
const mediaDirectory = path.join(clientDirectory, '_next', 'static', 'media');
try {
  await access(mediaDirectory);
  await cp(
    mediaDirectory,
    path.join(exportDirectory, '_next', 'static', 'media'),
    { recursive: true },
  );
} catch {
  // This build does not use separately emitted font or media files.
}
await cp(
  path.join(clientDirectory, 'favicon.svg'),
  path.join(exportDirectory, 'favicon.svg'),
);
await cp(
  path.join(clientDirectory, 'YangHeran_Culture_AIGC_Portfolio.pdf'),
  path.join(exportDirectory, 'YangHeran_Culture_AIGC_Portfolio.pdf'),
);
await writeFile(path.join(exportDirectory, 'index.html'), html, 'utf8');

const browserProjects = projects.map((project) => ({
  id: project.id,
  title: project.title,
  year: project.year,
  category: project.category,
  cover: project.cover,
  summary: project.summary,
  tags: project.tags,
  role: project.role,
  media: project.media,
}));

const offlineScript = String.raw`(() => {
  const projects = ${JSON.stringify(browserProjects)};
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
      button.style.background = active
        ? 'rgba(238,231,215,.74)'
        : 'rgba(238,231,215,.42)';
      button.style.borderColor = active
        ? 'rgba(0,0,0,.18)'
        : 'rgba(255,255,255,.26)';
      button.style.boxShadow = active
        ? '0 18px 42px rgba(0,0,0,.10)'
        : 'none';
    });
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
      '<div class="overflow-hidden rounded-[20px] bg-[#111]">' + renderMedia(mediaItems) + '</div>' +
      (mediaItems.length > 1
        ? '<div class="mt-3 flex gap-2 overflow-x-auto pb-1">' + mediaItems.map((item, index) =>
            '<button class="min-h-8 shrink-0 border px-3 text-xs rounded-full ' +
            (index === activeMedia ? 'border-black bg-black text-white' : 'border-black/12 bg-[#efefea] text-black/48') +
            '" type="button" data-media-index="' + index + '" aria-label="查看' + escapeHtml(item.label) + '">' +
            escapeHtml(item.label) + '</button>'
          ).join('') + '</div>'
        : '') +
      '<div class="mt-6">' +
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
        activeMedia = Number(button.dataset.mediaIndex);
        renderProject();
      });
    });
    setProjectState();
  }

  projectButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      selectedProject = projects[index];
      activeMedia = 0;
      renderProject();
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.textContent.trim();
      projectButtons.forEach((projectButton, index) => {
        projectButton.hidden = !matchesFilter(projects[index], filter);
      });
      selectedProject = projects.find((project) => matchesFilter(project, filter)) || projects[0];
      activeMedia = 0;
      setFilterState(filter);
      renderProject();
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
`;

await writeFile(
  path.join(exportDirectory, 'offline.js'),
  offlineScript,
  'utf8',
);

const readme = `杨赫然 2027 秋招作品集（离线版）

使用方法：双击 index.html 即可在浏览器中打开。
此文件夹中的图片、视频、样式和脚本均为本地文件，不需要联网。
请保持 index.html、offline.js、assets 与 _next 文件夹的相对位置不变。
`;
await writeFile(
  path.join(exportDirectory, '使用说明.txt'),
  readme,
  'utf8',
);

console.log(exportDirectory);
