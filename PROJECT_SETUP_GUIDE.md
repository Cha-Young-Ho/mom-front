# 🚀 가족지원센터 웹사이트 프로젝트 셋팅 가이드

## 📋 목차

1. [사전 요구사항](#사전-요구사항)
2. [프로젝트 초기 설정](#프로젝트-초기-설정)
3. [환경변수 설정](#환경변수-설정)
4. [개발 서버 실행](#개발-서버-실행)
5. [배포 설정](#배포-설정)
6. [AWS 인프라 설정](#aws-인프라-설정)
7. [GitHub Actions CI/CD](#github-actions-cicd)
8. [프로젝트 구조 설명](#프로젝트-구조-설명)

## 🛠️ 사전 요구사항

### 필수 소프트웨어

- **Node.js**: v16.0.0 이상
- **npm**: v8.0.0 이상
- **Git**: 최신 버전
- **AWS CLI**: v2.0 이상 (배포용)

### 계정 및 서비스

- **GitHub 계정**
- **AWS 계정** (S3, CloudFront, API Gateway 사용)
- **도메인** (선택사항)

## 🏗️ 프로젝트 초기 설정

### 1. 저장소 클론

```bash
git clone <저장소-URL>
cd frontend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 프로젝트 구조 확인

```
frontend/
├── public/                  # 정적 파일
├── src/
│   ├── components/         # React 컴포넌트
│   │   └── shared/        # 재사용 가능한 공통 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── services/          # API 서비스
│   ├── utils/             # 유틸리티 함수
│   └── config/            # 설정 파일
├── package.json
├── .env.example           # 환경변수 예제
└── README.md
```

## 🔧 환경변수 설정

### 1. 로컬 개발용 환경변수

```bash
# .env 파일 생성
cp .env.example .env
```

**.env 파일 내용:**

```bash
# 로컬 개발 API URL
REACT_APP_API_URL=http://localhost:3001

# 기타 설정
REACT_APP_ENVIRONMENT=development
```

### 2. 운영용 환경변수

**.env.production 파일 (Git에 커밋하지 말 것!):**

```bash
# 운영 API URL
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/Prod

# 운영 환경 설정
REACT_APP_ENVIRONMENT=production
```

## 🖥️ 개발 서버 실행

### 1. 개발 서버 시작

```bash
npm start
```

- 브라우저에서 `http://localhost:3000` 접속
- 코드 변경 시 자동 새로고침

### 2. 빌드 테스트

```bash
npm run build
```

### 3. 빌드 미리보기

```bash
npm install -g serve
serve -s build
```

## 🚀 배포 설정

### 1. 수동 배포 설정

#### S3 버킷 생성

```bash
# S3 버킷 생성
aws s3 mb s3://your-website-bucket-name

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-website-bucket-name \
  --index-document index.html \
  --error-document index.html
```

#### CloudFront 배포

```bash
# CloudFront 배포 생성 (JSON 설정 파일 사용)
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### 2. 자동 배포 스크립트

```bash
# 배포 스크립트 실행 권한 부여
chmod +x deploy-spa.sh

# 수동 배포 실행
npm run deploy:manual
```

## ☁️ AWS 인프라 설정

### 1. 필요한 AWS 서비스

- **S3**: 정적 파일 호스팅
- **CloudFront**: CDN 및 캐싱
- **API Gateway**: 백엔드 API
- **Lambda**: 서버리스 함수 (백엔드)
- **DynamoDB**: 데이터베이스 (백엔드)

### 2. IAM 권한 설정

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::your-bucket-name", "arn:aws:s3:::your-bucket-name/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetDistribution"],
      "Resource": "*"
    }
  ]
}
```

### 3. CloudFront 설정

```json
{
  "CallerReference": "unique-reference",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-Origin",
        "DomainName": "your-bucket-name.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "Comment": "Family Support Center Website",
  "Enabled": true,
  "DefaultRootObject": "index.html"
}
```

## 🔄 GitHub Actions CI/CD

### 1. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 설정:

```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=E...
REACT_APP_API_URL=https://your-api-url.amazonaws.com/Prod
```

### 2. GitHub Actions 워크플로우

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}

      - name: Deploy to S3
        run: aws s3 sync build/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.AWS_REGION }}

      - name: Invalidate CloudFront
        run:
          aws cloudfront create-invalidation --distribution-id ${{
          secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.AWS_REGION }}
```

## 🏗️ 프로젝트 구조 설명

### 컴포넌트 구조

```
src/components/shared/
├── Button/          # 재사용 가능한 버튼 컴포넌트
├── Modal/           # 모달 컴포넌트
├── PostCard/        # 게시글 카드
├── PostForm/        # 게시글 작성/수정 폼
├── PostGrid/        # 게시글 그리드 레이아웃
├── PostModal/       # 게시글 상세보기 모달
├── PostPage/        # 게시글 페이지 템플릿
├── CategoryFilter/  # 카테고리 필터
├── Pagination/      # 페이지네이션
├── PageLayout/      # 페이지 레이아웃
└── FormGroup/       # 폼 그룹
```

### 페이지 구조

```
src/pages/
├── Home/            # 홈페이지 (메인)
├── News/            # 센터소식 (뉴스)
├── Gallery/         # 주요정보 (갤러리)
├── Notice/          # 공지사항
├── Courses.tsx      # 교육대상
├── Curriculum.tsx   # 취급업무
└── AdminLogin.tsx   # 관리자 로그인
```

### API 구조

```
src/services/api.ts
├── newsAPI          # 뉴스 관련 API
├── galleryAPI       # 갤러리 관련 API
├── authAPI          # 인증 관련 API
└── uploadAPI        # 이미지 업로드 API
```

## 🎯 개발 가이드라인

### 1. 새 페이지 추가

```tsx
// src/pages/NewPage/NewPage.tsx
import { PostPage } from '../../components/shared';

const NewPage = () => (
  <PostPage
    title='새 페이지'
    description='페이지 설명'
    categoryType='news'
    categories={['카테고리1', '카테고리2']}
    loadPosts={myAPI.getPosts}
    createPost={myAPI.createPost}
    deletePost={myAPI.deletePost}
    fallbackPosts={[]}
  />
);

export default NewPage;
```

### 2. 공통 컴포넌트 사용

```tsx
import { Button, Modal, PostCard } from '../../components/shared';

// 컴포넌트에서 사용
<Button variant='primary' onClick={handleClick}>
  클릭
</Button>;
```

### 3. API 추가

```tsx
// src/services/api.ts에 추가
export const newAPI = {
  async getItems(): Promise<PostsResponse> {
    return apiFetch<PostsResponse>('/api/new-endpoint');
  },
};
```

## 🔍 트러블슈팅

### 일반적인 문제들

#### 1. 빌드 실패

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. 환경변수 인식 안됨

- `.env` 파일이 프로젝트 루트에 있는지 확인
- 변수명이 `REACT_APP_`로 시작하는지 확인
- 개발 서버 재시작

#### 3. API 호출 실패

- API URL이 올바른지 확인
- CORS 설정 확인
- 네트워크 탭에서 요청/응답 확인

#### 4. 배포 후 라우팅 문제

- CloudFront에서 404 에러 시 `index.html`로 리다이렉트 설정 확인
- SPA 함수 설정 확인

## 📞 지원

### 문서 참조

- [React 공식 문서](https://reactjs.org/)
- [AWS CloudFront 문서](https://docs.aws.amazon.com/cloudfront/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

### 파일 참조

- `REFACTORING_REPORT.md`: 리팩토링 상세 내용
- `GITHUB_SECRETS_GUIDE.md`: GitHub Secrets 설정 가이드
- `CICD_ENVIRONMENT_GUIDE.md`: CI/CD 환경 설정 가이드

---

**작성일**: 2025년 7월 6일  
**버전**: 2.0.0
