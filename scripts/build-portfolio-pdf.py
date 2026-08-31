from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "assets" / "portfolio"
OUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
PUBLIC_PDF = ROOT / "public" / "YangHeran_Culture_AIGC_Portfolio.pdf"
OUTPUT_PDF = OUT_DIR / "YangHeran_Culture_AIGC_Portfolio.pdf"

PAGE_W, PAGE_H = landscape(A4)
MARGIN = 42

INK = HexColor("#191b1f")
MUTED = HexColor("#626872")
LINE = HexColor("#d8d1c4")
PAPER = HexColor("#f7f4ee")
WHITE = HexColor("#ffffff")
GREEN = HexColor("#286b57")
GREEN_DARK = HexColor("#174a3c")
RUST = HexColor("#a34d3a")
BLUE = HexColor("#214f8f")
GOLD = HexColor("#b5892f")

FONT_REGULAR = "DengXian"
FONT_BOLD = "DengXian-Bold"


def register_fonts() -> None:
    font_candidates = [
        (FONT_REGULAR, Path("C:/Windows/Fonts/Deng.ttf")),
        (FONT_BOLD, Path("C:/Windows/Fonts/Dengb.ttf")),
    ]
    fallback_candidates = [
        (FONT_REGULAR, Path("C:/Windows/Fonts/simhei.ttf")),
        (FONT_BOLD, Path("C:/Windows/Fonts/simhei.ttf")),
    ]

    for font_name, font_path in font_candidates:
        if not font_path.exists():
            continue
        pdfmetrics.registerFont(TTFont(font_name, str(font_path)))

    registered = set(pdfmetrics.getRegisteredFontNames())
    if FONT_REGULAR not in registered or FONT_BOLD not in registered:
        for font_name, font_path in fallback_candidates:
            if font_path.exists() and font_name not in set(pdfmetrics.getRegisteredFontNames()):
                pdfmetrics.registerFont(TTFont(font_name, str(font_path)))


def load_portfolio_data() -> dict:
    js = """
      const mod = await import('./app/portfolio-data.ts');
      const data = {
        profile: mod.profile,
        fitCards: mod.fitCards,
        workflow: mod.workflow,
        projects: mod.projects,
        resume: mod.resume
      };
      process.stdout.write(JSON.stringify(data));
    """
    result = subprocess.run(
        ["node", "--experimental-strip-types", "-e", js],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def fit_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    closing_punctuation = set("，。；：、！？）》】”’.,;:!?)]}")
    lines: list[str] = []
    for paragraph in str(text).splitlines() or [""]:
        current = ""
        for char in paragraph:
            candidate = current + char
            if pdfmetrics.stringWidth(candidate, font, size) <= max_width:
                current = candidate
                continue
            if char in closing_punctuation and current:
                lines.append(current + char)
                current = ""
                continue
            if current:
                lines.append(current)
            current = char
        if current:
            lines.append(current)
    return lines


def draw_text(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    *,
    font: str = FONT_REGULAR,
    size: float = 10.5,
    leading: float = 16,
    color=INK,
    max_lines: int | None = None,
) -> float:
    lines = fit_lines(text, font, size, width)
    if max_lines is not None and len(lines) > max_lines:
        lines = lines[:max_lines]
        while lines[-1] and pdfmetrics.stringWidth(lines[-1] + "...", font, size) > width:
            lines[-1] = lines[-1][:-1]
        lines[-1] = lines[-1] + "..."

    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_rule(c: canvas.Canvas, y: float, color=LINE) -> None:
    c.setStrokeColor(color)
    c.setLineWidth(0.8)
    c.line(MARGIN, y, PAGE_W - MARGIN, y)


def draw_page_base(c: canvas.Canvas, title: str, page_no: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 9)
    c.drawString(MARGIN, PAGE_H - 26, "杨赫然 | 2027 届秋招作品集")
    c.setFillColor(MUTED)
    c.setFont(FONT_REGULAR, 8)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 26, f"{title} / {page_no:02d}")
    draw_rule(c, PAGE_H - 38)


def draw_label(c: canvas.Canvas, text: str, x: float, y: float, color=GREEN) -> None:
    c.setFillColor(color)
    c.setFont(FONT_BOLD, 9)
    c.drawString(x, y, text.upper())


def draw_title(c: canvas.Canvas, text: str, x: float, y: float, width: float, size: float = 28) -> float:
    return draw_text(c, text, x, y, width, font=FONT_BOLD, size=size, leading=size + 5, color=INK)


def draw_tag(c: canvas.Canvas, text: str, x: float, y: float, fill=WHITE, stroke=LINE, color=INK) -> float:
    c.setFont(FONT_BOLD, 8.5)
    tag_w = pdfmetrics.stringWidth(text, FONT_BOLD, 8.5) + 18
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.roundRect(x, y - 5, tag_w, 20, 4, fill=1, stroke=1)
    c.setFillColor(color)
    c.drawString(x + 9, y, text)
    return x + tag_w + 6


def draw_card(c: canvas.Canvas, x: float, y: float, w: float, h: float, *, fill=WHITE, stroke=LINE) -> None:
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.roundRect(x, y, w, h, 6, fill=1, stroke=1)


def draw_image(c: canvas.Canvas, src: str, x: float, y: float, w: float, h: float, background=HexColor("#101419")) -> None:
    path = ASSET_DIR / Path(src).name
    draw_card(c, x, y, w, h, fill=background, stroke=background)
    if not path.exists():
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 10)
        c.drawCentredString(x + w / 2, y + h / 2, "图片缺失")
        return

    with Image.open(path) as image:
        image = image.convert("RGB")
        iw, ih = image.size
        scale = min(w / iw, h / ih)
        dw, dh = iw * scale, ih * scale
        c.drawImage(
            ImageReader(image),
            x + (w - dw) / 2,
            y + (h - dh) / 2,
            width=dw,
            height=dh,
            mask=None,
        )


def draw_bullets(
    c: canvas.Canvas,
    items: list[str],
    x: float,
    y: float,
    width: float,
    *,
    size: float = 9.6,
    leading: float = 14,
    max_lines_each: int = 3,
    color=MUTED,
    bullet=RUST,
) -> float:
    for item in items:
        c.setFillColor(bullet)
        c.circle(x + 3, y + 4, 2, fill=1, stroke=0)
        y = draw_text(
            c,
            item,
            x + 13,
            y,
            width - 13,
            size=size,
            leading=leading,
            color=color,
            max_lines=max_lines_each,
        )
        y -= 4
    return y


def draw_cover(c: canvas.Canvas, data: dict) -> None:
    profile = data["profile"]
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    draw_image(c, "/assets/portfolio/wadang-prop-object.webp", PAGE_W - 385, 86, 320, 360)
    draw_label(c, "2027 Campus Recruitment Portfolio", MARGIN, PAGE_H - 104)
    y = draw_title(c, profile["name"], MARGIN, PAGE_H - 144, 390, size=44)
    y = draw_title(c, profile["title"], MARGIN, y - 2, 450, size=25)
    c.setFillColor(GREEN)
    c.setFont(FONT_BOLD, 13)
    c.drawString(MARGIN, y - 8, profile["subtitle"])
    y = draw_text(c, profile["summary"], MARGIN, y - 36, 440, size=11.5, leading=19, color=MUTED)

    meta_y = y - 24
    for text, color in [
        (profile["target"], GREEN_DARK),
        (profile["location"], BLUE),
        (profile["graduation"], RUST),
        (f"邮箱：{profile['email']}", INK),
        ("公开网页与 PDF 版本仅保留邮箱", MUTED),
    ]:
        meta_y = draw_text(c, text, MARGIN, meta_y, 420, font=FONT_BOLD, size=10.2, leading=18, color=color)


def draw_fit_page(c: canvas.Canvas, data: dict, page_no: int) -> None:
    draw_page_base(c, "岗位匹配", page_no)
    draw_label(c, "Target Roles", MARGIN, PAGE_H - 76)
    draw_title(c, "主投方向：文旅文创 / AIGC 视觉 / 数字文旅体验", MARGIN, PAGE_H - 103, 610, size=24)

    card_w = (PAGE_W - MARGIN * 2 - 18) / 2
    y_top = PAGE_H - 230
    accents = [GREEN, RUST, BLUE, GOLD]
    for idx, card in enumerate(data["fitCards"]):
        x = MARGIN + (idx % 2) * (card_w + 18)
        y = y_top - (idx // 2) * 115
        draw_card(c, x, y, card_w, 94)
        c.setFillColor(accents[idx % len(accents)])
        c.rect(x, y + 91, card_w, 3, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont(FONT_BOLD, 14)
        c.drawString(x + 16, y + 66, card["title"])
        draw_text(c, card["keywords"], x + 16, y + 45, card_w - 32, font=FONT_BOLD, size=9.4, leading=14, color=accents[idx % len(accents)])
        draw_text(c, card["proof"], x + 16, y + 25, card_w - 32, size=9.2, leading=13, color=MUTED, max_lines=2)

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 16)
    c.drawString(MARGIN, 176, "AIGC 使用口径")
    c.setFillColor(MUTED)
    c.setFont(FONT_REGULAR, 9.8)
    c.drawString(MARGIN, 154, "只写已能由作品材料支撑的流程，不把 AI 初稿包装为最终作品。")

    step_w = (PAGE_W - MARGIN * 2 - 27) / 4
    for idx, item in enumerate(data["workflow"]):
        x = MARGIN + idx * (step_w + 9)
        draw_card(c, x, 70, step_w, 66, fill=HexColor("#fffaf2"))
        c.setFillColor(GREEN if idx % 2 == 0 else RUST)
        c.setFont(FONT_BOLD, 11)
        c.drawString(x + 12, 112, f"{idx + 1}. {item['step']}")
        draw_text(c, item["text"], x + 12, 94, step_w - 24, size=8.2, leading=11.2, color=MUTED, max_lines=4)


def draw_resume_page(c: canvas.Canvas, data: dict, page_no: int) -> None:
    draw_page_base(c, "简历摘要", page_no)
    resume = data["resume"]
    profile = data["profile"]
    left_x = MARGIN
    right_x = MARGIN + 360

    draw_label(c, "Resume", left_x, PAGE_H - 76)
    draw_title(c, "杨赫然", left_x, PAGE_H - 104, 300, size=30)
    draw_text(c, profile["target"], left_x, PAGE_H - 150, 300, size=10.5, leading=17, color=MUTED)
    y = PAGE_H - 206
    y = section_block(c, "教育背景", resume["education"], left_x, y, 300)

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 15)
    c.drawString(left_x, y - 4, "技能")
    tag_x = left_x
    tag_y = y - 30
    for skill in resume["skills"]:
        next_x = tag_x + pdfmetrics.stringWidth(skill, FONT_BOLD, 8.3) + 24
        if next_x > left_x + 300:
            tag_x = left_x
            tag_y -= 26
        tag_x = draw_tag(c, skill, tag_x, tag_y, fill=WHITE, stroke=LINE, color=BLUE)

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 15)
    c.drawString(right_x, PAGE_H - 76, "实践经历")
    y_right = PAGE_H - 102
    for item in resume["experience"]:
        c.setFillColor(RUST)
        c.setFont(FONT_BOLD, 9)
        c.drawString(right_x, y_right, item["time"])
        y_right = draw_text(c, item["title"], right_x, y_right - 16, 390, font=FONT_BOLD, size=10.4, leading=15, color=INK)
        y_right = draw_text(c, item["text"], right_x, y_right - 2, 390, size=9.4, leading=14, color=MUTED, max_lines=3) - 10

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 15)
    c.drawString(right_x, 218, "获奖")
    draw_bullets(c, resume["awards"], right_x, 194, 390, size=8.5, leading=12, max_lines_each=2, color=MUTED)


def section_block(c: canvas.Canvas, heading: str, items: list[dict], x: float, y: float, width: float) -> float:
    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 15)
    c.drawString(x, y, heading)
    y -= 26
    for item in items:
        c.setFillColor(RUST)
        c.setFont(FONT_BOLD, 8.8)
        c.drawString(x, y, item["time"])
        y = draw_text(c, item["title"], x, y - 14, width, font=FONT_BOLD, size=10.2, leading=14, color=INK)
        y = draw_text(c, item["text"], x, y - 2, width, size=9.2, leading=13, color=MUTED, max_lines=3) - 10
    return y


def draw_project_page(c: canvas.Canvas, project: dict, page_no: int) -> None:
    draw_page_base(c, project["category"], page_no)
    left_x = MARGIN
    right_x = MARGIN + 382
    image_y = 146
    draw_image(c, project["cover"], left_x, image_y, 340, 332)

    media = project.get("media") or []
    if len(media) > 1:
        thumb_w = 78
        for idx, item in enumerate(media[:4]):
            draw_image(c, item["src"], left_x + idx * (thumb_w + 9), 66, thumb_w, 56)

    draw_label(c, f"{project['year']} / {project['category']}", right_x, PAGE_H - 78, color=RUST)
    y = draw_title(c, project["title"], right_x, PAGE_H - 105, PAGE_W - right_x - MARGIN, size=21)
    y = draw_text(c, project["summary"], right_x, y - 4, PAGE_W - right_x - MARGIN, size=10.3, leading=16, color=MUTED, max_lines=4) - 6

    tag_x = right_x
    tag_y = y
    for tag in project["tags"]:
        next_x = tag_x + pdfmetrics.stringWidth(tag, FONT_BOLD, 8.5) + 28
        if next_x > PAGE_W - MARGIN:
            tag_x = right_x
            tag_y -= 24
        tag_x = draw_tag(c, tag, tag_x, tag_y, fill=WHITE, stroke=LINE, color=GREEN_DARK)
    y = tag_y - 30

    y = draw_small_section(c, "项目角色", [project["role"]], right_x, y, PAGE_W - right_x - MARGIN, max_lines_each=3)
    y = draw_small_section(c, "证据与亮点", project["evidence"], right_x, y, PAGE_W - right_x - MARGIN, max_lines_each=2)
    y = draw_small_section(c, "输出物", [" / ".join(project["outputs"])], right_x, y, PAGE_W - right_x - MARGIN, max_lines_each=2)
    draw_small_section(c, "岗位关联", [project["relevance"]], right_x, y, PAGE_W - right_x - MARGIN, max_lines_each=3, heading_color=BLUE)


def draw_small_section(
    c: canvas.Canvas,
    title: str,
    lines: list[str],
    x: float,
    y: float,
    width: float,
    *,
    max_lines_each: int,
    heading_color=INK,
) -> float:
    c.setFillColor(heading_color)
    c.setFont(FONT_BOLD, 11.5)
    c.drawString(x, y, title)
    y -= 18
    return draw_bullets(c, lines, x, y, width, size=9.1, leading=12.5, max_lines_each=max_lines_each) - 2


def build_pdf() -> None:
    register_fonts()
    data = load_portfolio_data()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(OUTPUT_PDF), pagesize=landscape(A4))
    draw_cover(c, data)
    c.showPage()
    draw_fit_page(c, data, 2)
    c.showPage()
    draw_resume_page(c, data, 3)
    c.showPage()
    for page_no, project in enumerate(data["projects"], start=4):
        draw_project_page(c, project, page_no)
        c.showPage()
    c.save()
    shutil.copyfile(OUTPUT_PDF, PUBLIC_PDF)
    print(json.dumps({"output": str(OUTPUT_PDF), "public": str(PUBLIC_PDF)}, ensure_ascii=False))


if __name__ == "__main__":
    build_pdf()
