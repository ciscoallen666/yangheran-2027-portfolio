'use client';

/* oxlint-disable next/no-html-link-for-pages next/no-img-element */

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  ExternalLink,
  Layers,
  Mail,
  MapPin,
  Palette,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { filters, fitCards, profile, projects, resume, workflow } from './portfolio-data';

const accentClasses = [
  'border-[#286b57]/20 bg-[#286b57]/8 text-[#174a3c]',
  'border-[#a34d3a]/20 bg-[#a34d3a]/8 text-[#7b3428]',
  'border-[#214f8f]/20 bg-[#214f8f]/8 text-[#173d70]',
  'border-[#b5892f]/24 bg-[#b5892f]/10 text-[#725214]',
];

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
        : projects.find(
            (project) => project.category === filter || project.tags.includes(filter),
          );
    if (nextProject) {
      setSelectedId(nextProject.id);
      setActiveMedia(0);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#191b1f]">
      <header className="sticky top-0 z-30 border-b border-[#d8d1c4] bg-[#f7f4ee]/92 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
          <a className="flex items-center gap-3 font-semibold" href="#top" aria-label="返回顶部">
            <span className="grid size-9 place-items-center rounded-md bg-[#191b1f] text-xs font-bold text-white">
              YH
            </span>
            <span>杨赫然</span>
          </a>
          <nav className="flex items-center gap-1 overflow-x-auto text-sm font-medium text-[#626872]">
            <a className="rounded-md px-3 py-2 hover:bg-white hover:text-[#191b1f]" href="#works">
              作品
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-white hover:text-[#191b1f]" href="#method">
              AIGC
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-white hover:text-[#191b1f]" href="#resume">
              简历
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-white hover:text-[#191b1f]" href="#contact">
              联系
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="border-b border-[#d8d1c4]">
        <div className="mx-auto grid min-h-[calc(100svh-64px)] w-[min(1180px,calc(100%-32px))] grid-cols-[1.05fr_0.95fr] items-center gap-10 py-12 max-lg:grid-cols-1 max-lg:pt-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#286b57]">
              2027 Campus Recruitment Portfolio
            </p>
            <h1 className="text-[64px] font-black leading-[0.98] tracking-normal text-[#191b1f] max-md:text-[42px]">
              杨赫然
              <span className="mt-3 block text-[42px] font-semibold leading-tight text-[#a34d3a] max-md:text-[28px]">
                {profile.title}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold text-[#286b57]">
              {profile.subtitle}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#4f5661]">
              {profile.summary}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#191b1f] px-4 text-sm font-bold text-white hover:bg-[#30343a]"
                href="#works"
              >
                查看重点项目 <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#d8d1c4] bg-white px-4 text-sm font-bold text-[#191b1f] hover:border-[#191b1f]"
                href="#resume"
              >
                查看简历 <BriefcaseBusiness className="size-4" aria-hidden="true" />
              </a>
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#286b57]/25 bg-[#286b57]/8 px-4 text-sm font-bold text-[#174a3c] hover:border-[#286b57]"
                href="/YangHeran_Culture_AIGC_Portfolio.pdf"
              >
                PDF 作品集 <Download className="size-4" aria-hidden="true" />
              </a>
            </div>
            <dl className="mt-9 grid max-w-3xl grid-cols-3 gap-3 max-sm:grid-cols-1">
              {[
                ['6', '核心项目'],
                ['2027', '硕士毕业届'],
                ['公开版', '仅留邮箱'],
              ].map(([value, label]) => (
                <div key={label} className="border-t border-[#d8d1c4] pt-3">
                  <dt className="text-3xl font-black text-[#191b1f]">{value}</dt>
                  <dd className="mt-1 text-sm text-[#626872]">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg border border-[#d8d1c4] bg-white shadow-[0_22px_60px_rgba(25,27,31,0.12)]">
              <img
                className="h-[430px] w-full object-cover max-md:h-[280px]"
                src="/assets/portfolio/wadang-prop-object.webp"
                alt="珠走迷宫文创产品效果"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <InfoPill icon={<MapPin className="size-4" />} title="城市" text={profile.location} />
              <InfoPill
                icon={<Mail className="size-4" />}
                title="联系"
                text={profile.email}
                href={`mailto:${profile.email}`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8d1c4] bg-white py-12">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {fitCards.map((card, index) => (
            <article
              key={card.title}
              className={`rounded-lg border p-5 ${accentClasses[index % accentClasses.length]}`}
            >
              <h2 className="text-lg font-black tracking-normal">{card.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6">{card.keywords}</p>
              <p className="mt-3 text-sm leading-6 opacity-80">{card.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="works" className="py-16">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex items-end justify-between gap-6 max-md:block">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#286b57]">
                Selected Works
              </p>
              <h2 className="text-4xl font-black tracking-normal max-md:text-3xl">
                重点项目
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#626872]">
                从旧作品集中裁剪出与文旅文创、AIGC 视觉和数字展示最相关的项目，避免投递时被泛平面/泛舞美定位稀释。
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2" aria-label="作品筛选">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  className={`h-9 rounded-md border px-3 text-sm ${
                    activeFilter === filter
                      ? 'border-[#191b1f] bg-[#191b1f] text-white hover:bg-[#30343a]'
                      : 'border-[#d8d1c4] bg-white text-[#4f5661] hover:border-[#191b1f] hover:bg-white'
                  }`}
                  type="button"
                  variant="outline"
                  aria-pressed={activeFilter === filter}
                  onClick={() => changeFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-[0.86fr_1.14fr] gap-5 max-lg:grid-cols-1">
            <div className="grid gap-4">
              {visibleProjects.map((project) => (
                <button
                  key={project.id}
                  className={`grid grid-cols-[116px_minmax(0,1fr)] gap-4 rounded-lg border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(25,27,31,0.10)] max-sm:grid-cols-1 ${
                    selectedProject.id === project.id
                      ? 'border-[#191b1f] shadow-[0_14px_38px_rgba(25,27,31,0.10)]'
                      : 'border-[#d8d1c4]'
                  }`}
                  type="button"
                  aria-label={`查看项目：${project.title}`}
                  onClick={() => selectProject(project.id)}
                >
                  <img
                    className="h-[96px] w-full rounded-md object-cover max-sm:h-44"
                    style={{ objectPosition: project.coverPosition || '50% 50%' }}
                    src={project.cover}
                    alt=""
                  />
                  <span className="min-w-0">
                    <span className="text-xs font-bold text-[#a34d3a]">{project.category}</span>
                    <span className="mt-1 block text-lg font-black leading-tight">
                      {project.title}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-sm leading-6 text-[#626872]">
                      {project.summary}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <article className="sticky top-24 self-start rounded-lg border border-[#d8d1c4] bg-white p-4 shadow-[0_18px_48px_rgba(25,27,31,0.10)] max-lg:static">
              <div className="overflow-hidden rounded-md bg-[#101419]">
                <img
                  className="h-[380px] w-full object-contain max-md:h-[280px]"
                  src={currentMedia.src}
                  alt={currentMedia.label}
                />
              </div>
              {mediaItems.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {mediaItems.map((item, index) => (
                    <button
                      key={item.label}
                      className={`min-h-8 shrink-0 rounded-md border px-3 text-xs font-bold ${
                        activeMedia === index
                          ? 'border-[#191b1f] bg-[#191b1f] text-white'
                          : 'border-[#d8d1c4] bg-[#f7f4ee] text-[#4f5661]'
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
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="h-6 rounded-md bg-[#286b57] px-2 text-white">
                    {selectedProject.category}
                  </Badge>
                  <span className="text-sm font-bold text-[#a34d3a]">{selectedProject.year}</span>
                </div>
                <h3 className="mt-3 text-3xl font-black leading-tight tracking-normal max-md:text-2xl">
                  {selectedProject.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#4f5661]">{selectedProject.summary}</p>
                <TagRow tags={selectedProject.tags} />
                <DetailBlock title="项目角色" lines={[selectedProject.role]} />
                <DetailBlock title="证据与亮点" lines={selectedProject.evidence} />
                <DetailBlock title="输出物" lines={selectedProject.outputs} />
                <p className="mt-5 rounded-md border border-[#214f8f]/20 bg-[#214f8f]/8 p-4 text-sm leading-7 text-[#173d70]">
                  <span className="font-black">岗位关联：</span>
                  {selectedProject.relevance}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="method" className="border-y border-[#d8d1c4] bg-[#101419] py-16 text-white">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="grid grid-cols-[0.8fr_1.2fr] gap-10 max-lg:grid-cols-1">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9dd1bd]">
                AIGC Workflow
              </p>
              <h2 className="text-4xl font-black tracking-normal max-md:text-3xl">
                AI 不是技能标签，而是可解释的工作流
              </h2>
              <p className="mt-4 text-base leading-8 text-white/72">
                当前公开版只写已能从材料中支撑的 AIGC 使用方式：资料整理、方案推演、视觉参考筛选与人工二次设计。暂不写 Stable Diffusion、ComfyUI、Runway 等未经确认的工具。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              {workflow.map((item, index) => (
                <article
                  key={item.step}
                  className="rounded-lg border border-white/12 bg-white/7 p-5"
                >
                  <span className="mb-4 grid size-10 place-items-center rounded-md bg-white text-[#101419]">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-black">{item.step}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="resume" className="bg-white py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] grid-cols-[0.72fr_1.28fr] gap-10 max-lg:grid-cols-1">
          <aside className="self-start">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#286b57]">
              Resume
            </p>
            <h2 className="text-4xl font-black tracking-normal max-md:text-3xl">简历摘要</h2>
            <p className="mt-4 text-base leading-8 text-[#626872]">{profile.target}</p>
            <div className="mt-5 grid gap-3 text-sm">
              <InfoPill icon={<Sparkles className="size-4" />} title="届别" text={profile.graduation} />
              <InfoPill icon={<MapPin className="size-4" />} title="地点" text={profile.location} />
              <InfoPill
                icon={<Mail className="size-4" />}
                title="邮箱"
                text={profile.email}
                href={`mailto:${profile.email}`}
              />
            </div>
          </aside>

          <div className="grid gap-6">
            <ResumePanel title="教育背景" items={resume.education} icon={<Layers />} />
            <ResumePanel title="经历" items={resume.experience} icon={<BriefcaseBusiness />} />
            <section className="rounded-lg border border-[#d8d1c4] p-5">
              <PanelTitle icon={<Palette />} title="技能" />
              <div className="mt-4 flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#214f8f]/20 bg-[#214f8f]/8 px-3 py-1.5 text-sm font-bold text-[#173d70]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-[#d8d1c4] p-5">
              <PanelTitle icon={<CheckCircle2 />} title="获奖与证书" />
              <ul className="mt-4 grid gap-3">
                {resume.awards.map((award) => (
                  <li key={award} className="border-t border-[#ebe4d8] pt-3 text-sm leading-7 text-[#4f5661] first:border-t-0 first:pt-0">
                    {award}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#191b1f] py-14 text-white">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6 max-md:block">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9dd1bd]">
              Contact
            </p>
            <h2 className="text-3xl font-black tracking-normal">公开版联系方式</h2>
            <p className="mt-3 text-sm leading-7 text-white/68">
              公开网页只保留邮箱。正式投递附件可按岗位需要单独放联系方式完整版本。
            </p>
          </div>
          <a
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-[#191b1f] hover:bg-[#e8efe9] max-md:mt-5"
            href={`mailto:${profile.email}`}
          >
            {profile.email} <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}

function InfoPill({
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
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#191b1f] text-white">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-bold text-[#626872]">{title}</span>
        <span className="block text-sm font-black leading-5 text-[#191b1f]">{text}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a className="flex items-center gap-3 rounded-lg border border-[#d8d1c4] bg-white p-3 hover:border-[#191b1f]" href={href}>
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-3 rounded-lg border border-[#d8d1c4] bg-white p-3">{content}</div>;
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-[#286b57]/20 bg-[#286b57]/8 px-2.5 py-1 text-xs font-bold text-[#174a3c]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function DetailBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section className="mt-5">
      <h4 className="text-sm font-black text-[#191b1f]">{title}</h4>
      <ul className="mt-2 grid gap-2">
        {lines.map((line) => (
          <li key={line} className="flex gap-2 text-sm leading-7 text-[#4f5661]">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#a34d3a]" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PanelTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-xl font-black tracking-normal">
      <span className="grid size-9 place-items-center rounded-md bg-[#f1eadf] text-[#a34d3a] [&_svg]:size-4">
        {icon}
      </span>
      {title}
    </h3>
  );
}

function ResumePanel({
  title,
  items,
  icon,
}: {
  title: string;
  items: { time: string; title: string; text: string }[];
  icon: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#d8d1c4] p-5">
      <PanelTitle icon={icon} title={title} />
      <div className="mt-4 grid gap-4">
        {items.map((item) => (
          <article key={item.title} className="border-t border-[#ebe4d8] pt-4 first:border-t-0 first:pt-0">
            <p className="text-xs font-black text-[#a34d3a]">{item.time}</p>
            <h4 className="mt-1 text-base font-black tracking-normal">{item.title}</h4>
            <p className="mt-2 text-sm leading-7 text-[#626872]">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
