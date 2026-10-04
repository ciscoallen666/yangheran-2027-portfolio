'use client';

/* oxlint-disable next/no-html-link-for-pages next/no-img-element */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  initPortfolioMotion,
  preparePortfolioMedia,
} from '../lib/portfolio-motion';

import { filters, profile, projects } from './portfolio-data';

const otherFilters = filters.filter((filter) => filter !== '全部');
const filterAliases: Record<string, string[]> = {
  文旅: ['文旅', '文创'],
  AIGC: ['AIGC'],
  交互: ['交互', 'APP'],
  材料: ['材料', '纸雕', '手工'],
  动态: ['动态', '定格动画', 'PR/AE'],
};

const otherGroups = [
  {
    title: 'AI 软件使用',
    align: 'left',
    items: [
      'ChatGPT',
      'Gemini',
      'Codex Skills',
      'AI 资料整理',
      'AI 方案发散',
      'AI 视频生成',
    ],
  },
  {
    title: '传统软件',
    align: 'right',
    items: ['PS', 'AI', 'PR', 'AE', '3DMAX', 'Office', '交互原型'],
  },
  {
    title: '证书',
    align: 'left',
    items: ['高中美术教师资格证', '普通话二乙', '全媒体运营', '心理咨询师'],
  },
  {
    title: '兴趣爱好',
    align: 'right',
    items: ['摄影', '骑行', '手工', '诗歌'],
  },
];

const capabilityData = [
  { label: '文化内容转译', value: 4.4 },
  { label: '视觉叙事', value: 4.1 },
  { label: 'AI 协同创作', value: 3.4 },
  { label: '交互原型', value: 3.2 },
  { label: '材料与结构', value: 3.8 },
  { label: '项目推进', value: 2.8 },
];

const workStyleData = [
  { left: '理性判断', right: '感性直觉', position: 54 },
  { left: '独立沉浸', right: '协作表达', position: 42 },
  { left: '探索发散', right: '收敛执行', position: 32 },
  { left: '稳定推进', right: '灵感冲刺', position: 68 },
  { left: '灵活调整', right: '坚持核心', position: 72 },
];

const personalityKeywords = ['敏感', '好奇', '独立', '共情', '执着'];

function matchesFilter(project: (typeof projects)[number], filter: string) {
  if (filter === '全部') return true;
  const aliases = filterAliases[filter] || [filter];
  return aliases.some(
    (alias) =>
      project.category.includes(alias) ||
      project.tags.some((tag) => tag.includes(alias)) ||
      project.title.includes(alias),
  );
}

export default function PortfolioClient() {
  const rootRef = useRef<HTMLElement>(null);
  const selectionRequest = useRef(0);
  const pendingProject = useRef(false);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [activeMedia, setActiveMedia] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const [isProjectLoading, setIsProjectLoading] = useState(false);

  useEffect(() => {
    if (rootRef.current) return initPortfolioMotion(rootRef.current);
  }, []);

  useEffect(() => {
    rootRef.current
      ?.querySelector('.surface-block')
      ?.dispatchEvent(new Event('portfolio:media-change'));
  }, [selectedId, activeMedia]);

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}`,
      );
    }

    const resetToFirstScreen = () => window.scrollTo(0, 0);
    resetToFirstScreen();
    const frame = window.requestAnimationFrame(resetToFirstScreen);
    window.addEventListener('load', resetToFirstScreen, { once: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('load', resetToFirstScreen);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    function updateHeader() {
      const threshold = Math.max(window.innerHeight * 0.72, 520);
      setShowHeader(window.scrollY > threshold);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('resize', updateHeader);
    };
  }, []);

  const visibleProjects = useMemo(() => {
    if (activeFilter === '全部') return projects;
    return projects.filter((project) => matchesFilter(project, activeFilter));
  }, [activeFilter]);

  const selectedProject =
    projects.find((project) => project.id === selectedId) ||
    visibleProjects[0] ||
    projects[0];
  const mediaItems = selectedProject.media || [
    { src: selectedProject.cover, label: selectedProject.title },
  ];
  const currentMedia = mediaItems[activeMedia] || mediaItems[0];

  async function selectProject(id: string) {
    const request = ++selectionRequest.current;
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    pendingProject.current = true;
    setIsProjectLoading(true);
    const media = project.media?.[0];
    const image =
      media?.kind === 'video' ? media.poster : media?.src || project.cover;
    if (image) await preparePortfolioMedia(image);
    if (request !== selectionRequest.current) return;
    pendingProject.current = false;
    setIsProjectLoading(false);
    setSelectedId(id);
    setActiveMedia(0);
  }

  function changeFilter(filter: string) {
    setActiveFilter(filter);
    const nextProject =
      filter === '全部'
        ? projects[0]
        : projects.find((project) => matchesFilter(project, filter));
    if (nextProject) {
      void selectProject(nextProject.id);
    }
  }

  async function selectMedia(index: number) {
    if (pendingProject.current) return;
    const request = ++selectionRequest.current;
    const media = mediaItems[index];
    const image = media.kind === 'video' ? media.poster : media.src;
    if (image) await preparePortfolioMedia(image);
    if (request === selectionRequest.current) setActiveMedia(index);
  }

  return (
    <main ref={rootRef} className="portfolio-shell min-h-screen text-[#141414]">
      <header
        className={`site-header fixed top-0 z-30 w-full ${showHeader ? 'site-header--visible' : ''}`}
      >
        <div className="mx-auto flex min-h-11 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
          <a
            className="flex items-center gap-3"
            href="#top"
            aria-label="返回顶部"
          >
            <span className="brand-mark grid size-8 place-items-center rounded-[10px] text-xs font-semibold">
              HR
            </span>
          </a>
          <nav className="flex items-center gap-1 overflow-x-auto text-sm text-black/56">
            <a className="px-3 py-2 hover:text-black" href="#works">
              作品
            </a>
            <a className="px-3 py-2 hover:text-black" href="#resume">
              简历
            </a>
            <a className="px-3 py-2 hover:text-black" href="#contact">
              联系
            </a>
          </nav>
        </div>
      </header>

      <section
        id="top"
        className="hero-cover relative min-h-svh overflow-hidden"
      >
        <div className="hero-glass-field" aria-hidden="true" />
        <div className="hero-light" aria-hidden="true" />
        <div className="dust-field" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="absolute inset-0 bg-[#ebece7]/8" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-svh w-[min(1180px,calc(100%-32px))] items-center justify-center py-16">
          <div className="hero-identity text-center">
            <div className="hero-name-lockup">
              <span className="hero-avatar avatar-mark">
                <img
                  className="h-full w-full object-cover"
                  src="/assets/portfolio/profile-cisco-color.png"
                  alt="杨赫然头像"
                />
              </span>
              <div className="hero-name-copy">
                <h1 className="hero-name">{profile.name}</h1>
                <p className="hero-english mt-3">
                  Creative Technologist / AI Experience Designer
                </p>
              </div>
            </div>
            <p className="hero-summary mt-2">
              擅长将复杂文化、历史、知识内容转化为数字体验
            </p>
            <p className="hero-tags mt-3">文旅 · AIGC视觉 · 交互</p>
          </div>
        </div>
      </section>

      <section id="works" className="content-section first-content py-16">
        <div className="section-inner mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex items-end justify-between gap-6 max-lg:block">
            <SectionLead title="重点项目" />
            <div
              className="mt-6 flex min-w-[520px] flex-wrap items-center gap-3 max-lg:min-w-0"
              aria-label="作品筛选"
            >
              <button
                className={`pressable h-9 border px-4 text-sm font-semibold ${
                  activeFilter === '全部'
                    ? 'rounded-full border-black bg-black text-white'
                    : 'rounded-full border-black/14 bg-white/54 text-black/58 hover:border-black/42'
                }`}
                type="button"
                aria-pressed={activeFilter === '全部'}
                onClick={() => changeFilter('全部')}
              >
                全部
              </button>
              <span className="h-8 w-px bg-black/24" aria-hidden="true" />
              {otherFilters.map((filter) => (
                <button
                  key={filter}
                  className={`pressable h-9 border px-3 text-sm ${
                    activeFilter === filter
                      ? 'rounded-full border-[#4f654a] bg-[#4f654a] text-white'
                      : 'rounded-full border-black/12 bg-white/44 text-black/52 hover:border-black/38 hover:text-black'
                  }`}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => changeFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 grid grid-cols-[0.68fr_1.32fr] items-start gap-5 max-lg:grid-cols-1">
            <div className="project-list grid gap-3">
              {visibleProjects.map((project) => (
                <button
                  key={project.id}
                  className="project-entry grid grid-cols-[104px_minmax(0,1fr)] gap-4 text-left"
                  type="button"
                  data-project-id={project.id}
                  aria-pressed={selectedProject.id === project.id}
                  aria-label={`查看项目：${project.title}`}
                  onClick={() => selectProject(project.id)}
                >
                  <img
                    className="h-[92px] w-full rounded-[10px] object-cover"
                    style={{
                      objectPosition: project.coverPosition || '50% 50%',
                    }}
                    src={project.cover}
                    alt=""
                  />
                  <span className="min-w-0">
                    <span className="text-xs font-semibold text-[#5f6f5a]">
                      {project.year} / {project.category}
                    </span>
                    <span className="mt-1 block text-lg font-black leading-tight text-black/86">
                      {project.title}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <article
              aria-busy={isProjectLoading}
              className="surface-block sticky top-24 self-start rounded-[28px] border border-white/32 bg-[#eee7d7]/56 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.10)] backdrop-blur-3xl max-lg:static"
            >
              <div className="project-media-stage overflow-hidden rounded-[20px] bg-[#111]">
                {currentMedia.kind === 'video' ? (
                  <video
                    key={currentMedia.src}
                    className="h-[384px] w-full object-contain max-md:h-[280px]"
                    controls
                    playsInline
                    preload="metadata"
                    poster={currentMedia.poster}
                    aria-label={currentMedia.label}
                  >
                    <source src={currentMedia.src} type="video/mp4" />
                    <track
                      kind="captions"
                      src={currentMedia.captions}
                      srcLang="zh-CN"
                      label="中文"
                    />
                    当前浏览器不支持视频播放。
                  </video>
                ) : (
                  <img
                    className="h-[384px] w-full object-contain max-md:h-[280px]"
                    src={currentMedia.src}
                    alt={currentMedia.label}
                  />
                )}
              </div>
              {mediaItems.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {mediaItems.map((item, index) => (
                    <button
                      key={item.label}
                      className={`min-h-8 shrink-0 border px-3 text-xs ${
                        activeMedia === index
                          ? 'rounded-full border-black bg-black text-white'
                          : 'rounded-full border-black/12 bg-[#efefea] text-black/48'
                      }`}
                      type="button"
                      disabled={isProjectLoading}
                      aria-pressed={activeMedia === index}
                      aria-label={`查看${item.label}`}
                      onClick={() => selectMedia(index)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="project-copy mt-6">
                <p className="text-xs font-semibold text-[#5f6f5a]">
                  {selectedProject.year} / {selectedProject.category}
                </p>
                <div className="project-title-row">
                  <h3 className="text-3xl font-black leading-tight tracking-normal text-black/88 max-md:text-2xl">
                    {selectedProject.title}
                  </h3>
                  <TagRow tags={selectedProject.tags} />
                </div>
                <p className="mt-3 max-w-2xl text-base leading-7 text-black/56">
                  {selectedProject.summary}
                </p>
                <DetailBlock title="项目角色" lines={[selectedProject.role]} />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="resume" className="content-section">
        <div className="section-inner mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="resume-screen">
            <div className="resume-header">
              <SectionLead title="简历" />
            </div>
            <div className="resume-timeline-slot">
              <TimelinePanel />
            </div>
          </div>
          <section className="other-section">
            <SectionLead title="个人介绍" />
            <div className="other-grid">
              <div className="profile-visuals">
                <CapabilityRadar />
                <WorkStyleProfile />
              </div>
              {otherGroups.map((group) => (
                <section
                  key={group.title}
                  className={`other-group other-group--${group.align}`}
                >
                  <h3>{group.title}</h3>
                  <div>
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-layout mx-auto w-[min(1180px,calc(100%-32px))]">
          <SectionLead title="联系" />
          <div className="contact-content">
            <div className="contact-info-list">
              <ContactLink
                label="邮箱"
                text={profile.email}
                href={`mailto:${profile.email}`}
              />
              <div className="contact-right-column">
                <ContactLink
                  label="电话"
                  text={profile.phone}
                  href={`tel:${profile.phone}`}
                />
                <div className="wechat-contact">
                  <span className="contact-link-label">微信</span>
                  <div className="social-qr-plate">
                    <img src="/assets/social/wechat.png" alt="微信二维码" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactLink({
  label,
  text,
  href,
}: {
  label: string;
  text: string;
  href: string;
}) {
  return (
    <a className="contact-link pressable" href={href}>
      <span className="contact-link-label">{label}</span>
      <span className="contact-link-text">{text}</span>
    </a>
  );
}

function SectionLead({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-lead max-w-2xl">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6f5a]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl font-black tracking-normal text-black/88 max-md:text-3xl">
        {title}
      </h2>
      {text && <p className="mt-3 text-base leading-7 text-black/52">{text}</p>}
    </div>
  );
}

function CapabilityRadar() {
  const center = 160;
  const chartCenterY = 156;
  const maxRadius = 88;
  const pointAt = (index: number, radius: number) => {
    const angle = (-90 + index * 60) * (Math.PI / 180);
    return `${center + Math.cos(angle) * radius},${chartCenterY + Math.sin(angle) * radius}`;
  };
  const rings = [1, 2, 3, 4, 5].map((level) =>
    capabilityData
      .map((_, index) => pointAt(index, (maxRadius * level) / 5))
      .join(' '),
  );
  const valuePoints = capabilityData
    .map((item, index) => pointAt(index, (maxRadius * item.value) / 5))
    .join(' ');
  const labels: Array<{
    x: number;
    y: number;
    anchor: 'start' | 'middle' | 'end';
  }> = [
    { x: 160, y: 26, anchor: 'middle' },
    { x: 316, y: 82, anchor: 'end' },
    { x: 316, y: 238, anchor: 'end' },
    { x: 160, y: 298, anchor: 'middle' },
    { x: 4, y: 238, anchor: 'start' },
    { x: 4, y: 82, anchor: 'start' },
  ];

  return (
    <section className="profile-visual profile-visual--radar">
      <div className="profile-visual-heading">
        <h3>能力倾向</h3>
      </div>
      <svg
        className="capability-radar"
        viewBox="0 0 320 320"
        aria-label="能力倾向"
      >
        {rings.map((points, index) => (
          <polygon
            key={points}
            className={`capability-radar-ring ${index === rings.length - 1 ? 'capability-radar-ring--outer' : ''}`}
            points={points}
          />
        ))}
        {capabilityData.map((item, index) => (
          <line
            key={item.label}
            className="capability-radar-axis"
            x1={center}
            y1={chartCenterY}
            x2={pointAt(index, maxRadius).split(',')[0]}
            y2={pointAt(index, maxRadius).split(',')[1]}
          />
        ))}
        <polygon className="capability-radar-area" points={valuePoints} />
        {capabilityData.map((item, index) => {
          const [x, y] = pointAt(index, (maxRadius * item.value) / 5).split(
            ',',
          );
          const label = labels[index];
          return (
            <g key={item.label}>
              <circle className="capability-radar-dot" cx={x} cy={y} r="3.6" />
              <text
                className="capability-radar-label"
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
              >
                {item.label}
                <tspan className="capability-radar-value" dx="5">
                  {item.value.toFixed(1)}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function WorkStyleProfile() {
  return (
    <section className="profile-visual profile-visual--style">
      <div className="profile-visual-heading">
        <h3>工作方式倾向</h3>
      </div>
      <div className="work-style-list">
        {workStyleData.map((item) => (
          <div className="work-style-row" key={`${item.left}-${item.right}`}>
            <div className="work-style-labels">
              <span>{item.left}</span>
              <span>{item.right}</span>
            </div>
            <div className="work-style-track" aria-hidden="true">
              <span style={{ left: `${item.position}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="personality-keywords" aria-label="性格关键词">
        {personalityKeywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
    </section>
  );
}

function TimelinePanel() {
  return (
    <section className="timeline-panel timeline-panel--final">
      <div className="timeline-layout">
        <div className="timeline-key" aria-label="时间轴图例">
          <span>
            <i className="timeline-key-sample timeline-key-sample--year" />
            年份
          </span>
          <span>
            <i className="timeline-key-sample timeline-key-sample--award" />
            获奖
          </span>
          <span>
            <i className="timeline-key-sample timeline-key-sample--edu" />
            教育
          </span>
          <span>
            <i className="timeline-key-sample timeline-key-sample--exp" />
            实习
          </span>
        </div>

        {/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Keyboard users need focus to scroll this region. */}
        <section
          className="timeline-canvas"
          tabIndex={0}
          aria-label="简历时间轴，可上下滚动"
        >
          <div className="timeline-final-stage">
            <svg
              className="timeline-final-svg"
              viewBox="0 0 1000 1240"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="timeline-arrow"
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path
                    className="timeline-arrow-head"
                    d="M0,0 L7,3.5 L0,7 Z"
                  />
                </marker>
              </defs>
              <path
                className="timeline-axis"
                d="M120 1120 H880
                   Q940 1120 940 1050
                   Q940 980 880 980
                   H120
                   Q60 980 60 910
                   Q60 840 120 840
                   H880
                   Q940 840 940 770
                   Q940 700 880 700
                   H120
                   Q60 700 60 630
                   Q60 560 120 560
                   H880
                   Q940 560 940 490
                   Q940 420 880 420
                   H120
                   Q60 420 60 350
                   Q60 280 120 280
                   H880
                   Q940 280 940 210
                   Q940 140 880 140
                   H135
                   Q60 140 60 84
                   Q60 40 160 40
                   H340"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M150 1120 H274"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M850 980 H726"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M150 840 H274"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M850 700 H726"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M150 560 H274"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M850 420 H726"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M150 280 H274"
              />
              <path
                className="timeline-direction"
                markerEnd="url(#timeline-arrow)"
                d="M850 140 H726"
              />
              <path
                className="timeline-edu-line"
                d="M690 1130 H880
                   Q930 1130 930 1060
                   Q930 990 880 990
                   H120
                   Q70 990 70 920
                   Q70 850 120 850
                   H880
                   Q930 850 930 780
                   Q930 710 880 710
                   H120
                   Q70 710 70 640
                   Q70 570 120 570
                   H565"
              />
              <path
                className="timeline-edu-line"
                d="M310 430
                   H120
                   Q70 430 70 360
                   Q70 290 120 290
                   H880
                   Q930 290 930 220
                   Q930 150 880 150
                   H135
                   Q70 150 70 94
                   Q70 50 160 50
                   H400"
              />
              <path
                className="timeline-exp-line"
                d="M565 1110 H880
                   Q950 1110 950 1040
                   Q950 970 880 970
                   H120
                   Q50 970 50 900
                   Q50 830 120 830
                   H550"
              />
              <path className="timeline-exp-line" d="M620 830 H800" />
              <path
                className="timeline-exp-line"
                d="M690 690 H120
                   Q50 690 50 620
                   Q50 550 120 550
                   H690"
              />
              <path
                className="timeline-exp-line"
                d="M650 410 H120
                   Q50 410 50 340
                   Q50 270 120 270
                   H880
                   Q950 270 950 200
                   Q950 130 880 130
                   H600"
              />
              <path className="timeline-exp-line" d="M296 260 H471" />
              <path className="timeline-exp-line" d="M412 235 H646" />
              <path className="timeline-exp-line" d="M760 120 H620" />
            </svg>

            <span className="timeline-node timeline-node--year timeline-node--2019">
              2019
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-2019" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-2019">
              <b>7月</b>西安太乙画室
            </span>
            <span className="timeline-range-end timeline-range-end--edu timeline-edu-start-2019" />
            <span className="timeline-range-label timeline-range-label--edu timeline-edu-label-2019">
              <b>9月</b>西安邮电大学｜本科
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2020">
              2020
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2021">
              2021
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-taiyi" />
            <span className="timeline-month timeline-month--exp timeline-exp-month-taiyi">
              6月
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-derun" />
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-derun" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-derun">
              <b>8月</b>德润广告
            </span>
            <span className="timeline-month timeline-month--exp timeline-exp-month-derun">
              11月
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2022">
              2022
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-neworiental" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-neworiental">
              <b>3月</b>新东方
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2023">
              2023
            </span>
            <span className="timeline-range-end timeline-range-end--edu timeline-edu-end-2023" />
            <span className="timeline-range-label timeline-range-label--edu timeline-edu-label-end-2023">
              <b>7月</b>本科毕业
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-neworiental" />
            <span className="timeline-month timeline-month--exp timeline-exp-month-neworiental">
              8月
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2024">
              2024
            </span>
            <span className="timeline-range-end timeline-range-end--edu timeline-edu-start-2024" />
            <span className="timeline-range-label timeline-range-label--edu timeline-edu-label-2024">
              <b>9月</b>西安外国语大学｜硕士在读
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2024-strait" />
            <span className="timeline-card timeline-card--award timeline-card--award-2024-strait">
              两岸铜奖《青铜驭风》
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2024-double" />
            <span className="timeline-card timeline-card--award timeline-card--award-2024-double">
              双百工程三等奖
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-guangxi" />
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-guangxi" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-guangxi">
              <b>4月</b>光隙物语
            </span>
            <span className="timeline-month timeline-month--exp timeline-exp-month-guangxi">
              6月
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2025">
              2025
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-lailiangyan" />
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-lailiangyan" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-lailiangyan">
              <b>3月</b>良言喜物
            </span>
            <span className="timeline-month timeline-month--exp timeline-exp-month-lailiangyan">
              6月
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2025-lacquer" />
            <span className="timeline-card timeline-card--award timeline-card--award-2025-lacquer">
              陕西漆艺三等奖
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2025-poster" />
            <span className="timeline-card timeline-card--award timeline-card--award-2025-poster">
              蓝桥杯海报省三
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-haina" />
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-haina" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-haina">
              <b>5月</b>海纳艺创
            </span>
            <span className="timeline-month timeline-month--exp timeline-exp-month-haina">
              9月
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2026">
              2026
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2026-ui" />
            <span className="timeline-card timeline-card--award timeline-card--award-2026-ui">
              蓝桥杯 UI 省三
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2026-cultural" />
            <span className="timeline-card timeline-card--award timeline-card--award-2026-cultural">
              蓝桥杯文创省一
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2026-milan" />
            <span className="timeline-card timeline-card--award timeline-card--award-2026-milan">
              米兰设计周二等奖
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-qingmang" />
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-qingmang" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-qingmang">
              <b>3月</b>青芒时代
            </span>
            <span className="timeline-month timeline-month--exp timeline-exp-month-qingmang">
              7月
            </span>
            <span className="timeline-range-end timeline-range-end--edu timeline-edu-end-2027" />
            <span className="timeline-month timeline-month--edu timeline-edu-month-2027">
              9月
            </span>
          </div>
        </section>
        {/* oxlint-enable jsx-a11y/no-noninteractive-tabindex */}
      </div>
    </section>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="tag-row">
      {tags.map((tag) => (
        <span key={tag} className="project-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

function DetailBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section>
      <h4 className="text-sm font-black text-black/82">{title}</h4>
      <ul className="mt-2 grid gap-2">
        {lines.map((line) => (
          <li
            key={line}
            className="border-t border-black/8 pt-2 text-sm leading-7 text-black/50 first:border-t-0 first:pt-0"
          >
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
