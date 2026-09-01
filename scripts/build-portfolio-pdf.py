from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps
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

INK = HexColor("#141414")
TEXT = HexColor("#303030")
MUTED = HexColor("#6a6a66")
FAINT = HexColor("#a5a7a0")
LINE = HexColor("#c9cbc4")
PAPER = HexColor("#e9ebe6")
SOFT = HexColor("#f5f5f2")
WHITE = HexColor("#ffffff")
GREEN = HexColor("#5f6f5a")
DARK = HexColor("#101010")

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
        if font_path.exists():
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
    color=TEXT,
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


def draw_texture(c: canvas.Canvas) -> None:
    c.setFillColor(HexColor("#f4f4ef"))
    c.circle(PAGE_W - 118, PAGE_H - 96, 84, fill=1, stroke=0)
    c.setFillColor(HexColor("#d8ddd2"))
    for x, y, rx, ry, angle in [
        (112, PAGE_H - 96, 74, 18, -18),
        (210, PAGE_H - 132, 96, 22, -12),
        (702, PAGE_H - 154, 110, 24, -20),
        (650, 118, 126, 26, -16),
        (156, 172, 92, 20, -24),
    ]:
        c.saveState()
        c.translate(x, y)
        c.rotate(angle)
        c.scale(rx, ry)
        c.circle(0, 0, 1, fill=1, stroke=0)
        c.restoreState()
    c.setFillColor(HexColor("#eef0ea"))
    for x, y, rx, ry, angle in [
        (138, PAGE_H - 75, 88, 16, -24),
        (735, PAGE_H - 118, 108, 18, -17),
        (612, 152, 144, 22, -12),
    ]:
        c.saveState()
        c.translate(x, y)
        c.rotate(angle)
        c.scale(rx, ry)
        c.circle(0, 0, 1, fill=1, stroke=0)
        c.restoreState()


def draw_page_base(c: canvas.Canvas, title: str, page_no: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    draw_texture(c)
    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 9)
    c.drawString(MARGIN, PAGE_H - 26, "杨赫然 | 2027 届秋招作品集")
    c.setFillColor(MUTED)
    c.setFont(FONT_REGULAR, 8)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 26, f"{title} / {page_no:02d}")
    c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    c.line(MARGIN, PAGE_H - 38, PAGE_W - MARGIN, PAGE_H - 38)


def draw_label(c: canvas.Canvas, text: str, x: float, y: float) -> None:
    c.setFillColor(GREEN)
    c.setFont(FONT_BOLD, 9)
    c.drawString(x, y, text.upper())


def draw_title(c: canvas.Canvas, text: str, x: float, y: float, width: float, size: float = 28) -> float:
    return draw_text(c, text, x, y, width, font=FONT_BOLD, size=size, leading=size + 5, color=INK)


def draw_tag(c: canvas.Canvas, text: str, x: float, y: float, fill=WHITE, stroke=LINE, color=MUTED) -> float:
    c.setFont(FONT_BOLD, 8.5)
    tag_w = pdfmetrics.stringWidth(text, FONT_BOLD, 8.5) + 18
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.rect(x, y - 5, tag_w, 20, fill=1, stroke=1)
    c.setFillColor(color)
    c.drawString(x + 9, y, text)
    return x + tag_w + 6


def draw_block(c: canvas.Canvas, x: float, y: float, w: float, h: float, *, fill=WHITE, stroke=LINE) -> None:
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.rect(x, y, w, h, fill=1, stroke=1)


def prepare_image(path: Path, *, grayscale: bool = True, blur: float = 0) -> Image.Image:
    image = Image.open(path).convert("RGB")
    if grayscale:
        image = ImageOps.grayscale(image).convert("RGB")
        image = ImageOps.autocontrast(image, cutoff=1)
        image = ImageEnhance.Contrast(image).enhance(1.06)
    if blur:
        image = image.filter(ImageFilter.GaussianBlur(blur))
    return image


def crop_to_aspect(image: Image.Image, aspect: float, *, anchor_x: float = 0.5) -> Image.Image:
    iw, ih = image.size
    current = iw / ih
    if current > aspect:
        new_w = int(ih * aspect)
        left = int((iw - new_w) * anchor_x)
        return image.crop((left, 0, left + new_w, ih))
    new_h = int(iw / aspect)
    top = max(0, int((ih - new_h) * 0.35))
    return image.crop((0, top, iw, top + new_h))


def draw_cover_photo(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    path = ASSET_DIR / "hero-portrait-wide.webp"
    draw_block(c, x, y, w, h, fill=HexColor("#d9dbd4"), stroke=HexColor("#d9dbd4"))
    if not path.exists():
        return
    aspect = w / h
    soft = crop_to_aspect(prepare_image(path, grayscale=True, blur=8), aspect, anchor_x=0.72)
    sharp = crop_to_aspect(prepare_image(path, grayscale=True), aspect, anchor_x=0.72)
    c.drawImage(ImageReader(soft), x, y, width=w, height=h, mask=None)
    c.setFillColor(HexColor("#e9ebe6"))
    c.rect(x, y, w, h, fill=1, stroke=0)
    c.saveState()
    c.setFillAlpha(0.58)
    c.drawImage(ImageReader(soft), x, y, width=w, height=h, mask=None)
    c.restoreState()
    c.saveState()
    c.setFillAlpha(0.86)
    c.drawImage(ImageReader(sharp), x, y, width=w, height=h, mask=None)
    c.restoreState()


def draw_image(c: canvas.Canvas, src: str, x: float, y: float, w: float, h: float, background=DARK) -> None:
    path = ASSET_DIR / Path(src).name
    draw_block(c, x, y, w, h, fill=background, stroke=background)
    if not path.exists():
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 10)
        c.drawCentredString(x + w / 2, y + h / 2, "图片缺失")
        return

    image = prepare_image(path, grayscale=False)
    iw, ih = image.size
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(ImageReader(image), x + (w - dw) / 2, y + (h - dh) / 2, width=dw, height=dh)


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
) -> float:
    for item in items:
        c.setStrokeColor(FAINT)
        c.setLineWidth(1)
        c.line(x, y + 4, x + 7, y + 4)
        y = draw_text(
            c,
            item,
            x + 14,
            y,
            width - 14,
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
    draw_texture(c)

    draw_cover_photo(c, PAGE_W - 410, 76, 350, 378)
    draw_label(c, "2027 Campus Recruitment Portfolio", MARGIN, PAGE_H - 106)
    y = draw_title(c, profile["name"], MARGIN, PAGE_H - 148, 390, size=48)
    y = draw_title(c, profile["title"], MARGIN, y - 3, 455, size=24)
    y = draw_text(c, profile["summary"], MARGIN, y - 28, 430, size=11.5, leading=20, color=MUTED, max_lines=3)

    c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    c.line(MARGIN, y - 14, MARGIN + 420, y - 14)

    meta_y = y - 42
    for text in [
        profile["target"],
        profile["location"],
        profile["graduation"],
        f"邮箱：{profile['email']}",
        f"电话：{profile['phone']}",
    ]:
        meta_y = draw_text(c, text, MARGIN, meta_y, 420, font=FONT_BOLD, size=10.2, leading=18, color=TEXT)


def draw_fit_page(c: canvas.Canvas, data: dict, page_no: int) -> None:
    draw_page_base(c, "岗位方向", page_no)
    draw_label(c, "Target Roles", MARGIN, PAGE_H - 76)
    draw_title(c, "主投方向", MARGIN, PAGE_H - 104, 420, size=30)
    draw_text(c, data["profile"]["target"], MARGIN, PAGE_H - 146, 560, size=11, leading=18, color=MUTED)

    card_w = (PAGE_W - MARGIN * 2 - 18) / 2
    y_top = PAGE_H - 270
    for idx, card in enumerate(data["fitCards"]):
        x = MARGIN + (idx % 2) * (card_w + 18)
        y = y_top - (idx // 2) * 118
        draw_block(c, x, y, card_w, 96, fill=HexColor("#f8f8f5"))
        c.setFillColor(GREEN)
        c.rect(x, y + 92, card_w, 4, fill=1, stroke=0)
        c.setFillColor(GREEN)
        c.setFont(FONT_BOLD, 10)
        c.drawString(x + 16, y + 66, card["title"])
        draw_text(c, card["keywords"], x + 16, y + 43, card_w - 32, font=FONT_BOLD, size=15, leading=18, color=INK)
        draw_text(c, card["proof"], x + 16, y + 21, card_w - 32, size=9.2, leading=13, color=MUTED, max_lines=2)


def draw_resume_page(c: canvas.Canvas, data: dict, page_no: int) -> None:
    draw_page_base(c, "简历摘要", page_no)
    resume = data["resume"]
    profile = data["profile"]
    left_x = MARGIN
    right_x = MARGIN + 356

    draw_label(c, "Resume", left_x, PAGE_H - 76)
    draw_title(c, "杨赫然", left_x, PAGE_H - 104, 300, size=32)
    draw_text(c, profile["target"], left_x, PAGE_H - 150, 300, size=10.5, leading=17, color=MUTED)
    draw_text(c, f"{profile['location']}  /  {profile['graduation']}", left_x, PAGE_H - 205, 300, font=FONT_BOLD, size=9.8, leading=15, color=TEXT)
    draw_text(c, f"邮箱：{profile['email']}", left_x, PAGE_H - 232, 300, font=FONT_BOLD, size=9.8, leading=15, color=TEXT)
    draw_text(c, f"电话：{profile['phone']}", left_x, PAGE_H - 252, 300, font=FONT_BOLD, size=9.8, leading=15, color=TEXT)

    y = PAGE_H - 282
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
        tag_x = draw_tag(c, skill, tag_x, tag_y, fill=WHITE, stroke=LINE, color=MUTED)

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 16)
    c.drawString(right_x, PAGE_H - 76, "经历")
    y_right = PAGE_H - 106
    for item in resume["experience"]:
        c.setFillColor(GREEN)
        c.setFont(FONT_BOLD, 9)
        c.drawString(right_x, y_right, item["time"])
        y_right = draw_text(c, item["title"], right_x, y_right - 16, 390, font=FONT_BOLD, size=10.4, leading=15, color=INK)
        y_right = draw_text(c, item["text"], right_x, y_right - 2, 390, size=9.4, leading=14, color=MUTED, max_lines=3) - 10

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 16)
    c.drawString(right_x, 210, "获奖与证书")
    draw_bullets(c, resume["awards"], right_x, 186, 390, size=8.5, leading=12, max_lines_each=2, color=MUTED)


def section_block(c: canvas.Canvas, heading: str, items: list[dict], x: float, y: float, width: float) -> float:
    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 15)
    c.drawString(x, y, heading)
    y -= 26
    for item in items:
        c.setFillColor(GREEN)
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

    draw_label(c, f"{project['year']} / {project['category']}", right_x, PAGE_H - 78)
    y = draw_title(c, project["title"], right_x, PAGE_H - 105, PAGE_W - right_x - MARGIN, size=21)
    y = draw_text(c, project["summary"], right_x, y - 4, PAGE_W - right_x - MARGIN, size=10.3, leading=16, color=MUTED, max_lines=4) - 6

    tag_x = right_x
    tag_y = y
    for tag in project["tags"]:
        next_x = tag_x + pdfmetrics.stringWidth(tag, FONT_BOLD, 8.5) + 28
        if next_x > PAGE_W - MARGIN:
            tag_x = right_x
            tag_y -= 24
        tag_x = draw_tag(c, tag, tag_x, tag_y, fill=WHITE, stroke=LINE, color=MUTED)
    y = tag_y - 30

    y = draw_small_section(c, "项目角色", [project["role"]], right_x, y, PAGE_W - right_x - MARGIN, max_lines_each=3)
    y = draw_small_section(c, "证据与亮点", project["evidence"][:2], right_x, y, PAGE_W - right_x - MARGIN, max_lines_each=2)
    draw_small_section(c, "输出物", [" / ".join(project["outputs"])], right_x, y, PAGE_W - right_x - MARGIN, max_lines_each=2)


def draw_small_section(
    c: canvas.Canvas,
    title: str,
    lines: list[str],
    x: float,
    y: float,
    width: float,
    *,
    max_lines_each: int,
) -> float:
    c.setFillColor(INK)
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
