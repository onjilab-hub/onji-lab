/* =========================================================
   ONJI LAB — Site Scripts
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initGallery();
});

/* ---------- Mobile Nav Toggle ---------- */
function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("is-active");
    menu.classList.toggle("is-open");
  });

  menu.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("is-active");
      menu.classList.remove("is-open");
    });
  });
}

/* ---------- Play Icon SVG ---------- */
const PLAY_ICON = `<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8V4z"/></svg>`;

/* ---------- Gallery Rendering & Filtering ---------- */
let galleryEventsBound = false;

function initGallery() {
  const grid = document.querySelector(".gallery");
  if (!grid || typeof ONJI_PROJECTS === "undefined") return;

  // Render cards
  grid.innerHTML = ONJI_PROJECTS.map(cardTemplate).join("");

  // 필터/카드 클릭 리스너와 상세 오버레이는 최초 1회만 바인딩
  // (initGallery가 Supabase 데이터 로드 후 재호출되어도 중복 등록되지 않도록)
  if (galleryEventsBound) return;
  galleryEventsBound = true;

  // Filter pills
  const pills = document.querySelectorAll(".filter-pill");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      const cat = pill.dataset.category;
      filterCards(cat);
    });
  });

  // Card click -> open detail
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    openDetail(card.dataset.id);
  });

  initDetailOverlay();
}

function cardTemplate(p) {
  const thumbStyle = p.thumbnailUrl
    ? `background-image:url('${p.thumbnailUrl}');background-size:cover;background-position:center;`
    : `background:${p.gradient}`;
  return `
    <div class="card" data-id="${p.id}" data-category="${p.category}" tabindex="0">
      <div class="card__thumb" style="${thumbStyle}"></div>
      ${p.type === "video" ? `<span class="card__play">${PLAY_ICON}</span>` : ""}
      <div class="card__overlay">
        <span class="card__tag">${p.category}</span>
        <span class="card__title">${p.title}</span>
      </div>
    </div>
  `;
}

function filterCards(category) {
  const cards = document.querySelectorAll(".gallery .card");
  cards.forEach((card) => {
    const match = category === "All" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !match);
  });
}

/* ---------- Project Detail Overlay ---------- */
function initDetailOverlay() {
  const overlay = document.querySelector(".detail");
  if (!overlay) return;

  const closeBtn = overlay.querySelector(".detail__close");
  const backBtn = overlay.querySelector(".detail__back");

  const close = () => {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", close);
  backBtn?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });
}

function openDetail(id) {
  const overlay = document.querySelector(".detail");
  const project = ONJI_PROJECTS.find((p) => p.id === id);
  if (!overlay || !project) return;

  overlay.querySelector(".detail__eyebrow").textContent = project.category;
  overlay.querySelector(".detail__name").textContent = project.title;
  overlay.querySelector(".detail__desc").textContent = project.desc;
  overlay.querySelector('[data-meta="client"]').textContent = project.client;
  overlay.querySelector('[data-meta="year"]').textContent = project.year;
  overlay.querySelector('[data-meta="role"]').textContent = project.role;

  const galleryEl = overlay.querySelector(".detail__gallery");

  if (project.videoUrl) {
    galleryEl.innerHTML = `
      <div class="g-item full" style="aspect-ratio:16/9;">
        <iframe src="${toEmbedUrl(project.videoUrl)}" style="width:100%;height:100%;border:0;" allow="autoplay; fullscreen" allowfullscreen></iframe>
      </div>
      ${(project.mediaUrls || []).map((url) => `<div class="g-item" style="aspect-ratio:1/1;"><img src="${url}" alt="${project.title}" /></div>`).join("")}
    `;
  } else if (project.mediaUrls && project.mediaUrls.length > 0) {
    galleryEl.innerHTML = project.mediaUrls
      .map(
        (url, i) =>
          `<div class="g-item ${i === 0 ? "full" : ""}" style="aspect-ratio:${i === 0 ? "16/9" : "1/1"};"><img src="${url}" alt="${project.title}" /></div>`
      )
      .join("");
  } else {
    const shades = buildShadeSet(project.gradient);
    galleryEl.innerHTML = `
      <div class="g-item full" style="background:${project.gradient};aspect-ratio:16/9;"></div>
      <div class="g-item" style="background:${shades[0]};aspect-ratio:1/1;"></div>
      <div class="g-item" style="background:${shades[1]};aspect-ratio:1/1;"></div>
      <div class="g-item full" style="background:${shades[2]};aspect-ratio:16/9;"></div>
    `;
  }

  overlay.classList.add("is-open");
  overlay.scrollTop = 0;
  document.body.style.overflow = "hidden";
}

function toEmbedUrl(url) {
  if (!url) return "";
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function buildShadeSet(gradient) {
  // Derive simple variant backgrounds from the base gradient for the detail gallery
  return [
    gradient.replace("155deg", "45deg"),
    gradient.replace("160deg", "220deg").replace("150deg", "210deg"),
    gradient.replace("155deg", "300deg").replace("160deg", "300deg").replace("150deg", "300deg"),
  ];
}
