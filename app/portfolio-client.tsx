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
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <TimelinePanel />
            <section className="other-section surface-block rounded-[24px] border border-white/24 bg-[#eee7d7]/46 p-5 backdrop-blur-3xl">
              <SectionLead title="个人介绍" />
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
    <section className="surface-block timeline-panel timeline-panel--final rounded-[28px] border border-white/24 bg-[#eee7d7]/46 p-5 backdrop-blur-3xl">
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

        <div className="timeline-canvas" aria-label="简历时间轴">
          <div className="timeline-final-stage">
            <svg
              className="timeline-final-svg"
              viewBox="0 0 1000 1240"
              preserveAspectRatio="none"
              role="img"
              aria-label="从下往上的弓字形时间轴"
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
                   H300"
              />
              <path
                className="timeline-exp-line"
                d="M565 1110 H880 Q950 1110 950 1040 Q950 970 690 970"
              />
              <path className="timeline-exp-line" d="M565 830 H625" />
              <path className="timeline-exp-line" d="M690 690 H374" />
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
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-2020" />
            <span className="timeline-month timeline-month--exp timeline-exp-month-2020">
              3月
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2021">
              2021
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-2021" />
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-2021" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-2021">
              <b>7月</b>德润文化广告
            </span>
            <span className="timeline-month timeline-month--exp timeline-exp-month-2021">
              8月
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2022">
              2022
            </span>
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-start-2022" />
            <span className="timeline-range-end timeline-range-end--exp timeline-exp-end-2022" />
            <span className="timeline-range-label timeline-range-label--exp timeline-exp-label-2022">
              <b>3月</b>新东方｜运营助教
            </span>
            <span className="timeline-month timeline-month--exp timeline-exp-month-2022">
              8月
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2023">
              2023
            </span>
            <span className="timeline-range-end timeline-range-end--edu timeline-edu-end-2023" />
            <span className="timeline-month timeline-month--edu timeline-edu-month-2023">
              7月
            </span>
            <span className="timeline-card timeline-card--project timeline-card--bachelor">
              本科毕业
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2024">
              2024
            </span>
            <span className="timeline-range-end timeline-range-end--edu timeline-edu-start-2024" />
            <span className="timeline-range-label timeline-range-label--edu timeline-edu-label-2024">
              <b>9月</b>西安外国语大学｜硕士在读
            </span>
            <span className="timeline-card timeline-card--project timeline-card--maqiao">
              秦韵马勺脸谱
            </span>
            <span className="timeline-card timeline-card--project timeline-card--paper-lamp">
              三教学楼纸雕灯
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2024" />
            <span className="timeline-card timeline-card--award timeline-card--jujube">
              佳县红润枣业包装
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2025">
              2025
            </span>
            <span className="timeline-card timeline-card--project timeline-card--siyang">
              四羊方尊摩托车贴花
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2025" />
            <span className="timeline-card timeline-card--award timeline-card--strait">
              两岸数字艺术设计
            </span>
            <span className="timeline-card timeline-card--project timeline-card--stop-motion">
              定格动画系列
            </span>

            <span className="timeline-node timeline-node--year timeline-node--2026">
              2026
            </span>
            <span className="timeline-card timeline-card--project timeline-card--hanwa">
              吉言汉瓦“永受嘉福”
            </span>
            <span className="timeline-node timeline-node--award timeline-award-2026" />
            <span className="timeline-card timeline-card--award timeline-card--bridge">
              蓝桥杯 / 米兰设计周
            </span>
            <span className="timeline-card timeline-card--project timeline-card--tangmirror">
              唐镜数字交互展示
            </span>
            <span className="timeline-range-end timeline-range-end--edu timeline-edu-end-2027" />
            <span className="timeline-month timeline-month--edu timeline-edu-month-2027">
              7月
            </span>
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
