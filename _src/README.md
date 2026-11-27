# onji.lab 아카이브 원본

사이트(https://onji-lab.vercel.app)의 원본 폴더예요. 이 폴더는 배포되지 않아요(.vercelignore).

- 가이드 본문: `content/guides/<slug>.md` (맨 위 summary, tools) — 이미지는 `<image source="@/01.jpg" />`
- 가이드 목록: `data/guides.json` (slug, title, date, category, label)
- 할인소식: `data/promos.json` (until: 마감일 "YYYY-MM-DD", 빈 값이면 기한 미정)
- 이미지: 저장소 루트 `assets/g/<slug>/01.jpg…`, 썸네일 `thumb.jpg`(240px 정사각)
- 빌드: `python3 _src/build.py` → 루트의 index.html, guides/, promos/ 를 다시 만듦 (`work/`, `assets/`는 건드리지 않음)
- 배포: main에 push하면 Vercel이 자동 배포
