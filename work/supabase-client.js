/* =========================================================
   ONJI LAB — Supabase Client Bootstrap
   =========================================================
   1) https://supabase.com 에서 무료 프로젝트를 생성하세요.
   2) 프로젝트 대시보드 > Project Settings > API 에서
      "Project URL" 과 "anon public" key를 아래에 입력하세요.
   3) README-ADMIN.md 의 SQL을 SQL Editor에서 1회 실행해
      테이블과 Storage 버킷을 만들어주세요.
   4) 설정 전에는 SUPABASE_ENABLED가 자동으로 false 처리되어
      기존 하드코딩 데이터(projects-data.js 등)로만 동작합니다.
   ========================================================= */

const SUPABASE_URL = "https://pidqkfqsxjsvhwuewogw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LHCkr1YFAZbvm23SoHa_VQ_afRdXWBk";

const SUPABASE_ENABLED =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.startsWith("https://") &&
  typeof SUPABASE_ANON_KEY === "string" &&
  SUPABASE_ANON_KEY.length > 20;

let onjiSupabase = null;

if (SUPABASE_ENABLED && typeof window.supabase !== "undefined") {
  onjiSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else if (!SUPABASE_ENABLED) {
  console.warn(
    "[ONJI LAB] Supabase가 설정되지 않았습니다. supabase-client.js에 URL/key를 입력하면 관리 기능이 활성화됩니다. 현재는 기존 하드코딩 데이터로만 표시됩니다."
  );
}

const ONJI_STORAGE_BUCKET = "onji-media";
