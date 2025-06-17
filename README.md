# 프로젝트 구조

```
src/
├── App.tsx                # 애플리케이션 진입점
├── index.tsx              # React DOM 렌더링
├── assets/                # 정적 파일 (이미지, 아이콘 등)
├── components/            # 재사용 가능한 UI 컴포넌트
│   ├── atoms/             # 기본 UI 요소 (버튼, 입력 필드 등)
│   ├── modules/           # 복합 UI 컴포넌트
├── constants/             # 상수 및 API 경로
├── libs/                  # 공통 유틸리티 및 헬퍼 함수
├── pages/                 # 페이지별 컴포넌트
│   ├── Root.tsx           # 라우팅 설정
│   ├── consignment-settlement/  # 위탁매입사 정산 관련 페이지
│   ├── integrated-settlement/  # 통합매입사 정산 관련 페이지
├── routes/                # 라우팅 관련 컴포넌트
├── styles/                # 전역 스타일
├── types/                 # 타입 정의
```
