#!/usr/bin/env python3
"""onji.lab AI 활용팁 아카이브 정적 사이트 빌드.
content/guides/*.md + data/guides.json + data/promos.json + assets/ -> dist/
"""
import json, re, os, html, shutil, math
import markdown

ROOT = os.path.dirname(os.path.abspath(__file__))  # _src
DIST = os.path.dirname(ROOT)  # repo root (served by Vercel)
ASSETS = os.path.join(DIST, "assets")
IG = "https://www.instagram.com/onji.lab/"
MAIL = "jinspringg@gmail.com"
CATS = ["AI 영상", "AI 이미지", "자동화", "이커머스", "음성", "할인소식"]
PROMO_CAT = "할인소식"

def load(name):
    return json.load(open(os.path.join(ROOT, "data", name), encoding="utf-8"))

def esc(s):
    return html.escape(str(s or ""), quote=True)

def fmt_date(d):
    return d.replace("-", ". ") if d else ""

# ---------- 본문 변환 ----------
def parse_md(path):
    raw = open(path, encoding="utf-8").read()
    meta, body = {}, raw
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = m.group(2)
    return meta, body

def notion_to_md(body, base=""):
    def img(m):
        src = m.group(1).replace("@/", base)
        if src == "placeholder" or src.startswith("notion-file-block"):
            return '\n<figure class="ph"><span>스크린샷 자리</span></figure>\n'
        return '\n<figure><img src="%s" alt="" loading="lazy"></figure>\n' % esc(src)
    def imgcap(m):
        h = img(m)
        cap = m.group(2).strip()
        return h.replace("</figure>", "<figcaption>%s</figcaption></figure>" % esc(cap)) if cap else h
    body = re.sub(r'<image source="([^"]*)"\s*>(.*?)</image>', imgcap, body, flags=re.S)
    body = body.replace('src="@/', 'src="' + base)
    body = re.sub(r'<image source="([^"]*)"\s*/>', img, body)
    body = re.sub(r"<callout[^>]*>\n?(.*?)\n?</callout>",
                  lambda m: '\n<aside class="callout" markdown="1">\n%s\n</aside>\n' % m.group(1).strip(), body, flags=re.S)
    def tog(m):
        inner = m.group(1).strip("\n")
        first, _, rest = inner.partition("\n")
        return '\n<details class="toggle" markdown="1">\n<summary>%s</summary>\n<div class="tbody" markdown="1">\n\n%s\n\n</div>\n</details>\n' % (first.strip(), rest)
    for _ in range(3):
        body = re.sub(r"<toggle[^>]*>\n?((?:(?!<toggle).)*?)</toggle>", tog, body, flags=re.S)
    return body

def render_body(body, base=""):
    md = markdown.Markdown(extensions=["fenced_code", "tables", "md_in_html", "sane_lists"])
    out = md.convert(notion_to_md(body, base))
    out = re.sub(r"<pre><code([^>]*)>", r'<div class="code"><button type="button" class="copy" data-copy>복사</button><pre><code\1>', out)
    out = out.replace("</code></pre>", "</code></pre></div>")
    out = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', out)
    return out

def read_min(text):
    return max(1, math.ceil(len(re.sub(r"<[^>]+>", "", text)) / 500))

def label_of(title):
    """대표 이미지가 없을 때 썸네일에 쓸 툴 이름."""
    left = title.split("|")[0].strip()
    m = re.findall(r"[A-Za-z][A-Za-z0-9.]*(?:\s[A-Z][A-Za-z0-9.]*)?", title)
    if "|" in title and re.search(r"[A-Za-z]", left):
        return re.sub(r"[^A-Za-z0-9 ×.]", "", left).strip()
    return m[0] if m else ""

# ---------- 레이아웃 ----------
CSS = open(os.path.join(ROOT, "site.css"), encoding="utf-8").read()
JS = open(os.path.join(ROOT, "site.js"), encoding="utf-8").read()

def page(title, body, pre, desc=""):
    return """<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(t)s</title><meta name="description" content="%(d)s">
<meta property="og:title" content="%(t)s"><meta property="og:description" content="%(d)s"><meta property="og:image" content="https://onji-lab.vercel.app/assets/profile.jpg"><meta property="og:type" content="website"><meta name="twitter:card" content="summary">
<link rel="icon" href="%(p)sassets/profile.jpg">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>%(css)s</style></head><body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="top"><div class="wrap topin"><a class="logo" href="%(home)s">onji.lab</a>
<div class="tr"><a class="pill mail" href="mailto:%(mail)s" title="협업·문의 메일"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m3.5 6 6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span class="pm">%(mail)s</span></a><a class="pill dark ig" href="%(ig)s" target="_blank" rel="noopener" aria-label="Instagram"><svg class="igi" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="10" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="14.2" cy="5.8" r="1" fill="currentColor"/></svg><span class="it">Instagram</span><svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 13 13 7M8 7h5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></a></div></div></header>
<main id="main">%(body)s</main>
<footer class="foot"><div class="wrap fin"><div><p class="fl">onji.lab · AI 활용팁 아카이브</p><p>협업·문의 <a href="mailto:%(mail)s">%(mail)s</a></p></div><p><a href="%(ig)s" target="_blank" rel="noopener">Instagram @onji.lab</a> · © 2026</p></div></footer>
<script>%(js)s</script></body></html>""" % dict(t=esc(title), d=esc(desc), p=pre, css=CSS, home=pre or "./", mail=MAIL, ig=IG, body=body, js=JS)

def build():
    for sub in ("guides", "promos"):
        if os.path.isdir(os.path.join(DIST, sub)):
            shutil.rmtree(os.path.join(DIST, sub))
    guides = load("guides.json")
    promos = load("promos.json")

    # 가이드 상세
    for g in guides:
        p = os.path.join(ROOT, "content", "guides", g["slug"] + ".md")
        g["ready"] = os.path.exists(p)
        g["label"] = g.get("label") or label_of(g["title"])
        if not g["ready"]:
            continue
        meta, body = parse_md(p)
        bhtml = render_body(body, "../../assets/g/%s/" % g["slug"])
        g["min"] = read_min(bhtml)
        g["thumb"] = (g.get("thumb") or meta.get("thumb", "")).replace("@/", "assets/g/%s/" % g["slug"])
        if not g["thumb"] and os.path.exists(os.path.join(ASSETS, "g/%s/thumb.jpg" % g["slug"])):
            g["thumb"] = "assets/g/%s/thumb.jpg" % g["slug"]
        g["summary"] = meta.get("summary") or g.get("summary", "")
        tools = meta.get("tools", "")
        rel = [x for x in promos if x.get("guide") == g["slug"]]
        ph = "".join('<a class="promo-mini" href="../../promos/%s/"><span class="tag hot">할인</span>%s · %s</a>' % (esc(x["id"]), esc(x["brand"]), esc(x["title"])) for x in rel)
        art = """<article class="wrap art">
<a class="back" href="../../">← 전체 목록</a>
<p class="meta"><span class="cat">%s</span><span>%s</span><span>%d분</span></p>
<h1>%s</h1><p class="lead">%s</p>%s%s
<div class="body">%s</div>
<div class="endcta"><img src="../../assets/profile.jpg" alt="" width="52" height="52"><p><b>더 많은 AI 활용팁은 인스타그램에서 먼저 올라와요.</b><br><span>협업 문의 %s</span></p><a class="btn light" href="%s" target="_blank" rel="noopener">@onji.lab 팔로우</a></div>
</article>""" % (esc(g["category"]), fmt_date(g["date"]), g["min"], esc(g["title"]), esc(g.get("summary") or meta.get("summary", "")),
               ('<p class="tools">사용 툴 · %s</p>' % esc(tools)) if tools else "", ph, bhtml, MAIL, IG)
        d = os.path.join(DIST, "guides", g["slug"])
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(page(g["title"] + " | onji.lab", art, "../../", g.get("summary", "")))

    # 할인 소식 상세
    for x in promos:
        cl = x.get("codes") or ([["코드", x["code"]]] if x.get("code") else [])
        code = "".join('<p class="codelab">%s</p><div class="codebox"><code>%s</code><button type="button" class="btn" data-copytext="%s">코드 복사</button></div>' % (esc(a), esc(b), esc(b)) for a, b in cl)
        acts = ""
        if x.get("link", "").startswith("https://"):
            acts += '<a class="btn primary" href="%s" target="_blank" rel="noopener">%s 바로가기</a>' % (esc(x["link"]), esc(x["brand"]))
        if x.get("guide"):
            acts += '<a class="btn" href="../../guides/%s/">사용 가이드 보기</a>' % esc(x["guide"])
        art = """<article class="wrap art"><a class="back" href="../../">← 전체 목록</a>
<p class="meta"><span class="cat">%s</span><span>%s</span><span>%s</span></p><h1>%s · %s</h1>%s<p class="lead">%s</p><div class="acts big">%s</div></article>""" % (
            PROMO_CAT, esc(x["brand"]), ('<span class="dl" data-until="%s">~ %s 마감</span>' % (esc(x["until"]), fmt_date(x["until"]))) if x.get("until") else ('<span class="dl">기한 미정 · 공식 사이트에서 확인</span>' if "until" in x else "상시"), esc(x["brand"]), esc(x["title"]), code, esc(x.get("note", "")), acts)
        d = os.path.join(DIST, "promos", x["id"])
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(page("%s %s | onji.lab" % (x["brand"], x["title"]), art, "../../"))

    # 메인
    items = [{"h": "guides/%s/" % g["slug"], "t": g["title"], "d": g["date"], "c": g["category"], "m": g.get("min", 0), "u": g.get("summary", ""),
              "r": g["ready"], "i": g.get("thumb", ""), "l": g["label"]} for g in guides if g["ready"]]
    items += [{"h": x["link"] if x.get("direct") else "promos/%s/" % x["id"], "x": 1 if x.get("direct") else 0, "pin": x.get("pin", 0), "t": "%s · %s" % (x["brand"], x["title"]), "d": x.get("date", ""), "c": PROMO_CAT, "m": 0, "u": x.get("note", ""),
               "r": True, "i": x.get("thumb", ""), "l": x.get("label") or x["brand"], "p": 1, "e": x.get("until")} for x in promos]
    items.sort(key=lambda z: (z.get("pin", 0), z["d"]), reverse=True)
    for z in items:
        z["d"] = fmt_date(z["d"])
    cnt = {c: sum(1 for z in items if z["c"] == c) for c in CATS}
    tiles = '<button type="button" class="tile" data-cat="" aria-pressed="true">전체 <span>%d</span></button>' % len(items)
    for c in CATS:
        tiles += '<button type="button" class="tile" data-cat="%s" aria-pressed="false">%s <span>%d</span></button>' % (esc(c), esc(c), cnt[c])
    home = """<section class="wrap hero">
<h1>AI 활용팁 아카이브</h1>
<div class="prof"><img src="assets/profile.jpg" alt="onji.lab 프로필" width="52" height="52"><div><b>onji.lab <span class="live"><i></i>%d TIPS</span></b><p>온지랩이 정리한 AI툴 사용법과 프롬프트를 모아뒀어요</p></div></div>
</section>
<section class="wrap"><div class="tiles" role="group" aria-label="카테고리">%s</div>
<div class="bar"><label class="search"><span class="sr">검색</span><input id="q" type="search" placeholder="툴 이름, 주제로 찾기"></label></div>
<div id="grid" class="grid"></div><button type="button" id="more" class="btn more" hidden>더 보기</button><p id="empty" class="empty" hidden>찾는 팁이 없어요.</p></section>
<script type="application/json" id="data">%s</script>""" % (len(items), tiles, json.dumps(items, ensure_ascii=False).replace("<", "\\u003c"))
    open(os.path.join(DIST, "index.html"), "w", encoding="utf-8").write(page("onji.lab | AI 활용팁 아카이브", home, "", "온지랩이 정리한 AI툴 사용법과 프롬프트를 모아뒀어요"))
    print("built", len(items), "items,", sum(1 for g in guides if g["ready"]), "guides with body")

if __name__ == "__main__":
    build()
