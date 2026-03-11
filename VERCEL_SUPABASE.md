# Vercel 배포 + Supabase 연동 방법

## 1. Supabase DB 구조 (이미 적용된 경우)

아래 테이블과 RLS 정책이 적용되어 있으면 됩니다.

```sql
create table if not exists lotto_draws (
  id uuid default gen_random_uuid() primary key,
  numbers integer[] not null,
  bonus integer not null,
  created_at timestamptz default now()
);

alter table lotto_draws enable row level security;

create policy "Allow anonymous insert"
  on lotto_draws for insert to anon with check (true);

create policy "Allow anonymous select"
  on lotto_draws for select to anon using (true);
```

- **numbers**: 메인 6개 번호 배열 (예: `[3, 7, 12, 25, 33, 41]`)
- **bonus**: 보너스 번호
- **created_at**: 자동 저장

---

## 2. Vercel 배포 절차

### (1) GitHub 저장소 연결

1. [vercel.com](https://vercel.com) 로그인
2. **Add New** → **Project**
3. **Import** 할 저장소: `dominosmkt777/20260311`
4. **Root Directory**: 비움
5. **Framework Preset**: Other
6. **Deploy** 클릭

### (2) 배포 후

- Vercel이 부여한 URL(예: `https://20260311.vercel.app`)로 접속
- 이후 `main` 브랜치에 push 할 때마다 자동 재배포됨

---

## 3. Supabase와 Vercel 연동 (환경 변수 사용)

로또 추첨 시 `lotto_draws` 테이블에 저장되려면 **Supabase Project URL**과 **anon key**가 빌드 시 HTML에 주입되어야 합니다.

### Vercel 환경 변수 설정 (권장)

1. Vercel 대시보드 → 해당 프로젝트 → **Settings** → **Environment Variables**
2. 아래 두 개 추가 (Production, Preview, Development 모두 체크 권장):

| Name | Value |
|------|--------|
| `SUPABASE_URL` | `https://xxxxxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | anon public 키 전체 |

3. **Save** 후 **Deployments** → 최신 배포 옆 **⋯** → **Redeploy** 한 번 실행.

- 빌드 시 `build.js`가 이 값들을 `index.html`에 넣고 `dist/`를 만듭니다. 환경 변수 수정 후에는 **재배포**가 필요합니다.

로컬에서만 쓸 때는 `index.html`의 `__SUPABASE_URL__`, `__SUPABASE_ANON_KEY__`를 실제 값으로 바꿔도 됩니다. (배포는 Vercel 환경 변수 사용 권장)

---

## 4. 동작 확인

1. Vercel 배포 URL 접속
2. **번호 추첨하기**로 추첨 진행
3. Supabase 대시보드 → **Table Editor** → **lotto_draws** 에서 새 행 확인  
   - `numbers`, `bonus`, `created_at` 값이 들어오면 연동 성공

---

## 5. 정리

| 항목 | 내용 |
|------|------|
| 저장 시점 | 추첨이 끝날 때마다 자동 `insert` |
| 테이블 | `lotto_draws` (numbers, bonus, created_at) |
| Vercel | GitHub 연동 후 push 시 자동 배포 |
| Supabase 연동 | `index.html`에 URL·anon key만 넣으면 동작 |
