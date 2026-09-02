'use client';

/* oxlint-disable next/no-html-link-for-pages next/no-img-element */

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

import { filters, fitCards, profile, projects, resume } from './portfolio-data';

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
    name: '小红书',
    note: '图文作品',
    image: '/assets/social/xiaohongshu.jpg',
  },
  {
    name: '抖音',
    note: '动态内容',
    image: '/assets/social/douyin.jpg',
  },
  {
    name: '微信',
    note: '好友二维码',
    image: '/assets/social/wechat.jpg',
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
    projects.find((project) => project.id === selectedId) || visibleProjects[0] || projects[0];
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
      <header className={`site-header fixed top-0 z-30 w-full ${showHeader ? 'site-header--visible' : ''}`}>
        <div className="mx-auto flex min-h-16 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
          <a className="flex items-center gap-3" href="#top" aria-label="返回顶部">
            <span className="grid size-8 place-items-center rounded-[10px] bg-[#141414] text-xs font-semibold text-white">
              YH
            </span>
            <span className="text-sm font-semibold tracking-normal">杨赫然</span>
          </a>
          <nav className="flex items-center gap-1 overflow-x-auto text-sm text-black/56">
            <a className="px-3 py-2 hover:text-black" href="#direction">
              方向
            </a>
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

      <section id="top" className="hero-cover relative min-h-svh overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/portfolio/frosted-glass-hero.png"
          alt="霜面玻璃后的抽象人影，一手按住面板，一手持笔书写"
        />
        <div className="absolute inset-0 bg-[#ebece7]/8" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-svh w-[min(1180px,calc(100%-32px))] items-center justify-center py-16">
          <div className="hero-identity text-center">
            <div className="hero-name-lockup">
              <span className="hero-avatar avatar-mark" aria-hidden="true">
                <img
                  className="h-full w-full object-cover"
                  src="/assets/portfolio/profile-cisco-color.png"
                  alt=""
                  aria-hidden="true"
                />
              </span>
              <div className="hero-name-copy">
                <h1 className="hero-name">{profile.name}</h1>
                <p className="mt-4 text-sm font-semibold tracking-[0.18em] text-black/52">
                  Yang Heran · Cisco Allen
                </p>
              </div>
            </div>
            <p className="mt-8 text-base font-semibold tracking-[0.18em] text-[#4f654a]">
              文旅 · AIGC视觉 · 交互
            </p>
          </div>
        </div>
      </section>

      <section id="direction" className="content-section border-b border-black/10 py-14">
        <div className="section-inner mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex items-baseline justify-between gap-6 max-md:block">
            <h2 className="text-4xl font-black tracking-normal text-black/88 max-md:text-3xl">
              主投方向
            </h2>
            <p className="mt-3 text-base font-semibold leading-7 text-black/58">
              文旅 / 文创 / AIGC视觉 / 交互体验
            </p>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {fitCards.map((card) => (
              <article key={card.title} className="surface-block min-h-[134px] rounded-[24px] border border-white/46 bg-white/54 p-5 backdrop-blur-2xl">
                <h3 className="text-2xl font-black leading-tight text-black/88">
                  {card.title}
                </h3>
                <p className="mt-5 text-sm font-semibold leading-6 text-[#4f654a]">
                  {card.keywords}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="content-section py-16">
        <div className="section-inner mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex items-end justify-between gap-6 max-lg:block">
            <SectionLead title="重点项目" />
            <div className="mt-6 flex min-w-[520px] flex-wrap items-center gap-3 max-lg:min-w-0" aria-label="作品筛选">
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

          <div className="mt-9 grid grid-cols-[0.68fr_1.32fr] gap-5 max-lg:grid-cols-1">
            <div className="grid gap-3">
              {visibleProjects.map((project) => (
                <button
                  key={project.id}
                  className={`pressable grid grid-cols-[104px_minmax(0,1fr)] gap-4 border p-3 text-left max-sm:grid-cols-1 ${
                    selectedProject.id === project.id
                      ? 'rounded-[22px] border-black/24 bg-white/78 shadow-[0_18px_42px_rgba(0,0,0,0.12)]'
                      : 'rounded-[22px] border-white/42 bg-white/42 hover:border-black/22 hover:bg-white/68'
                  }`}
                  type="button"
                  aria-label={`查看项目：${project.title}`}
                  onClick={() => selectProject(project.id)}
                >
                  <img
                    className="h-[92px] w-full rounded-[16px] object-cover max-sm:h-44"
                    style={{ objectPosition: project.coverPosition || '50% 50%' }}
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

            <article className="surface-block sticky top-24 self-start rounded-[28px] border border-white/48 bg-white/58 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-2xl max-lg:static">
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
                <h3 className="mt-3 text-3xl font-black leading-tight tracking-normal text-black/88 max-md:text-2xl">
                  {selectedProject.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-black/56">
                  {selectedProject.summary}
                </p>
                <TagRow tags={selectedProject.tags} />
                <div className="mt-6 grid grid-cols-2 gap-5 max-md:grid-cols-1">
                  <DetailBlock title="项目角色" lines={[selectedProject.role]} />
                  <DetailBlock title="证据与亮点" lines={selectedProject.evidence.slice(0, 2)} />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="resume" className="content-section border-y border-black/10 bg-white/26 py-20 backdrop-blur-xl">
        <div className="section-inner mx-auto grid w-[min(1180px,calc(100%-32px))] grid-cols-[0.58fr_1.42fr] gap-10 max-lg:grid-cols-1">
          <aside className="self-start pt-4">
            <SectionLead title="简历" />
            <div className="mt-8 grid gap-2 text-sm">
              <MetaItem icon={<MapPin className="size-4" />} title="地点" text={profile.location} />
              <MetaItem icon={<Mail className="size-4" />} title="邮箱" text={profile.email} href={`mailto:${profile.email}`} />
              <MetaItem icon={<Phone className="size-4" />} title="电话" text={profile.phone} href={`tel:${profile.phone}`} />
            </div>
          </aside>

          <div className="grid gap-5">
            <ResumePanel title="教育背景" items={resume.education} />
            <ResumePanel title="经历" items={resume.experience} />
            <section className="surface-block rounded-[24px] border border-white/46 bg-white/48 p-5 backdrop-blur-2xl">
              <h3 className="text-xl font-black text-black/88">技能</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-semibold text-black/58">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            <section className="surface-block rounded-[24px] border border-white/46 bg-white/48 p-5 backdrop-blur-2xl">
              <h3 className="text-xl font-black text-black/88">获奖与证书</h3>
              <ul className="mt-4 grid gap-3">
                {resume.awards.map((award) => (
                  <li key={award} className="border-t border-black/8 pt-3 text-sm leading-7 text-black/54 first:border-t-0 first:pt-0">
                    {award}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section py-16 text-white">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex items-end justify-between gap-6 max-md:block">
            <h2 className="text-3xl font-black tracking-normal">联系</h2>
            <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-white/44">
              SOCIAL / QR
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {socialLinks.map((item) => (
              <article key={item.name} className="surface-block rounded-[28px] border border-white/16 bg-white/10 p-4 backdrop-blur-2xl">
                <div className="social-qr-plate">
                  <img src={item.image} alt={`${item.name}二维码`} />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-black text-white/88">{item.name}</h3>
                  <p className="text-sm font-semibold text-[#9fb293]">{item.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLead({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6f5a]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl font-black tracking-normal text-black/88 max-md:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-base leading-7 text-black/52">{text}</p>}
    </div>
  );
}

function MetaItem({
  icon,
  title,
  text,
  href,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid size-9 shrink-0 place-items-center bg-black text-white">{icon}</span>
      <span>
        <span className="block text-xs font-semibold text-black/40">{title}</span>
        <span className="block text-sm font-semibold leading-5 text-black/72">{text}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a className="pressable flex items-center gap-3 rounded-[18px] border border-black/10 bg-white/58 p-3 hover:border-black/34" href={href}>
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-white/58 p-3">{content}</div>;
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-black/10 bg-white/48 px-2.5 py-1 text-xs font-semibold text-black/48">
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
          <li key={line} className="border-t border-black/8 pt-2 text-sm leading-7 text-black/50 first:border-t-0 first:pt-0">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ResumePanel({ title, items }: { title: string; items: { time: string; title: string; text: string }[] }) {
  return (
    <section className="surface-block rounded-[24px] border border-white/46 bg-white/48 p-5 backdrop-blur-2xl">
      <h3 className="text-xl font-black text-black/88">{title}</h3>
      <div className="mt-4 grid gap-4">
        {items.map((item) => (
          <article key={item.title} className="border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
            <p className="text-xs font-semibold text-[#5f6f5a]">{item.time}</p>
            <h4 className="mt-1 text-base font-black tracking-normal text-black/82">{item.title}</h4>
            <p className="mt-2 text-sm leading-7 text-black/50">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
