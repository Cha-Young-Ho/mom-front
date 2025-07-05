# 🚀 배포 설정 완벽 가이드

## 📋 목차

1. [GitHub Secrets 설정](#github-secrets-설정)
2. [AWS 인프라 설정](#aws-인프라-설정)
3. [환경변수 관리](#환경변수-관리)
4. [CI/CD 파이프라인](#cicd-파이프라인)
5. [배포 검증](#배포-검증)
6. [트러블슈팅](#트러블슈팅)

## 🔐 GitHub Secrets 설정

### 필수 Secrets

GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**에서 다음 항목들을 설정하세요:

```bash
# AWS 인증 정보
AWS_ACCESS_KEY_ID=AKIA****************
AWS_SECRET_ACCESS_KEY=********************************
AWS_REGION=ap-northeast-2

# S3 및 CloudFront 설정
S3_BUCKET_NAME=your-family-center-website
CLOUDFRONT_DISTRIBUTION_ID=E*************

# 애플리케이션 설정
REACT_APP_API_URL=https://axj39b1x3k.execute-api.ap-northeast-2.amazonaws.com/Prod
```

### AWS IAM 사용자 권한

배포용 IAM 사용자는 다음 권한이 필요합니다:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::your-family-center-website",
        "arn:aws:s3:::your-family-center-website/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    }
  ]
}
```

## ☁️ AWS 인프라 설정

### 1. S3 버킷 생성 및 설정

#### 버킷 생성

```bash
# S3 버킷 생성
aws s3 mb s3://your-family-center-website --region ap-northeast-2

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-family-center-website \
  --index-document index.html \
  --error-document index.html
```

#### 버킷 정책 설정

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-family-center-website/*"
    }
  ]
}
```

### 2. CloudFront 배포 설정

#### CloudFront 배포 JSON 설정

```json
{
  "CallerReference": "family-center-2025",
  "Comment": "Family Support Center Website",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-family-center-website",
        "DomainName": "your-family-center-website.s3.ap-northeast-2.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-family-center-website",
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
    },
    "MinTTL": 0,
    "Compress": true,
    "FunctionAssociations": {
      "Quantity": 1,
      "Items": [
        {
          "FunctionARN": "arn:aws:cloudfront::123456789012:function/spa-redirect",
          "EventType": "viewer-request"
        }
      ]
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "DefaultRootObject": "index.html",
  "PriceClass": "PriceClass_100"
}
```

#### CloudFront 함수 (SPA 지원)

```javascript
// cloudfront-spa-function.js
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // 파일 확장자가 없는 경우 index.html로 리다이렉트
  if (!uri.includes('.') && !uri.endsWith('/')) {
    request.uri = '/index.html';
  }

  // /admin 경로 접근 차단 (숨겨진 로그인 버튼 사용)
  if (uri.startsWith('/admin')) {
    return {
      statusCode: 403,
      statusDescription: 'Forbidden',
    };
  }

  return request;
}
```

### 3. API Gateway 설정

백엔드 API는 이미 설정되어 있습니다:

```
Base URL: https://axj39b1x3k.execute-api.ap-northeast-2.amazonaws.com/Prod
Endpoints:
  - GET  /news          # 뉴스 목록
  - POST /news          # 뉴스 생성
  - GET  /gallery       # 갤러리 목록
  - POST /gallery       # 갤러리 생성
  - POST /auth/login    # 로그인
  - GET  /auth/me       # 사용자 정보
```

## 🔧 환경변수 관리

### 개발 환경 (.env)

```bash
# 로컬 개발용
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

### 운영 환경 (GitHub Actions)

GitHub Actions에서 자동으로 주입됩니다:

```yaml
env:
  REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
  REACT_APP_ENVIRONMENT: production
```

## 🔄 CI/CD 파이프라인

### GitHub Actions 워크플로우

`.github/workflows/deploy.yml`:

```yaml
name: Deploy Family Center Website

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage --watchAll=false

      - name: Build application
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
          REACT_APP_ENVIRONMENT: production

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync build/ s3://${{ secrets.S3_BUCKET_NAME }} --delete --exact-timestamps

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

      - name: Post deployment notification
        if: success()
        run: |
          echo "✅ Deployment successful!"
          echo "🌐 Website URL: https://d1234567890.cloudfront.net"
```

### 배포 트리거

- **자동 배포**: `main` 브랜치에 push 시
- **수동 배포**: GitHub Actions 탭에서 "Run workflow" 클릭

## ✅ 배포 검증

### 1. 빌드 검증

```bash
# 로컬에서 빌드 테스트
npm run build

# 빌드 결과 확인
ls -la build/
```

### 2. 환경변수 검증

```bash
# 환경변수 체크 스크립트
npm run check-env
```

### 3. API 연결 테스트

```bash
# API 연결 테스트
curl -X GET "https://axj39b1x3k.execute-api.ap-northeast-2.amazonaws.com/Prod/news"
```

### 4. 배포 후 확인사항

- [ ] 웹사이트가 정상적으로 로드되는가?
- [ ] 모든 페이지 라우팅이 작동하는가?
- [ ] API 호출이 성공하는가?
- [ ] 관리자 로그인이 작동하는가?
- [ ] 이미지 업로드가 작동하는가?

## 🐛 트러블슈팅

### 일반적인 문제들

#### 1. GitHub Actions 빌드 실패

```bash
# 문제: npm install 실패
해결: package-lock.json 파일 확인 및 npm ci 사용

# 문제: 환경변수 누락
해결: GitHub Secrets 설정 확인
```

#### 2. S3 업로드 실패

```bash
# 문제: Access Denied
해결: IAM 권한 확인

# 문제: 버킷이 존재하지 않음
해결: S3 버킷 생성 확인
```

#### 3. CloudFront 캐시 문제

```bash
# 문제: 이전 버전이 계속 표시됨
해결: 캐시 무효화 실행
aws cloudfront create-invalidation --distribution-id E123456789 --paths "/*"

# 문제: SPA 라우팅 실패
해결: CloudFront 함수 및 에러 페이지 설정 확인
```

#### 4. API 연결 실패

```bash
# 문제: CORS 에러
해결: API Gateway CORS 설정 확인

# 문제: 인증 실패
해결: 토큰 저장 및 헤더 전송 확인
```

### 배포 상태 확인 명령어

```bash
# S3 버킷 내용 확인
aws s3 ls s3://your-family-center-website --recursive

# CloudFront 배포 상태 확인
aws cloudfront get-distribution --id E123456789

# CloudFront 캐시 무효화 상태 확인
aws cloudfront get-invalidation --distribution-id E123456789 --id I123456789
```

## 📊 모니터링 및 로그

### CloudWatch 로그 확인

```bash
# CloudFront 로그 확인
aws logs describe-log-groups --log-group-name-prefix "/aws/cloudfront"

# API Gateway 로그 확인
aws logs describe-log-groups --log-group-name-prefix "/aws/apigateway"
```

### 성능 모니터링

- **Google PageSpeed Insights**: 웹사이트 성능 측정
- **AWS CloudWatch**: 인프라 모니터링
- **GitHub Actions**: 배포 성공률 모니터링

## 🔄 백업 및 복구

### 자동 백업

- **S3 버저닝**: 이전 버전 자동 백업
- **Git 히스토리**: 코드 버전 관리
- **GitHub Actions**: 배포 이력 관리

### 복구 절차

1. 이전 Git 커밋으로 되돌리기
2. GitHub Actions에서 재배포
3. 필요시 S3에서 이전 버전 복원

---

**작성일**: 2025년 7월 6일  
**버전**: 2.0.0  
**담당자**: 개발팀
