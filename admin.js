/* =========================================================
   ONJI LAB — Admin Panel Logic
   ========================================================= */

/* 관리자 비밀번호 (간단한 UI 잠금 수준입니다. README-ADMIN.md 참고) */
const ADMIN_PASSWORD = "onjilab2024";
const SESSION_KEY = "onji_admin_unlocked";

let currentProjects = [];
let draggedId = null;

document.addEventListener("DOMContentLoaded", () => {
  initGate();
  initTabs();
  initProjectModal();
  initAboutForm();
  initContactForm();
  checkSupabaseStatus();
});

/* ---------------------------------------------------------
   Toast
--------------------------------------------------------- */
function showToast(message, isError = false) {
  const toast = document.getElementById("adminToast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("is-show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("is-show"), 2600);
}

/* ---------------------------------------------------------
   Password Gate
--------------------------------------------------------- */
function initGate() {
  const gate = document.getElementById("adminGate");
  const shell = document.getElementById("adminShell");
  const input = document.getElementById("gatePassword");
  const submit = document.getElementById("gateSubmit");
  const error = document.getElementById("gateError");
  const logoutBtn = document.getElementById("logoutBtn");

  const unlock = () => {
    gate.classList.add("is-hidden");
    shell.classList.add("is-active");
    loadAllData();
  };

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    unlock();
  }

  const tryUnlock = () => {
    if (input.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      error.textContent = "";
      unlock();
    } else {
      error.textContent = "비밀번호가 올바르지 않습니다.";
    }
  };

  submit.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });
}

/* ---------------------------------------------------------
   Tabs
--------------------------------------------------------- */
function initTabs() {
  const tabs = document.querySelectorAll(".admin-tab");
  const panels = document.querySelectorAll(".admin-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const name = tab.dataset.tab;
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === name));
    });
  });
}

/* ---------------------------------------------------------
   Supabase / Cloudinary Status
--------------------------------------------------------- */
function checkSupabaseStatus() {
  const el = document.getElementById("dbStatus");
  if (!el) return;
  const dbLabel = onjiSupabase ? "Supabase 연결됨" : "Supabase 미설정 (로컬 데이터만 표시)";
  const uploadLabel = CLOUDINARY_ENABLED ? "Cloudinary 연결됨" : "Cloudinary 미설정 (이미지 업로드 불가)";
  el.textContent = `${dbLabel} · ${uploadLabel}`;
  el.classList.toggle("is-online", !!onjiSupabase && CLOUDINARY_ENABLED);
}

/* ---------------------------------------------------------
   Load All Data
--------------------------------------------------------- */
async function loadAllData() {
  await loadProjects();
  await loadAboutContent();
  await loadContactContent();
}

/* ---------------------------------------------------------
   Image Upload Helper (Cloudinary Unsigned Upload)
--------------------------------------------------------- */
async function uploadImageFile(file) {
  if (!CLOUDINARY_ENABLED) {
    showToast("Cloudinary가 설정되지 않아 업로드할 수 없습니다. cloudinary-config.js를 확인하세요.", true);
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      showToast("이미지 업로드 실패: " + (data.error?.message || "알 수 없는 오류"), true);
      return null;
    }
    return data.secure_url;
  } catch (e) {
    showToast("이미지 업로드 실패: " + e.message, true);
    return null;
  }
}

function buildUploadWidget(container, urls, onChange, multiple) {
  container.innerHTML = "";

  urls.forEach((url, idx) => {
    const item = document.createElement("div");
    item.className = "admin-upload__item";
    item.style.backgroundImage = `url(${url})`;
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "admin-upload__remove";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      urls.splice(idx, 1);
      buildUploadWidget(container, urls, onChange, multiple);
      onChange(urls);
    });
    item.appendChild(removeBtn);
    container.appendChild(item);
  });

  if (multiple || urls.length === 0) {
    const addLabel = document.createElement("label");
    addLabel.className = "admin-upload__add";
    addLabel.innerHTML = `<span class="admin-upload__add-icon">+</span><span>이미지 추가</span>`;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = multiple;
    input.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      showToast("업로드 중...");
      for (const file of files) {
        const url = await uploadImageFile(file);
        if (url) {
          if (!multiple) urls.length = 0;
          urls.push(url);
        }
      }
      buildUploadWidget(container, urls, onChange, multiple);
      onChange(urls);
      showToast("업로드 완료");
    });
    addLabel.appendChild(input);
    container.appendChild(addLabel);
  }
}

/* ---------------------------------------------------------
   Projects: Load / Render
--------------------------------------------------------- */
async function loadProjects() {
  if (onjiSupabase) {
    const { data, error } = await onjiSupabase.from("projects").select("*").order("sort_order", { ascending: true });
    if (!error && data) {
      currentProjects = data.map(normalizeProjectFromDb);
      renderProjectList();
      return;
    }
    if (error) console.warn("[ONJI LAB admin] projects fetch error:", error.message);
  }
  // Fallback: 기존 하드코딩 데이터
  currentProjects = (typeof ONJI_PROJECTS !== "undefined" ? ONJI_PROJECTS : []).map((p, i) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    type: p.type,
    thumbnail_url: "",
    media_urls: [],
    video_url: "",
    client: p.client,
    year: p.year,
    role: p.role,
    desc: p.desc,
    sort_order: i,
    _gradient: p.gradient,
  }));
  renderProjectList();
}

function normalizeProjectFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    type: row.type,
    thumbnail_url: row.thumbnail_url || "",
    media_urls: Array.isArray(row.media_urls) ? row.media_urls : [],
    video_url: row.video_url || "",
    client: row.client || "",
    year: row.year || "",
    role: row.role || "",
    desc: row.desc || "",
    sort_order: row.sort_order ?? 0,
  };
}

function renderProjectList() {
  const list = document.getElementById("projectList");
  if (!list) return;

  if (currentProjects.length === 0) {
    list.innerHTML = `<div class="admin-empty">아직 등록된 프로젝트가 없습니다. "새 프로젝트 추가"를 눌러 시작하세요.</div>`;
    return;
  }

  list.innerHTML = currentProjects
    .map((p) => {
      const thumbStyle = p.thumbnail_url
        ? `background-image:url(${p.thumbnail_url})`
        : p._gradient
        ? `background:${p._gradient}`
        : "";
      return `
      <div class="admin-card" draggable="true" data-id="${p.id}">
        <span class="admin-card__handle">&#8942;&#8942;</span>
        <div class="admin-card__thumb" style="${thumbStyle}"></div>
        <div class="admin-card__body">
          <div class="admin-card__title">${escapeHtml(p.title)}</div>
          <div class="admin-card__meta">
            <span class="admin-card__tag">${escapeHtml(p.category)}</span>
            <span>${p.type === "video" ? "영상" : "이미지"}</span>
          </div>
        </div>
        <div class="admin-card__actions">
          <button class="admin-btn admin-btn--ghost admin-btn--sm" data-action="edit" data-id="${p.id}">수정</button>
        </div>
      </div>
    `;
    })
    .join("");

  list.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => openProjectModal(btn.dataset.id));
  });

  initDragSort(list);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* ---------------------------------------------------------
   Drag Sort
--------------------------------------------------------- */
function initDragSort(list) {
  const cards = list.querySelectorAll(".admin-card");

  cards.forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedId = card.dataset.id;
      card.classList.add("is-dragging");
    });
    card.addEventListener("dragend", async () => {
      card.classList.remove("is-dragging");
      await persistOrder(list);
    });
    card.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = list.querySelector(".is-dragging");
      if (!dragging || dragging === card) return;
      const rect = card.getBoundingClientRect();
      const before = e.clientY - rect.top < rect.height / 2;
      list.insertBefore(dragging, before ? card : card.nextSibling);
    });
  });
}

async function persistOrder(list) {
  const ids = Array.from(list.querySelectorAll(".admin-card")).map((c) => c.dataset.id);
  currentProjects.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  currentProjects.forEach((p, idx) => (p.sort_order = idx));

  if (onjiSupabase) {
    const updates = currentProjects.map((p) => ({ id: p.id, sort_order: p.sort_order }));
    for (const u of updates) {
      await onjiSupabase.from("projects").update({ sort_order: u.sort_order }).eq("id", u.id);
    }
    showToast("순서가 저장되었습니다.");
  } else {
    showToast("Supabase 미설정: 순서 변경이 저장되지 않습니다.", true);
  }
}

/* ---------------------------------------------------------
   Project Modal
--------------------------------------------------------- */
let modalThumbUrls = [];
let modalMediaUrls = [];

function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const addBtn = document.getElementById("addProjectBtn");
  const closeBtn = document.getElementById("modalClose");
  const cancelBtn = document.getElementById("cancelProjectBtn");
  const saveBtn = document.getElementById("saveProjectBtn");
  const deleteBtn = document.getElementById("deleteProjectBtn");
  const typeSelect = document.getElementById("pType");
  const videoField = document.getElementById("pVideoUrlField");

  const close = () => modal.classList.remove("is-open");

  addBtn.addEventListener("click", () => openProjectModal(null));
  closeBtn.addEventListener("click", close);
  cancelBtn.addEventListener("click", close);

  typeSelect.addEventListener("change", () => {
    videoField.style.display = typeSelect.value === "video" ? "" : "none";
  });

  saveBtn.addEventListener("click", saveProject);
  deleteBtn.addEventListener("click", deleteProject);
}

function openProjectModal(id) {
  const modal = document.getElementById("projectModal");
  const title = document.getElementById("modalTitle");
  const deleteBtn = document.getElementById("deleteProjectBtn");
  const project = id ? currentProjects.find((p) => p.id === id) : null;

  document.getElementById("projectId").value = project ? project.id : "";
  document.getElementById("pTitle").value = project ? project.title : "";
  document.getElementById("pCategory").value = project ? project.category : "Product";
  document.getElementById("pType").value = project ? project.type : "image";
  document.getElementById("pVideoUrl").value = project ? project.video_url : "";
  document.getElementById("pClient").value = project ? project.client : "";
  document.getElementById("pYear").value = project ? project.year : "";
  document.getElementById("pRole").value = project ? project.role : "";
  document.getElementById("pDesc").value = project ? project.desc : "";

  document.getElementById("pVideoUrlField").style.display =
    (project ? project.type : "image") === "video" ? "" : "none";

  modalThumbUrls = project && project.thumbnail_url ? [project.thumbnail_url] : [];
  modalMediaUrls = project && project.media_urls ? [...project.media_urls] : [];

  buildUploadWidget(document.getElementById("pThumbUpload"), modalThumbUrls, (urls) => (modalThumbUrls = urls), false);
  buildUploadWidget(document.getElementById("pMediaUpload"), modalMediaUrls, (urls) => (modalMediaUrls = urls), true);

  title.textContent = project ? "프로젝트 수정" : "새 프로젝트 추가";
  deleteBtn.style.display = project ? "" : "none";

  modal.classList.add("is-open");
}

async function saveProject() {
  const id = document.getElementById("projectId").value || `p${Date.now()}`;
  const payload = {
    id,
    title: document.getElementById("pTitle").value.trim(),
    category: document.getElementById("pCategory").value,
    type: document.getElementById("pType").value,
    thumbnail_url: modalThumbUrls[0] || "",
    media_urls: modalMediaUrls,
    video_url: document.getElementById("pVideoUrl").value.trim(),
    client: document.getElementById("pClient").value.trim(),
    year: document.getElementById("pYear").value.trim(),
    role: document.getElementById("pRole").value.trim(),
    desc: document.getElementById("pDesc").value.trim(),
  };

  if (!payload.title) {
    showToast("제목을 입력해주세요.", true);
    return;
  }

  const existingIdx = currentProjects.findIndex((p) => p.id === id);
  payload.sort_order = existingIdx >= 0 ? currentProjects[existingIdx].sort_order : currentProjects.length;

  if (onjiSupabase) {
    const { error } = await onjiSupabase.from("projects").upsert(payload);
    if (error) {
      showToast("저장 실패: " + error.message, true);
      return;
    }
  } else {
    showToast("Supabase 미설정: 저장이 영구 반영되지 않습니다.", true);
  }

  if (existingIdx >= 0) {
    currentProjects[existingIdx] = payload;
  } else {
    currentProjects.push(payload);
  }

  document.getElementById("projectModal").classList.remove("is-open");
  renderProjectList();
  showToast("프로젝트가 저장되었습니다.");
}

async function deleteProject() {
  const id = document.getElementById("projectId").value;
  if (!id) return;
  if (!confirm("이 프로젝트를 삭제하시겠습니까?")) return;

  if (onjiSupabase) {
    const { error } = await onjiSupabase.from("projects").delete().eq("id", id);
    if (error) {
      showToast("삭제 실패: " + error.message, true);
      return;
    }
  }

  currentProjects = currentProjects.filter((p) => p.id !== id);
  document.getElementById("projectModal").classList.remove("is-open");
  renderProjectList();
  showToast("프로젝트가 삭제되었습니다.");
}

/* ---------------------------------------------------------
   About Content
--------------------------------------------------------- */
let aboutPortraitUrls = [];

function initAboutForm() {
  document.getElementById("saveAboutBtn").addEventListener("click", saveAboutContent);
}

async function loadAboutContent() {
  let value = null;
  if (onjiSupabase) {
    const { data, error } = await onjiSupabase.from("site_content").select("value").eq("key", "about").maybeSingle();
    if (!error && data) value = data.value;
  }

  value = value || {
    eyebrow: "About Onji Lab",
    title: "이미지와 영상으로\n브랜드의 무드를 짓는,\nONJI LAB입니다.",
    text1:
      "ONJI LAB은 제품, 프로모션, 모션그래픽, 애니메이션까지—비주얼 콘텐츠 전 영역을 아우르는 크리에이티브 스튜디오입니다. 블랙 앤 화이트를 기본 톤으로, 절제된 포인트 컬러 하나로 브랜드가 가진 고유한 온도를 전달하는 것을 목표로 합니다.",
    text2:
      "작은 오브젝트 하나부터 시퀀스 전체의 리듬까지, 디테일을 놓치지 않는 태도로 작업합니다. 매 프로젝트마다 클라이언트의 이야기를 가장 정확한 비주얼 언어로 번역하는 것—그것이 저희의 일입니다.",
    portrait_url: "",
    stats: [
      { num: "40+", label: "Completed Projects" },
      { num: "12", label: "Brand Partners" },
      { num: "4", label: "Content Categories" },
    ],
  };

  document.getElementById("aboutEyebrow").value = value.eyebrow || "";
  document.getElementById("aboutTitle").value = value.title || "";
  document.getElementById("aboutText1").value = value.text1 || "";
  document.getElementById("aboutText2").value = value.text2 || "";

  aboutPortraitUrls = value.portrait_url ? [value.portrait_url] : [];
  buildUploadWidget(
    document.getElementById("aboutPortraitUpload"),
    aboutPortraitUrls,
    (urls) => (aboutPortraitUrls = urls),
    false
  );

  renderAboutStats(value.stats || []);
}

function renderAboutStats(stats) {
  const container = document.getElementById("aboutStats");
  container.innerHTML = "";
  stats.forEach((stat, idx) => {
    const row = document.createElement("div");
    row.className = "admin-stat-row";
    row.innerHTML = `
      <input type="text" class="admin-input" placeholder="숫자 (예: 40+)" value="${escapeHtml(stat.num)}" data-field="num" />
      <input type="text" class="admin-input" placeholder="라벨 (예: Completed Projects)" value="${escapeHtml(stat.label)}" data-field="label" />
      <button type="button" class="admin-btn admin-btn--danger admin-btn--sm" data-action="remove">삭제</button>
    `;
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      stats.splice(idx, 1);
      renderAboutStats(stats);
    });
    container.appendChild(row);
    container._stats = stats;
  });

  if (!container.querySelector(".admin-add-row")) {
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "admin-btn admin-btn--ghost admin-btn--sm admin-add-row";
    addBtn.textContent = "+ 통계 추가";
    addBtn.addEventListener("click", () => {
      stats.push({ num: "", label: "" });
      renderAboutStats(stats);
    });
    container.appendChild(addBtn);
  }
}

function collectAboutStats() {
  const container = document.getElementById("aboutStats");
  const rows = container.querySelectorAll(".admin-stat-row");
  return Array.from(rows).map((row) => ({
    num: row.querySelector('[data-field="num"]').value.trim(),
    label: row.querySelector('[data-field="label"]').value.trim(),
  }));
}

async function saveAboutContent() {
  const value = {
    eyebrow: document.getElementById("aboutEyebrow").value.trim(),
    title: document.getElementById("aboutTitle").value,
    text1: document.getElementById("aboutText1").value.trim(),
    text2: document.getElementById("aboutText2").value.trim(),
    portrait_url: aboutPortraitUrls[0] || "",
    stats: collectAboutStats(),
  };

  if (onjiSupabase) {
    const { error } = await onjiSupabase.from("site_content").upsert({ key: "about", value });
    if (error) {
      showToast("저장 실패: " + error.message, true);
      return;
    }
  } else {
    showToast("Supabase 미설정: 저장이 영구 반영되지 않습니다.", true);
    return;
  }

  showToast("About 페이지가 저장되었습니다.");
}

/* ---------------------------------------------------------
   Contact Content
--------------------------------------------------------- */
function initContactForm() {
  document.getElementById("saveContactBtn").addEventListener("click", saveContactContent);
  document.getElementById("addLinkBtn").addEventListener("click", () => {
    const container = document.getElementById("contactLinks");
    const links = container._links || [];
    links.push({ label: "", url: "" });
    renderContactLinks(links);
  });
}

async function loadContactContent() {
  let value = null;
  if (onjiSupabase) {
    const { data, error } = await onjiSupabase.from("site_content").select("value").eq("key", "contact").maybeSingle();
    if (!error && data) value = data.value;
  }

  value = value || {
    eyebrow: "Get in Touch",
    title: "함께 만들고 싶은\n이야기가 있다면",
    text: "프로젝트 문의는 이메일로 편하게 남겨주세요.",
    email: "hello@onjilab.com",
    links: [
      { label: "Instagram", url: "#" },
      { label: "Behance", url: "#" },
      { label: "Vimeo", url: "#" },
      { label: "LinkedIn", url: "#" },
    ],
  };

  document.getElementById("contactEyebrow").value = value.eyebrow || "";
  document.getElementById("contactTitle").value = value.title || "";
  document.getElementById("contactText").value = value.text || "";
  document.getElementById("contactEmail").value = value.email || "";

  renderContactLinks(value.links || []);
}

function renderContactLinks(links) {
  const container = document.getElementById("contactLinks");
  container._links = links;
  container.innerHTML = "";
  links.forEach((link, idx) => {
    const row = document.createElement("div");
    row.className = "admin-link-row";
    row.innerHTML = `
      <input type="text" class="admin-input" placeholder="이름 (예: Instagram)" value="${escapeHtml(link.label)}" data-field="label" />
      <input type="text" class="admin-input" placeholder="URL" value="${escapeHtml(link.url)}" data-field="url" />
      <button type="button" class="admin-btn admin-btn--danger admin-btn--sm" data-action="remove">삭제</button>
    `;
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      links.splice(idx, 1);
      renderContactLinks(links);
    });
    container.appendChild(row);
  });
}

function collectContactLinks() {
  const container = document.getElementById("contactLinks");
  const rows = container.querySelectorAll(".admin-link-row");
  return Array.from(rows).map((row) => ({
    label: row.querySelector('[data-field="label"]').value.trim(),
    url: row.querySelector('[data-field="url"]').value.trim(),
  }));
}

async function saveContactContent() {
  const value = {
    eyebrow: document.getElementById("contactEyebrow").value.trim(),
    title: document.getElementById("contactTitle").value,
    text: document.getElementById("contactText").value.trim(),
    email: document.getElementById("contactEmail").value.trim(),
    links: collectContactLinks(),
  };

  if (onjiSupabase) {
    const { error } = await onjiSupabase.from("site_content").upsert({ key: "contact", value });
    if (error) {
      showToast("저장 실패: " + error.message, true);
      return;
    }
  } else {
    showToast("Supabase 미설정: 저장이 영구 반영되지 않습니다.", true);
    return;
  }

  showToast("Contact 페이지가 저장되었습니다.");
}
