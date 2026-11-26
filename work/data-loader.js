/* =========================================================
   ONJI LAB — Public Data Loader
   방문자 페이지(index/about/contact)에서 Supabase의 최신 데이터를
   가져와 화면을 갱신합니다. Supabase가 설정되지 않았거나 요청이
   실패하면 기존 하드코딩 데이터를 그대로 사용합니다(안전한 폴백).
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!onjiSupabase) return; // 미설정 시 기존 데이터 그대로 사용

  const page = document.body.dataset.page;
  if (page === "home") loadHomeFromSupabase();
  if (page === "about") loadAboutFromSupabase();
  if (page === "contact") loadContactFromSupabase();
});

/* ---------------------------------------------------------
   Home: projects
--------------------------------------------------------- */
async function loadHomeFromSupabase() {
  try {
    const { data, error } = await onjiSupabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return;

    // 기존 ONJI_PROJECTS 형식으로 변환
    window.ONJI_PROJECTS = data.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      type: row.type,
      gradient: "linear-gradient(155deg, #f0e0a8, #d99a6c)", // fallback thumb 배경
      thumbnailUrl: row.thumbnail_url || "",
      mediaUrls: Array.isArray(row.media_urls) ? row.media_urls : [],
      videoUrl: row.video_url || "",
      client: row.client || "",
      year: row.year || "",
      role: row.role || "",
      desc: row.desc || "",
    }));

    // script.js의 initGallery가 이미 실행되었을 수 있으므로 다시 렌더링
    if (typeof initGallery === "function") {
      initGallery();
    }
  } catch (e) {
    console.warn("[ONJI LAB] Supabase 프로젝트 로드 실패, 기존 데이터 유지:", e);
  }
}

/* ---------------------------------------------------------
   About
--------------------------------------------------------- */
async function loadAboutFromSupabase() {
  try {
    const { data, error } = await onjiSupabase
      .from("site_content")
      .select("value")
      .eq("key", "about")
      .maybeSingle();

    if (error || !data || !data.value) return;
    const v = data.value;

    const eyebrowEl = document.querySelector(".about__eyebrow");
    const titleEl = document.querySelector(".about__title");
    const textEls = document.querySelectorAll(".about__text");
    const statNums = document.querySelectorAll(".about__stat-num");
    const statLabels = document.querySelectorAll(".about__stat-label");
    const portraitEl = document.querySelector(".about__portrait");

    if (eyebrowEl && v.eyebrow) eyebrowEl.textContent = v.eyebrow;
    if (titleEl && v.title) titleEl.innerHTML = escapeHtmlLoader(v.title).replace(/\n/g, "<br />");
    if (textEls[0] && v.text1) textEls[0].textContent = v.text1;
    if (textEls[1] && v.text2) textEls[1].textContent = v.text2;

    if (Array.isArray(v.stats)) {
      v.stats.forEach((stat, idx) => {
        if (statNums[idx]) statNums[idx].textContent = stat.num;
        if (statLabels[idx]) statLabels[idx].textContent = stat.label;
      });
    }

    if (portraitEl && v.portrait_url) {
      portraitEl.innerHTML = `<img src="${v.portrait_url}" alt="ONJI LAB profile" style="width:100%;height:100%;object-fit:cover;" />`;
    }
  } catch (e) {
    console.warn("[ONJI LAB] Supabase About 로드 실패, 기존 데이터 유지:", e);
  }
}

/* ---------------------------------------------------------
   Contact
--------------------------------------------------------- */
async function loadContactFromSupabase() {
  try {
    const { data, error } = await onjiSupabase
      .from("site_content")
      .select("value")
      .eq("key", "contact")
      .maybeSingle();

    if (error || !data || !data.value) return;
    const v = data.value;

    const eyebrowEl = document.querySelector(".contact__eyebrow");
    const titleEl = document.querySelector(".contact__title");
    const textEl = document.querySelector(".contact__text");
    const emailEl = document.querySelector(".contact__email");
    const socialsEl = document.querySelector(".contact__socials");

    if (eyebrowEl && v.eyebrow) eyebrowEl.textContent = v.eyebrow;
    if (titleEl && v.title) titleEl.innerHTML = escapeHtmlLoader(v.title).replace(/\n/g, "<br />");
    if (textEl && v.text) textEl.textContent = v.text;
    if (emailEl && v.email) {
      emailEl.textContent = v.email;
      emailEl.href = `mailto:${v.email}`;
    }
    if (socialsEl && Array.isArray(v.links)) {
      socialsEl.innerHTML = v.links
        .map((link) => `<a href="${escapeHtmlLoader(link.url || "#")}" class="contact__social">${escapeHtmlLoader(link.label || "")}</a>`)
        .join("");
    }
  } catch (e) {
    console.warn("[ONJI LAB] Supabase Contact 로드 실패, 기존 데이터 유지:", e);
  }
}

function escapeHtmlLoader(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
