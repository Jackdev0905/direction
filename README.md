# Hiring Task - React Web Application

## 프로젝트 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build

## 사용한 기술 스택
React 18 with TypeScript
Tailwind CSS for styling
React Query for data fetching and state management
Recharts for data visualization
React Router for routing
Axios for API calls
Lucide React for icons

주요 구현 기능
1. 게시판 기능 (CRUD)
게시글 작성, 조회, 수정, 삭제
제목 및 본문 검색
커서 기반 페이지네이션
제목/작성일 기준 정렬
카테고리별 필터링 (NOTICE, QNA, FREE)
금칙어 필터링 (캄보디아, 프놈펜, 불법체류, 텔레그램)

2. 데이터 시각화 기능
인기 커피 브랜드: 바 차트 & 도넛 차트
주간 기분 트렌드: 스택형 바 차트 & 스택형 면적 차트
커피 소비량과 생산성: 멀티라인 차트

3. 인증 시스템
JWT 기반 인증
자동 토큰 갱신
보호된 라우트

### API 엔드포인트
POST /auth/login - 로그인 및 JWT 발급
GET /posts - 게시글 목록 조회
POST /posts - 게시글 작성
GET /posts/{id} - 게시글 상세 조회
PATCH /posts/{id} - 게시글 수정
DELETE /posts/{id} - 게시글 삭제



