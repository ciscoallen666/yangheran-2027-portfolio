'use client';

/* oxlint-disable next/no-html-link-for-pages next/no-img-element */

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { ArrowRight, Download, ExternalLink, Mail, MapPin } from 'lucide-react';

import { filters, fitCards, profile, projects, resume } from './portfolio-data';

const otherFilters = filters.filter((filter) => filter !== '全部');

export default function PortfolioClient() {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [activeMedia, setActiveMedia] = useState(0);

  const visibleProjects = useMemo(() => {
    if (activeFilter === '全部') return projects;
    return projects.filter(
      (project) => project.category === activeFilter || project.tags.includes(activeFilter),
    );
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
        : projects.find((project) => project.category === filter || project.tags.includes(filter));
    if (nextProject) {
      setSelectedId(nextProject.id);
      setActiveMedia(0);
    }
  }

  return (
    <main className="portfolio-shell min-h-screen text-[#141414]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#efefea]/78 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
          <a className="flex items-center gap-3" href="#top" aria-label="返回顶部">
            <span className="grid size-8 place-items-center bg-[#141414] text-xs font-semibold text-white">
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

      <section id="top" className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-x-0 top-0 h-40 bg-white/36 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid min-h-[calc(100svh-64px)] w-[min(1180px,calc(100%-32px))] grid-cols-[0.92fr_1.08fr] items-center gap-10 py-12 max-lg:grid-cols-1">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6f5a]">
              2027 Campus Recruitment Portfolio
            </p>
            <h1 className="text-[72px] font-black leading-[0.92] tracking-normal max-md:text-[46px]">
              {profile.name}
            </h1>
            <p className="mt-5 text-3xl font-semibold leading-tight text-black/82 max-md:text-2xl">
              {profile.title}
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-black/58">{profile.summary}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a className="inline-flex min-h-11 items-center gap-2 bg-[#141414] px-4 text-sm font-semibold text-white hover:bg-black" href="#works">
                重点项目 <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a className="inline-flex min-h-11 items-center gap-2 border border-black/14 bg-white/62 px-4 text-sm font-semibold text-black backdrop-blur hover:border-black/42" href="/YangHeran_Culture_AIGC_Portfolio.pdf">
                PDF 作品集 <Download className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 border-y border-black/12 max-sm:grid-cols-1">
              <Metric value="06" label="核心项目" />
              <Metric value="2027" label="硕士毕业届" />
              <Metric value="B/S/G" label="北上广深优先" />
            </div>
          </div>

          <div className="portrait-frame relative min-h-[540px] overflow-hidden bg-[#d8dad4] max-md:min-h-[390px]">
            <img
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-36 blur-xl grayscale"
              src="/assets/portfolio/hero-portrait-wide.webp"
              alt=""
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[#e9ebe6]/44" aria-hidden="true" />
            <img
              className="relative z-10 h-full w-full object-cover grayscale"
              src="/assets/portfolio/hero-portrait-wide.webp"
              alt="杨赫然个人照片"
            />
          </div>
        </div>
      </section>

      <section id="direction" className="border-b border-black/10 py-14">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <SectionLead eyebrow="Target Roles" title="主投方向" text={profile.target} />
          <div className="mt-8 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {fitCards.map((card) => (
              <article key={card.title} className="surface-block min-h-[152px] border border-black/10 bg-white/58 p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold text-[#5f6f5a]">{card.title}</p>
                <h3 className="mt-6 text-xl font-black leading-tight text-black/88">
                  {card.keywords}
                </h3>
                <p className="mt-4 text-sm leading-6 text-black/50">{card.proof}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="py-16">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex items-end justify-between gap-6 max-lg:block">
            <SectionLead
              eyebrow="Selected Works"
              title="重点项目"
              text="以文旅文创、AIGC 视觉和数字展示为主线呈现，项目细节后续可继续逐个调整。"
            />
            <div className="mt-6 min-w-[360px] max-lg:min-w-0" aria-label="作品筛选">
              <button
                className={`mb-3 h-9 border px-4 text-sm font-semibold ${
                  activeFilter === '全部'
                    ? 'border-black bg-black text-white'
                    : 'border-black/14 bg-white/54 text-black/58 hover:border-black/42'
                }`}
                type="button"
                aria-pressed={activeFilter === '全部'}
                onClick={() => changeFilter('全部')}
              >
                全部
              </button>
              <div className="flex flex-wrap gap-2">
                {otherFilters.map((filter) => (
                  <button
                    key={filter}
                    className={`h-9 border px-3 text-sm ${
                      activeFilter === filter
                        ? 'border-[#5f6f5a] bg-[#5f6f5a] text-white'
                        : 'border-black/12 bg-white/44 text-black/52 hover:border-black/38 hover:text-black'
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
          </div>

          <div className="mt-9 grid grid-cols-[0.84fr_1.16fr] gap-5 max-lg:grid-cols-1">
            <div className="grid gap-3">
              {visibleProjects.map((project) => (
                <button
                  key={project.id}
                  className={`grid grid-cols-[112px_minmax(0,1fr)] gap-4 border p-3 text-left transition max-sm:grid-cols-1 ${
                    selectedProject.id === project.id
                      ? 'border-black bg-white/82 shadow-[0_18px_42px_rgba(0,0,0,0.10)]'
                      : 'border-black/10 bg-white/48 hover:border-black/32 hover:bg-white/72'
                  }`}
                  type="button"
                  aria-label={`查看项目：${project.title}`}
                  onClick={() => selectProject(project.id)}
                >
                  <img
                    className="h-[92px] w-full object-cover grayscale max-sm:h-44"
                    style={{ objectPosition: project.coverPosition || '50% 50%' }}
                    src={project.cover}
                    alt=""
                  />
                  <span className="min-w-0">
                    <span className="text-xs font-semibold text-[#5f6f5a]">{project.category}</span>
                    <span className="mt-1 block text-lg font-black leading-tight text-black/86">
                      {project.title}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-sm leading-6 text-black/48">
                      {project.summary}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <article className="sticky top-24 self-start border border-black/10 bg-white/66 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.10)] backdrop-blur-xl max-lg:static">
              <div className="bg-[#111]">
                <img
                  className="h-[384px] w-full object-contain grayscale max-md:h-[280px]"
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
                          ? 'border-black bg-black text-white'
                          : 'border-black/12 bg-[#efefea] text-black/48'
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
                <div className="mt-5 border-t border-black/10 pt-4">
                  <p className="text-xs font-semibold text-black/42">岗位关联</p>
                  <p className="mt-2 text-sm leading-7 text-black/54">{selectedProject.relevance}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="resume" className="border-y border-black/10 bg-white/42 py-16 backdrop-blur-xl">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] grid-cols-[0.72fr_1.28fr] gap-10 max-lg:grid-cols-1">
          <aside className="self-start">
            <SectionLead eyebrow="Resume" title="简历摘要" text={profile.target} />
            <div className="mt-6 grid gap-3 text-sm">
              <MetaItem icon={<MapPin className="size-4" />} title="地点" text={profile.location} />
              <MetaItem icon={<Mail className="size-4" />} title="邮箱" text={profile.email} href={`mailto:${profile.email}`} />
            </div>
          </aside>

          <div className="grid gap-5">
            <ResumePanel title="教育背景" items={resume.education} />
            <ResumePanel title="经历" items={resume.experience} />
            <section className="border border-black/10 bg-white/58 p-5">
              <h3 className="text-xl font-black text-black/88">技能</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span key={skill} className="border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-semibold text-black/58">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            <section className="border border-black/10 bg-white/58 p-5">
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

      <section id="contact" className="bg-[#141414] py-14 text-white">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6 max-md:block">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#aeb8a7]">
              Contact
            </p>
            <h2 className="text-3xl font-black tracking-normal">联系</h2>
          </div>
          <a
            className="mt-6 inline-flex min-h-11 items-center gap-2 bg-white px-4 text-sm font-semibold text-[#141414] hover:bg-[#e7e9e2] max-md:mt-5"
            href={`mailto:${profile.email}`}
          >
            {profile.email} <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}

function SectionLead({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6f5a]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-black tracking-normal text-black/88 max-md:text-3xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-black/52">{text}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="py-4 pr-5">
      <span className="block text-3xl font-black text-black/86">{value}</span>
      <span className="mt-1 block text-sm text-black/46">{label}</span>
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
        <span className="block text-xs font-semibold text-black/42">{title}</span>
        <span className="block text-sm font-black leading-5 text-black/78">{text}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a className="flex items-center gap-3 border border-black/10 bg-white/58 p-3 hover:border-black/34" href={href}>
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-3 border border-black/10 bg-white/58 p-3">{content}</div>;
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="border border-black/10 bg-white/48 px-2.5 py-1 text-xs font-semibold text-black/48">
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
    <section className="border border-black/10 bg-white/58 p-5">
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
