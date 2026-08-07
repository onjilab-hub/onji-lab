# ONJI LAB 관리자 패널 설정 가이드

Node.js/Python 없이도 관리 페이지(`admin.html`)에서 콘텐츠를 수정하면
실제 방문자에게 보이는 사이트에도 반영되도록, 무료 백엔드 서비스인
**Supabase**를 사용합니다. 웹 대시보드에서 몇 번 클릭 + SQL 붙여넣기만
하면 되고, 별도 서버 설치는 필요 없습니다.

---

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속 → 무료 회원가입
2. **New Project** 생성 (리전은 Seoul/Northeast Asia 권장, DB 비밀번호는 안전하게 보관)
3. 프로젝트 생성 완료까지 1~2분 대기

## 2. 테이블 & Storage 버킷 생성 (SQL 1회 실행)

좌측 메뉴 **SQL Editor** → **New query** → 아래 SQL 전체를 붙여넣고 **Run**

```sql
-- 1) 프로젝트(작업물) 테이블
create table if not exists projects (
  id text primary key,
  title text not null,
  category text not null,
  type text not null default 'image',
  thumbnail_url text,
  media_urls jsonb default '[]'::jsonb,
  video_url text,
  client text,
  year text,
  role text,
  desc text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 2) About/Contact 등 사이트 콘텐츠 (key-value)
create table if not exists site_content (
  key text primary key,
  value jsonb not null
);

-- 3) RLS 활성화 + 공개 정책
-- (관리자 로그인 시스템이 없으므로, 이 프로젝트는
--  "누구나 읽고 쓸 수 있음"을 전제로 합니다.
--  admin.html의 비밀번호 게이트는 UI 잠금 수준이며,
--  DB 자체를 완전히 보호하지는 않습니다.
--  더 강한 보안이 필요하면 Supabase Auth 도입을 고려하세요.)
alter table projects enable row level security;
alter table site_content enable row level security;

create policy "public read projects" on projects for select using (true);
create policy "public write projects" on projects for all using (true) with check (true);

create policy "public read site_content" on site_content for select using (true);
create policy "public write site_content" on site_content for all using (true) with check (true);
```

## 3. Storage 버킷 생성 (이미지 업로드용)

1. 좌측 메뉴 **Storage** → **New bucket**
2. 이름: `onji-media`
3. **Public bucket** 체크 (방문자가 이미지를 볼 수 있어야 하므로 공개로 설정)
4. 생성 후, 버킷의 **Policies** 탭에서 아래 정책 추가 (Storage용 SQL Editor에서도 가능):

```sql
create policy "public read media"
on storage.objects for select
using ( bucket_id = 'onji-media' );

create policy "public upload media"
on storage.objects for insert
with check ( bucket_id = 'onji-media' );

create policy "public update media"
on storage.objects for update
using ( bucket_id = 'onji-media' );

create policy "public delete media"
on storage.objects for delete
using ( bucket_id = 'onji-media' );
```

## 4. API 키 연결

1. 좌측 메뉴 **Project Settings** → **API**
2. **Project URL** 과 **anon public** key를 복사
3. 프로젝트 폴더의 `supabase-client.js` 파일을 열어 아래 두 줄을 수정:

```js
const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

4. 저장 후 `index.html`, `admin.html` 등을 브라우저로 열면 자동으로 연동됩니다.
   (키를 입력하지 않으면 기존 하드코딩 데이터로만 정상 동작합니다.)

## 5. 초기 데이터 가져오기 (선택)

`projects-data.js`의 기존 12개 프로젝트를 Supabase로 옮기고 싶다면,
`admin.html`에 접속 후 "새 프로젝트 추가"로 직접 입력하거나,
SQL Editor에서 `insert into projects (...) values (...)` 형태로 직접 넣어도 됩니다.
비워두면 사이트는 계속 `projects-data.js` 값을 fallback으로 사용합니다.

## 6. 관리자 비밀번호 변경

`admin.js` 파일 상단의 아래 값을 원하는 비밀번호로 바꾸세요.

```js
const ADMIN_PASSWORD = "onjilab2024";
```

> 주의: 이 비밀번호는 브라우저에서 확인하는 **간단한 UI 잠금**입니다.
> 소스코드를 열어보면 알 수 있는 수준이므로, 민감한 정보 보호용으로는
> 적합하지 않습니다. 지인/클라이언트가 실수로 페이지를 건드리는 것을
> 막는 정도의 목적으로 설계되었습니다.

## 7. 배포

정적 호스팅(Netlify, Vercel, GitHub Pages 등)에 폴더 전체를 그대로 업로드하면 됩니다.
빌드 과정이 없으므로 파일을 그대로 올리기만 하면 됩니다.
`admin.html`은 검색엔진에 노출되지 않도록 `robots.txt`에서 제외하는 것을 권장합니다.
