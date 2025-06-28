# React CloudFront CDN Deployment

🚀 AWS CloudFront CDN과 S3를 이용한 글로벌 React 애플리케이션 배포 프로젝트입니다.

## 📋 목차
- [프로젝트 개요](#-프로젝트-개요)
- [빠른 시작](#-빠른-시작)
- [AWS 설정](#-aws-설정)
- [배포 방법](#-배포-방법)
- [개발 도구](#-개발-도구)
- [프로젝트 구조](#-프로젝트-구조)
- [환경 변수](#-환경-변수)
- [성능 최적화](#-성능-최적화)
- [보안](#-보안)
- [모니터링](#-모니터링)
- [문제 해결](#-문제-해결)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)
- [지원](#-지원)

## 🎯 프로젝트 개요

이 프로젝트는 다음을 포함합니다:
- ⚛️ React 18 + TypeScript
- 🌐 CloudFront CDN 글로벌 배포
- 🏗️ 최적화된 빌드 설정
- 🚀 GitHub Actions 자동 배포
- ☁️ AWS S3 + CloudFront 호스팅
- 🔒 Origin Access Control 보안
- 🛠️ 개발 편의 도구들

## ⚡ 빠른 시작

### 1. 의존성 설치 및 개발 서버 실행
```bash
npm install
npm start
```

### 2. 프로덕션 빌드
```bash
npm run build
npm run preview  # 빌드 결과 미리보기
```

### 3. 개발 도구 사용
```bash
./dev-utils.sh setup     # 초기 설정
./dev-utils.sh aws-setup # AWS 설정 가이드 보기
./dev-utils.sh help      # 사용 가능한 명령어 보기
```

## ☁️ AWS 설정

### CloudFront + S3 CDN 배포 설정
자세한 설정 방법은 [`manual-setup-guide.md`](./manual-setup-guide.md) 파일을 참조하세요.

### 필요한 AWS 리소스
1. **S3 버킷** (프라이빗) - 오리진 스토리지
2. **CloudFront 배포** (필수) - 글로벌 CDN
3. **Origin Access Control** - S3 보안 접근 제어
4. **IAM 역할** - GitHub Actions 배포 권한
5. **Route 53** (선택사항) - 커스텀 도메인

### 배포 아키텍처
```
사용자 → CloudFront CDN → Origin Access Control → S3 버킷
```

### GitHub Secrets 설정
Repository Settings > Secrets and variables > Actions에서 설정:
```
AWS_ROLE_ARN=arn:aws:iam::123456789012:role/github-actions-role
S3_BUCKET=your-react-app-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
AWS_REGION=ap-northeast-2
```

### 배포 상태 확인
AWS CLI를 통해 직접 확인:
```bash
# S3 버킷 확인
aws s3 ls s3://your-bucket-name

# CloudFront 배포 상태 확인  
aws cloudfront get-distribution --id E1234567890ABC
```

Trust Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME:*"
        }
      }
    }
  ]
}
```

### 2. S3 버킷 설정

S3 버킷을 정적 웹사이트 호스팅용으로 설정하세요:

```bash
# 버킷 생성
aws s3 mb s3://your-bucket-name

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html

# 퍼블릭 읽기 액세스 허용 (버킷 정책)
aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}'
```

### 3. GitHub Secrets 설정

GitHub 리포지토리 Settings > Secrets and variables > Actions에서 다음 시크릿을 추가하세요:

- `AWS_ROLE_ARN`: IAM Role ARN (예: `arn:aws:iam::123456789012:role/github-actions-role`)

### 4. 환경 변수 설정

`.env.example`을 복사해서 `.env`를 만들고 실제 값으로 업데이트하세요:

```bash
cp .env.example .env
```

## 📦 로컬 개발

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 프로덕션 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

## 🚀 배포 방법

### 자동 배포 (GitHub Actions)
```bash
# 1. 코드 변경 및 커밋
git add .
git commit -m "feat: new feature"

# 2. 버전 태그 생성 및 푸시
git tag v1.0.0
git push origin main --tags
```

### 수동 배포
```bash
# 1. 프로덕션 빌드
npm run build:prod

# 2. AWS S3에 배포
./deploy.sh
```

### 배포 전 체크리스트
```bash
./dev-utils.sh deploy-prep  # 모든 검사 실행
```

## 🛠️ 개발 도구

### 개발 유틸리티 스크립트
```bash
./dev-utils.sh setup          # 초기 프로젝트 설정
./dev-utils.sh dev           # 개발 서버 시작
./dev-utils.sh build         # 프로덕션 빌드
./dev-utils.sh preview       # 빌드 결과 미리보기
./dev-utils.sh test          # 테스트 실행
./dev-utils.sh lint          # 코드 린팅
./dev-utils.sh format        # 코드 포맷팅
./dev-utils.sh type-check    # TypeScript 타입 체크
./dev-utils.sh clean         # 빌드 파일 정리
./dev-utils.sh deps          # 의존성 업데이트 확인
./dev-utils.sh security      # 보안 취약점 검사
./dev-utils.sh bundle-analyze # 번들 크기 분석
./dev-utils.sh deploy-prep   # 배포 준비
./dev-utils.sh aws-setup     # AWS 설정 가이드
```

### npm 스크립트
```bash
npm start              # 개발 서버 시작
npm run build          # 프로덕션 빌드
npm run build:prod     # 환경변수 포함 프로덕션 빌드
npm run build:analyze  # 번들 분석 포함 빌드
npm run preview        # 빌드 결과 미리보기
npm test               # 테스트 실행
npm run test:coverage  # 커버리지 포함 테스트
npm run test:ci        # CI용 테스트
npm run lint           # ESLint 실행
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 포맷팅
npm run format:check   # Prettier 검사만
npm run type-check     # TypeScript 타입 체크
npm run clean          # 캐시 및 빌드 파일 정리
npm run deploy         # 빌드 + 배포
```

## 📁 프로젝트 구조

```
frontend/
├── public/                 # 정적 자산
│   ├── index.html         # HTML 템플릿
│   ├── favicon.ico        # 파비콘
│   └── manifest.json      # PWA 매니페스트
├── src/                   # 소스 코드
│   ├── App.tsx           # 메인 App 컴포넌트
│   ├── index.tsx         # 앱 진입점
│   └── ...               # 기타 컴포넌트들
├── build/                # 빌드 결과물 (생성됨)
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions 배포 워크플로우
├── .vscode/              # VS Code 설정
│   ├── extensions.json   # 추천 확장프로그램
│   ├── settings.json     # 워크스페이스 설정
│   └── tasks.json        # VS Code 태스크
├── deploy.sh             # 배포 스크립트
├── dev-utils.sh          # 개발 유틸리티 스크립트
├── setup.sh              # 초기 설정 스크립트
├── manual-setup-guide.md # AWS 수동 설정 가이드
├── package.json          # 프로젝트 의존성 및 스크립트
├── tsconfig.json         # TypeScript 설정
├── .env.example          # 환경변수 예시
├── .env.local            # 로컬 환경변수 (생성됨)
└── README.md             # 이 파일
```

## 🔧 환경 변수

### 개발 환경 (.env.local)
```bash
# React 앱 설정
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# 개발용 API 엔드포인트
REACT_APP_API_URL=http://localhost:3001
```

### 프로덕션 환경 (.env.production)
```bash
# 자동 생성됨
REACT_APP_VERSION=$VERSION
REACT_APP_BUILD_TIME=$BUILD_TIME
REACT_APP_ENVIRONMENT=production
```

## 📊 성능 최적화

### 빌드 최적화
- ✅ Code splitting 및 lazy loading
- ✅ Tree shaking으로 불필요한 코드 제거
- ✅ 이미지 및 에셋 최적화
- ✅ Gzip 압축

### 캐싱 전략
- HTML 파일: 캐시 안함 (즉시 업데이트)
- JS/CSS 파일: 1년 캐시 (파일명 해시 포함)
- 이미지: 1개월 캐시

## 🔒 보안

### 설정된 보안 기능
- HTTPS 강제 리다이렉트
- Security headers 적용
- CORS 설정
- 안전한 S3 버킷 정책

## 📈 모니터링

### 가능한 모니터링
- CloudWatch 로그
- S3 액세스 로그
- CloudFront 액세스 로그
- Web Vitals 메트릭

## 🚨 문제 해결

### 일반적인 문제

**1. 빌드 실패**
```bash
npm run clean
npm install
npm run build
```

**2. 배포 실패**
- AWS 자격 증명 확인
- S3 버킷 권한 확인
- GitHub Secrets 설정 확인

**3. 404 에러 (React Router)**
- S3 오류 문서가 index.html로 설정되어 있는지 확인
- CloudFront 커스텀 오류 페이지 설정 확인

## 🤝 기여하기

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 지원

문제가 있거나 질문이 있다면:
- GitHub Issues를 통해 문의
- 또는 manual-setup-guide.md의 문제 해결 섹션 참조

---

⭐ 도움이 되었다면 스타를 눌러주세요!
