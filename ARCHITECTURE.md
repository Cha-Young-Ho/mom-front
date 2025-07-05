# 🏗️ 가족지원센터 웹사이트 아키텍처

## 📊 전체 시스템 아키텍처

```mermaid
graph TB
    subgraph "사용자"
        U1[일반 사용자]
        U2[관리자]
    end

    subgraph "Frontend - React SPA"
        subgraph "Pages"
            P1[Home]
            P2[News]
            P3[Gallery]
            P4[Courses]
            P5[Curriculum]
            P6[AdminLogin]
        end

        subgraph "Shared Components"
            C1[PostPage]
            C2[PostCard]
            C3[PostModal]
            C4[PostForm]
            C5[PostGrid]
            C6[CategoryFilter]
            C7[Pagination]
            C8[Button]
            C9[Modal]
        end
    end

    subgraph "AWS Infrastructure"
        subgraph "CDN & Storage"
            CF[CloudFront]
            S3[S3 Bucket]
        end

        subgraph "Backend Services"
            AG[API Gateway]
            L1[Lambda Functions]
            DB[DynamoDB]
        end

        subgraph "File Storage"
            S3F[S3 File Storage]
        end
    end

    subgraph "CI/CD"
        GH[GitHub Repository]
        GA[GitHub Actions]
    end

    %% User interactions
    U1 --> CF
    U2 --> CF

    %% Frontend routing
    CF --> S3
    S3 --> P1
    S3 --> P2
    S3 --> P3
    S3 --> P4
    S3 --> P5
    S3 --> P6

    %% Component relationships
    P2 --> C1
    P3 --> C1
    C1 --> C2
    C1 --> C3
    C1 --> C4
    C1 --> C5
    C1 --> C6
    C1 --> C7
    C4 --> C8
    C3 --> C9

    %% API calls
    P2 --> AG
    P3 --> AG
    P6 --> AG
    C4 --> S3F

    %% Backend services
    AG --> L1
    L1 --> DB

    %% CI/CD flow
    GH --> GA
    GA --> S3
    GA --> CF
```

## 🧩 컴포넌트 구조 다이어그램

```mermaid
graph TD
    subgraph "Page Level"
        NP[News Page]
        GP[Gallery Page]
        NTP[Notice Page]
    end

    subgraph "Template Level"
        PP[PostPage Template]
        PL[PageLayout]
    end

    subgraph "Feature Components"
        CF[CategoryFilter]
        PG[PostGrid]
        PM[PostModal]
        PF[PostForm]
    end

    subgraph "UI Components"
        PC[PostCard]
        PGN[Pagination]
        BTN[Button]
        MDL[Modal]
        FG[FormGroup]
    end

    subgraph "Services"
        API[API Services]
        AUTH[Auth Utils]
        IMG[Image Upload]
    end

    %% Page to Template
    NP --> PP
    GP --> PP
    NTP --> PP

    %% Template to Layout
    PP --> PL

    %% Template to Features
    PP --> CF
    PP --> PG
    PP --> PM
    PP --> PF

    %% Features to UI
    PG --> PC
    PG --> PGN
    PF --> MDL
    PF --> FG
    PF --> BTN
    PM --> MDL

    %% Services
    PP --> API
    PF --> IMG
    PP --> AUTH
```

## 🔄 데이터 플로우 다이어그램

```mermaid
sequenceDiagram
    participant U as User
    participant CF as CloudFront
    participant S3 as S3 Static
    participant R as React App
    participant AG as API Gateway
    participant L as Lambda
    participant DB as DynamoDB
    participant S3F as S3 Files

    %% 초기 페이지 로드
    U->>CF: 웹사이트 접속
    CF->>S3: 정적 파일 요청
    S3->>CF: HTML, CSS, JS 반환
    CF->>U: 웹사이트 표시

    %% 게시글 목록 조회
    R->>AG: GET /news
    AG->>L: Lambda 함수 호출
    L->>DB: 데이터 조회
    DB->>L: 게시글 데이터 반환
    L->>AG: JSON 응답
    AG->>R: API 응답
    R->>U: 게시글 목록 표시

    %% 관리자 로그인
    U->>R: 로그인 정보 입력
    R->>AG: POST /auth/login
    AG->>L: 인증 처리
    L->>DB: 사용자 확인
    DB->>L: 인증 결과
    L->>AG: 토큰 발급
    AG->>R: 인증 토큰
    R->>U: 관리자 모드 활성화

    %% 게시글 작성 (이미지 포함)
    U->>R: 게시글 작성
    R->>AG: POST /news/upload-url
    AG->>L: Presigned URL 생성
    L->>S3F: S3 권한 설정
    S3F->>L: Presigned URL
    L->>AG: URL 반환
    AG->>R: Presigned URL
    R->>S3F: 이미지 직접 업로드
    S3F->>R: 업로드 완료
    R->>AG: POST /news (게시글 데이터)
    AG->>L: 게시글 저장
    L->>DB: 데이터 저장
    DB->>L: 저장 완료
    L->>AG: 성공 응답
    AG->>R: 게시글 생성 완료
    R->>U: 성공 메시지
```

## 🏗️ AWS 인프라 구조

```mermaid
graph TB
    subgraph "사용자"
        Users[웹 사용자들]
    end

    subgraph "AWS Global"
        R53[Route 53<br/>DNS]
        CF[CloudFront<br/>CDN]
    end

    subgraph "AWS ap-northeast-2 (서울)"
        subgraph "정적 호스팅"
            S3W[S3 Website<br/>React 빌드 파일]
        end

        subgraph "API 서비스"
            AG[API Gateway<br/>REST API]

            subgraph "Lambda Functions"
                L1[News API<br/>Lambda]
                L2[Gallery API<br/>Lambda]
                L3[Auth API<br/>Lambda]
                L4[Upload API<br/>Lambda]
            end
        end

        subgraph "데이터 저장"
            DB[DynamoDB<br/>게시글 & 사용자 데이터]
            S3F[S3 Files<br/>이미지 저장소]
        end

        subgraph "보안 & 모니터링"
            IAM[IAM<br/>권한 관리]
            CW[CloudWatch<br/>로그 & 모니터링]
        end
    end

    subgraph "개발 & 배포"
        GH[GitHub<br/>코드 저장소]
        GA[GitHub Actions<br/>CI/CD 파이프라인]
    end

    %% 사용자 트래픽 흐름
    Users --> R53
    R53 --> CF
    CF --> S3W

    %% API 호출 흐름
    CF --> AG
    AG --> L1
    AG --> L2
    AG --> L3
    AG --> L4

    %% 데이터 저장
    L1 --> DB
    L2 --> DB
    L3 --> DB
    L4 --> S3F

    %% 보안 및 모니터링
    AG --> IAM
    L1 --> CW
    L2 --> CW
    L3 --> CW
    L4 --> CW

    %% CI/CD 흐름
    GH --> GA
    GA --> S3W
    GA --> CF
```

## 📱 반응형 디자인 구조

```mermaid
graph LR
    subgraph "Desktop (1200px+)"
        D1[3-Column Grid]
        D2[Full Navigation]
        D3[Large Images]
    end

    subgraph "Tablet (768px-1199px)"
        T1[2-Column Grid]
        T2[Collapsed Navigation]
        T3[Medium Images]
    end

    subgraph "Mobile (< 768px)"
        M1[1-Column Stack]
        M2[Hamburger Menu]
        M3[Small Images]
    end

    CSS[CSS Media Queries] --> D1
    CSS --> T1
    CSS --> M1
```

## 🔒 보안 아키텍처

```mermaid
graph TB
    subgraph "프론트엔드 보안"
        F1[HTTPS Only]
        F2[환경변수 관리]
        F3[XSS 방지]
        F4[CSRF 방지]
    end

    subgraph "API 보안"
        A1[JWT 토큰 인증]
        A2[CORS 설정]
        A3[Rate Limiting]
        A4[Input Validation]
    end

    subgraph "AWS 보안"
        AW1[IAM 역할 기반 권한]
        AW2[VPC 보안 그룹]
        AW3[S3 버킷 정책]
        AW4[CloudFront OAI]
    end

    subgraph "데이터 보안"
        D1[DynamoDB 암호화]
        D2[S3 암호화]
        D3[백업 및 복구]
        D4[감사 로그]
    end

    F1 --> A1
    A1 --> AW1
    AW1 --> D1
```

## 📊 성능 최적화 구조

```mermaid
graph TD
    subgraph "Frontend 최적화"
        FO1[Code Splitting]
        FO2[Lazy Loading]
        FO3[Image Optimization]
        FO4[Bundle Optimization]
    end

    subgraph "CDN 최적화"
        CO1[CloudFront Caching]
        CO2[Gzip Compression]
        CO3[Edge Locations]
        CO4[HTTP/2 Support]
    end

    subgraph "API 최적화"
        AO1[Lambda 최적화]
        AO2[DynamoDB 인덱싱]
        AO3[캐싱 전략]
        AO4[Connection Pooling]
    end

    subgraph "모니터링"
        M1[CloudWatch Metrics]
        M2[X-Ray Tracing]
        M3[Real User Monitoring]
        M4[Performance Budgets]
    end

    FO1 --> CO1
    CO1 --> AO1
    AO1 --> M1
```

---

이 아키텍처는 확장 가능하고 유지보수가 용이하며, 현대적인 웹 개발 모범 사례를 따릅니다.

**작성일**: 2025년 7월 6일  
**버전**: 2.0.0
