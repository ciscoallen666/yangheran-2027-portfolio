'use client';

/* oxlint-disable next/no-html-link-for-pages next/no-img-element */

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone } from 'lucide-react';

import { filters, profile, projects } from './portfolio-data';

const otherFilters = filters.filter((filter) => filter !== '全部');
const filterAliases: Record<string, string[]> = {
  文旅: ['文旅', '文创'],
  AIGC: ['AIGC'],
  交互: ['交互', 'APP'],
  材料: ['材料', '纸雕', '手工'],
  动态: ['动态', '定格动画', 'PR/AE'],
};

const socialLinks = [
  {
    name: '微信',
    image: '/assets/social/wechat.png',
  },
  {
    name: '小红书',
    image: '/assets/social/xiaohongshu.png',
  },
  {
    name: '抖音',
    image: '/assets/social/douyin.png',
  },
];

type TimelineKind = 'education' | 'experience' | 'award' | 'project';

const timelineItems: {
  kind: TimelineKind;
  label: string;
  year: string;
  time: string;
  title: string;
  text: string;
  side: 'left' | 'right';
  x: number;
  y: number;
}[] = [
  {
    kind: 'education',
    label: '教育',
    year: '2027',
    time: '2027.07',
    title: '硕士预计毕业',
    text: '进入 2027 届全职秋招，方向聚焦文旅、文创、AIGC 视觉与交互体验。',
    side: 'right',
    x: 67,
    y: 6,
  },
  {
    kind: 'award',
    label: '获奖',
    year: '2026',
    time: '2026',
    title: '蓝桥杯 / 米兰设计周获奖',
    text: '文创设计一等奖、交互设计三等奖，《朔·离散》二等奖。',
    side: 'left',
    x: 37,
    y: 15,
  },
  {
    kind: 'project',
    label: '作品',
    year: '2026',
    time: '2026',
    title: '吉言汉瓦“永受嘉福”文创设计',
    text: '以瓦当形制转译为滚珠迷宫文创产品。',
    side: 'right',
    x: 61,
    y: 23,
  },
  {
    kind: 'project',
    label: '作品',
    year: '2026',
    time: '2026',
    title: '唐瑞兽葡萄纹铜镜数字交互展示系统',
    text: '完成文化内容、视觉层级与交互展示表达。',
    side: 'right',
    x: 70,
    y: 33,
  },
  {
    kind: 'project',
    label: '作品',
    year: '2025',
    time: '2025',
    title: '青铜御风：四羊方尊摩托车贴花设计',
    text: '传统器物纹样转译为现代载体版花系统。',
    side: 'left',
    x: 49,
    y: 43,
  },
  {
    kind: 'award',
    label: '获奖',
    year: '2025',
    time: '2025',
    title: '两岸数字艺术设计三等奖',
    text: '《青铜御风：方尊巡狩录》获得赛事奖项。',
    side: 'left',
    x: 26,
    y: 52,
  },
  {
    kind: 'education',
    label: '教育',
    year: '2024',
    time: '2024.09 - 2027.07',
    title: '西安外国语大学｜设计｜硕士在读',
    text: '持续进行设计研究、文化转译、视觉叙事与作品系统化表达。',
    side: 'right',
    x: 41,
    y: 61,
  },
  {
    kind: 'project',
    label: '作品',
    year: '2024',
    time: '2024',
    title: '秦韵马勺脸谱：APP 交互与文创样机',
    text: '非遗内容的 APP 交互、角色视觉与文创样机延展。',
    side: 'right',
    x: 64,
    y: 70,
  },
  {
    kind: 'project',
    label: '作品',
    year: '2024',
    time: '2024',
    title: '三教学楼纸雕灯',
    text: '以校园建筑轮廓完成纸雕分层、镂空和光影表达。',
    side: 'left',
    x: 78,
    y: 79,
  },
  {
    kind: 'award',
    label: '获奖',
    year: '2024',
    time: '2024',
    title: '佳县红润枣业产品包装设计',
    text: '陕西高校“双百工程”乡村特色产品创意设计大赛三等奖。',
    side: 'left',
    x: 55,
    y: 88,
  },
  {
    kind: 'experience',
    label: '经历',
    year: '2022',
    time: '2022.03 - 2022.08',
    title: '新东方教育有限公司｜网宣中级 / 运营助教',
    text: '参与课程助教、海报制作、活动执行、摄影与后期修图。',
    side: 'right',
    x: 31,
    y: 97,
  },
  {
    kind: 'experience',
    label: '经历',
    year: '2021',
    time: '2021.07 - 2021.08',
    title: '德润文化广告有限公司｜影视后期助理',
    text: '参与策划、分镜、拍摄计划与后期素材整理。',
    side: 'right',
    x: 18,
    y: 106,
  },
  {
    kind: 'education',
    label: '教育',
    year: '2019',
    time: '2019.09 - 2023.07',
    title: '西安邮电大学｜数字媒体艺术｜本科',
    text: '建立影像、交互、三维与平面视觉基础。',
    side: 'left',
    x: 38,
    y: 115,
  },
  {
    kind: 'experience',
    label: '经历',
    year: '2019',
    time: '2019.07 - 2020.03',
    title: '西安太乙画室｜素描 / 速写老师',
    text: '完成基础造型课程教学与课堂管理。',
    side: 'left',
    x: 61,
    y: 124,
  },
];

const timelineYears = [
  { year: '至今', x: 67, y: 3 },
  { year: '2026', x: 61, y: 21 },
  { year: '2025', x: 29, y: 50 },
  { year: '2024', x: 43, y: 63 },
  { year: '2022', x: 31, y: 95 },
  { year: '2021', x: 18, y: 104 },
  { year: '2019', x: 47, y: 116 },
];

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
    items: ['摄影', '展览观察', '手工模型', '影像剪辑'],
  },
];

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
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [activeMedia, setActiveMedia] = useState(0);
  const [showHeader, setShowHeader] = useState(false);

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

  function selectProject(id: string) {
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
      setSelectedId(nextProject.id);
      setActiveMedia(0);
    }
  }

  return (
    <main className="portfolio-shell min-h-screen text-[#141414]">
      <header
        className={`site-header fixed top-0 z-30 w-full ${showHeader ? 'site-header--visible' : ''}`}
      >
        <div className="mx-auto flex min-h-16 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
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
                <p className="hero-english mt-4">Yang Heran · Cisco Allen</p>
              </div>
            </div>
            <p className="hero-tags mt-4">文旅 · AIGC视觉 · 交互</p>
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
                  className={`pressable grid grid-cols-[104px_minmax(0,1fr)] gap-4 border p-3 text-left max-sm:grid-cols-1 ${
                    selectedProject.id === project.id
                      ? 'rounded-[22px] border-black/18 bg-[#eee7d7]/74 shadow-[0_18px_42px_rgba(0,0,0,0.10)] backdrop-blur-3xl'
                      : 'rounded-[22px] border-white/26 bg-[#eee7d7]/42 backdrop-blur-2xl hover:border-black/18 hover:bg-[#eee7d7]/62'
                  }`}
                  type="button"
                  aria-label={`查看项目：${project.title}`}
                  onClick={() => selectProject(project.id)}
                >
                  <img
                    className="h-[92px] w-full rounded-[16px] object-cover max-sm:h-44"
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

            <article className="surface-block sticky top-24 self-start rounded-[28px] border border-white/32 bg-[#eee7d7]/56 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.10)] backdrop-blur-3xl max-lg:static">
              <div className="overflow-hidden rounded-[20px] bg-[#111]">
                <img
                  className="h-[384px] w-full object-contain max-md:h-[280px]"
                  src={currentMedia.src}
                  alt={currentMedia.label}
                />
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
                      aria-label={`查看${item.label}`}
                      onClick={() => setActiveMedia(index)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-6">
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

      <section id="resume" className="content-section py-20">
        <div className="section-inner mx-auto w-[min(1320px,calc(100%-32px))]">
          <div className="resume-header">
            <SectionLead title="简历" />
            <div className="resume-intent">
              <strong>{profile.target}</strong>
              <span>{profile.location}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <TimelinePanel />
            <section className="other-section surface-block rounded-[24px] border border-white/24 bg-[#eee7d7]/46 p-5 backdrop-blur-3xl">
              <SectionLead title="其他" />
              <div className="other-grid mt-5">
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
        </div>
      </section>

      <section id="contact" className="contact-section py-16 text-white">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="contact-header">
            <h2 className="text-3xl font-black tracking-normal">联系</h2>
            <div className="contact-info-list">
              <ContactLink
                label="邮箱"
                icon={<Mail className="size-4" />}
                text={profile.email}
                href={`mailto:${profile.email}`}
              />
              <ContactLink
                label="电话"
                icon={<Phone className="size-4" />}
                text={profile.phone}
                href={`tel:${profile.phone}`}
              />
            </div>
          </div>
          <div className="social-grid mt-8">
            {socialLinks.map((item) => (
              <article key={item.name} className="social-card">
                <div className="social-qr-plate">
                  <img src={item.image} alt={`${item.name}二维码`} />
                </div>
                <h3 className="mt-3 text-center text-base font-semibold text-white/88">
                  {item.name}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactLink({
  label,
  icon,
  text,
  href,
}: {
  label: string;
  icon: ReactNode;
  text: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="contact-chip-icon">{icon}</span>
      <span className="min-w-0">
        <span className="contact-chip-label">{label}</span>
        <span className="contact-chip-text">{text}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a className="contact-chip pressable" href={href}>
        {content}
      </a>
    );
  }

  return <span className="contact-chip">{content}</span>;
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

function TimelinePanel() {
  return (
    <section className="surface-block timeline-panel rounded-[28px] border border-white/24 bg-[#eee7d7]/46 p-5 backdrop-blur-3xl">
      <div className="timeline-panel-head">
        <div className="timeline-legend" aria-label="时间轴图例">
          <span className="timeline-legend-item timeline-legend-item--education">
            教育
          </span>
          <span className="timeline-legend-item timeline-legend-item--experience">
            经历
          </span>
          <span className="timeline-legend-item timeline-legend-item--award">
            获奖
          </span>
          <span className="timeline-legend-item timeline-legend-item--project">
            作品
          </span>
        </div>
      </div>
      <div
        className="timeline-stage-scroll timeline-stage-scroll--vertical"
        aria-label="简历时间轴"
      >
        <div className="timeline-stage">
          <div className="timeline-track">
            <svg
              className="timeline-path"
              viewBox="0 0 100 128"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M74 3 C86 13 48 18 61 27 C78 40 24 43 30 54 C38 66 77 57 65 72 C52 88 18 76 31 96 C42 112 78 106 63 124" />
            </svg>
            {timelineYears.map((item) => (
              <span
                key={item.year}
                className="timeline-year-ring"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                {item.year}
              </span>
            ))}
            {timelineItems.map((item) => (
              <article
                key={`${item.time}-${item.title}`}
                className={`timeline-node timeline-node--${item.kind} timeline-node--${item.side}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <span className="timeline-dot" aria-hidden="true" />
                {(item.kind === 'education' || item.kind === 'experience') && (
                  <span className="timeline-span" aria-hidden="true" />
                )}
                <span className="timeline-node-copy">
                  <span className="timeline-node-meta">
                    {item.time} · {item.label}
                  </span>
                  <span className="timeline-node-title">{item.title}</span>
                  <span className="timeline-node-text">{item.text}</span>
                </span>
              </article>
            ))}
          </div>
        </div>
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
