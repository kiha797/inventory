# 동원약품 · 일일 재고조사

GitHub `kiha797/inventory`에서 Cloudflare Workers로 배포하는 재고조사 프로그램입니다. 기존 ChatGPT Sites 서비스와 별도의 서버·데이터베이스를 사용합니다.

## 포함 기능

- 한국 날짜 기준으로 매일 조사 목록 자동 생성, 기본 120품목
- 초다빈도(기본 상위 100위), 다빈도, 중빈도, 저빈도 체크박스 선택: 선택한 구간 안에서만 조사량 배정
- 최근 배정 중복 제외, 설정 변경 시 이미 생성된 조사 목록 유지
- 상품 CSV 등록, 실수량 입력, 재고 차이 확인, 재조사·마감, 이력 및 이행률
- 회사별 데이터 분리, 별도의 체험용 데이터

상품과 조사 기록은 Cloudflare D1에 저장됩니다. 실제 회사 데이터, 기존 Sites의 조사 기록, 로그인 정보는 이 저장소에 포함되어 있지 않습니다. 새 배포는 빈 데이터베이스에서 시작합니다.

## Cloudflare에 GitHub 연결

1. Cloudflare에서 **Workers & Pages → Create → Import a repository**를 선택합니다. 이 프로그램은 서버와 D1을 사용하므로 **Workers**로 연결합니다.
2. 저장소 `kiha797/inventory`, 배포 브랜치 `main`, 루트 디렉터리 `/`를 선택합니다.
3. **Storage & databases → D1 → Create database**에서 `inventory-db`를 생성하고 **Database ID**를 복사합니다.
4. 현재 `wrangler.json`에는 전달받은 `inventory-db`의 실제 Database ID가 반영되어 있습니다. `D1_DATABASE_ID` 빌드 변수는 생략할 수 있습니다. 이미 설정했다면 같은 실제 ID인지 확인하거나 삭제하세요. 다른 계정의 D1을 사용하는 경우에는 이 변수에 해당 Database ID를 입력합니다. `NODE_VERSION=24`, `PNPM_VERSION=11.25.0`도 설정합니다.
5. 빌드 명령은 `pnpm run build`, 배포 명령은 `pnpm run deploy`로 입력합니다. 의존성 설치에는 저장소의 pnpm 잠금 파일을 사용합니다. 자동 설치를 사용하지 않는 환경에서는 `pnpm install --frozen-lockfile`을 먼저 실행합니다.
6. 배포용 Cloudflare API 토큰에는 해당 계정의 Workers Scripts Edit와 D1 Edit 권한이 필요합니다. 토큰은 Cloudflare 설정에만 저장하고 GitHub 코드에는 넣지 않습니다.

배포 명령은 SQL 마이그레이션을 먼저 적용하고 성공한 경우에만 Worker를 배포합니다. 저장소의 `wrangler.json`에는 실제 Database ID가 들어 있습니다. `D1_DATABASE_ID`를 설정하면 저장소의 ID보다 우선하므로 가상 ID나 다른 데이터베이스의 ID를 입력하지 마세요.

## inventory.ipharmkorea.com 연결

이 앱 자체에는 직원 로그인이나 권한 구분이 없습니다. 화면의 작업자 이름은 조사 이력용 입력값입니다. 기존 Sites의 접근 제한은 독립 배포로 이전되지 않습니다.

1. Cloudflare Zero Trust에서 **Access → Applications**에 `inventory.ipharmkorea.com`을 등록하고, 허용할 직원 이메일/그룹만 접속하도록 정책을 설정합니다. API 경로 `/api/inventory`도 같은 호스트 정책으로 보호합니다.
2. `inventory` Worker의 **Settings → Domains & Routes → Add → Custom Domain**에 `inventory.ipharmkorea.com`을 입력합니다.
3. 직원 계정으로 접속해 화면과 저장 기능을 확인하고, 로그인하지 않은 브라우저에서 재고 API에 접근할 수 없는지도 확인한 후 실제 상품 CSV를 등록합니다.

연결을 완료한 뒤에는 `wrangler.json`에도 아래 항목을 추가하고 GitHub에 저장해 다음 배포에서도 도메인 설정을 유지합니다. 접근 정책을 먼저 설정한 후 추가하세요.

```json
"routes": [{ "pattern": "inventory.ipharmkorea.com", "custom_domain": true }]
```

접근 보호를 설정하기 전에는 실제 회사 데이터를 등록하지 마세요. 기본 설정은 `workers.dev` 주소와 미리보기 주소를 비활성화하며, 도메인은 위 단계에서 직접 연결합니다. 카페24의 루트 도메인·www·메일 설정은 그대로 두고 inventory 하위 도메인만 연결합니다. Sites에서 안내받았던 도메인 연결값은 이 Worker 배포에 사용하지 않습니다.

다른 하위 도메인에 다른 프로그램을 운영할 때는 해당 저장소의 Worker를 별도로 생성하고 그 Worker에 도메인을 연결하면 됩니다.

## 로컬 실행

Node.js 22.13 이상(24 권장), pnpm 11.25.0을 사용합니다.

```bash
pnpm install --frozen-lockfile
pnpm db:local
pnpm dev
```

로컬 D1과 실제 D1은 별개입니다. 원격 배포를 CLI에서 진행할 때는 `pnpm exec wrangler login` 후 `pnpm build`, `pnpm deploy` 순서로 실행합니다. `pnpm db:local`과 `pnpm dev`는 로컬 데이터를 사용하며 원격 데이터에 연결하지 않습니다.

## 검증

```bash
pnpm typecheck
pnpm build
```

내보내기 기준 Sites 소스 커밋: `6c469a672c302f3967ea95cea08fe031893d5695`.

Cloudflare 공식 안내: [Git 통합](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/), [D1 마이그레이션](https://developers.cloudflare.com/d1/reference/migrations/), [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Access 보호](https://developers.cloudflare.com/workers/configuration/cloudflare-access/).
