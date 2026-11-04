# foodcook-static-module

푸드쿡 관리자(ERP / 대시보드)에 **iframe으로 삽입되는 정적 페이지 모듈**입니다.
정산 대시보드, 통합매출 대시보드, 야채 매입, 사용자 통합 관리, 부분 환불 등록 화면을 제공하며,
GitHub Pages(`finance.cookdashboard.com`)로 배포됩니다.

## 기술 스택

| 구분            | 사용 기술                                            |
| --------------- | ---------------------------------------------------- |
| 프레임워크      | React 19, TypeScript, Vite 6                         |
| 라우팅          | react-router-dom 7 (`HashRouter`)                    |
| 서버 상태       | TanStack Query 5, axios                              |
| 클라이언트 상태 | zustand (alert / confirm / spinner)                  |
| UI              | Tailwind CSS 4, shadcn/ui(Radix UI), lucide-react    |
| 그리드 / 차트   | AG Grid, AG Charts, react-spreadsheet                |
| 기타            | date-fns, dayjs, react-toastify, 카카오 우편번호 API |

## 시작하기

```bash
yarn install        # 패키지 매니저: yarn 1.22.x
yarn dev            # 개발 서버 실행 (--mode development)
```

### 환경 변수

`.env.development` / `.env.production` 파일이 필요합니다. (git에 포함되지 않음)

| 변수                     | 설명                                                            |
| ------------------------ | --------------------------------------------------------------- |
| `VITE_API_URL`           | 대시보드 API 기본 주소 (`API` 인스턴스)                         |
| `VITE_ERP_BASE_URL`      | ERP API 주소 — 야채 매입, 사용자 통합 관리 (`ERP_API` 인스턴스) |
| `VITE_TEST_ERP_BASE_URL` | 테스트 서버 ERP API 주소 (`TEST_ERP_API` 인스턴스)              |
| `VITE_APP_ENV`           | 실행 환경 구분 값                                               |

## 스크립트

| 명령어           | 설명                                       |
| ---------------- | ------------------------------------------ |
| `yarn dev`       | 개발 서버 실행                             |
| `yarn build`     | 타입 체크 후 프로덕션 빌드 (`dist/`)       |
| `yarn build:dev` | 개발 환경 변수로 빌드                      |
| `yarn preview`   | 빌드 결과물 미리보기                       |
| `yarn lint`      | ESLint 검사                                |
| `yarn deploy`    | 프로덕션 빌드 후 `gh-pages`로 `dist/` 배포 |

## 페이지(라우트)

`HashRouter`를 사용하므로 실제 URL은 `https://finance.cookdashboard.com/#/<경로>` 형태입니다.

| 경로                                                              | 화면                     |
| ----------------------------------------------------------------- | ------------------------ |
| `/`, `/integrated`                                                | 매입사 정산 — 통합       |
| `/direct`                                                         | 매입사 정산 — 직매입     |
| `/consignment`                                                    | 매입사 정산 — 위탁매입   |
| `/dashboard/main`                                                 | 통합매출 대시보드 (메인) |
| `/dashboard/sales`                                                | 통합매출 대시보드 (매출) |
| `/purchase/vegetable`                                             | 야채 매입                |
| `/user-management`                                                | 사용자 통합 관리 — 목록  |
| `/user-management/create`                                         | 사용자 등록              |
| `/user-management/:id`                                            | 사용자 상세              |
| `/user-management/:id/edit`                                       | 사용자 정보 수정         |
| `/user-management/:id/sales-company/create`                       | 판매사업자 등록          |
| `/user-management/sales-company/:companyId/edit`                  | 판매사업자 수정          |
| `/user-management/sales-company/:companyId/branch/create`         | 판매 지점 등록           |
| `/user-management/sales-company/:companyId/branch/:branchId/edit` | 판매 지점 수정           |
| `/partial-refund`                                                 | 부분 환불 등록           |

라우트 정의: [src/pages/Root.tsx](src/pages/Root.tsx)

## iframe 연동

부모 창(관리자 페이지)에서 이 모듈을 iframe으로 띄울 때 다음 규칙을 따릅니다.

- **인증 토큰**: 해시 쿼리로 전달합니다. 예) `/#/user-management?token=<JWT>`
  토큰은 `localStorage`의 `iframe_token`에 저장되고, axios 요청 시 `Authorization: Bearer <token>` 헤더로 사용됩니다.
  ([src/utils/token.ts](src/utils/token.ts), [src/libs/api.ts](src/libs/api.ts))
- **테마 변경**: 부모 창에서 `postMessage`로 전달합니다.
  ```js
  iframe.contentWindow.postMessage({ type: 'THEME_CHANGE', theme: 'dark' }, '*');
  ```
  `?parent_origin=<origin>` 쿼리가 있으면 해당 origin의 메시지만 허용하고,
  없으면 처음 `THEME_CHANGE`를 보낸 origin으로 고정됩니다.
  ([src/hooks/useParentOriginMessage.ts](src/hooks/useParentOriginMessage.ts))
- 개발 모드(`yarn dev`)에서는 iframe 외부에서 보기 편하도록 레이아웃에 64px 여백이 적용됩니다.

## 프로젝트 구조

```
src/
├── App.tsx               # QueryClient, 테마, 토큰 저장, 전역 Alert/Confirm/Spinner
├── index.tsx             # React DOM 렌더링
├── components/
│   ├── ui/               # shadcn/ui 기본 컴포넌트
│   └── modules/          # 복합 컴포넌트 (대시보드 카드, 그리드, 다이얼로그, 사용자 관리 폼 등)
├── constants/            # API 경로(api-path.ts), 필터·뱃지·툴팁 상수
├── hooks/                # 페이지별 데이터/폼 훅, 공통 훅(useAlert, useConfirm 등)
├── libs/                 # axios 인스턴스, 도메인별 API 함수, 테이블 포맷 유틸
├── pages/                # 라우트별 페이지
│   ├── purchaser-dashboard/   # 매입사 정산 (integrated / direct / consignment)
│   ├── dashboard/             # 통합매출 대시보드
│   ├── vegetable-purchase/    # 야채 매입
│   ├── user-management/       # 사용자 통합 관리
│   └── partial-refund/        # 부분 환불 등록
├── routes/               # BaseLayout
├── stores/               # zustand 스토어 (alert, confirm, spinner)
├── styles/               # 전역 스타일 (common.css, grid.css)
├── types/                # 타입 정의
└── utils/                # 공통 유틸, 토큰 처리
```

- 경로 별칭: `@/` → `src/`
- 그리드 페이지는 `config/grid-config.ts`(컬럼 정의)와 `config/structure.ts`(데이터 구조)로 설정을 분리합니다.

## 코드 스타일

- Prettier: 작은따옴표, 세미콜론, 들여쓰기 2칸, `printWidth` 100, Tailwind 클래스 자동 정렬
- ESLint: `typescript-eslint`, `react-hooks`, `react-refresh`
