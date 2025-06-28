# AWS CloudFront + S3 CDN 배포 가이드

## 📋 개요
이 가이드는 React 앱을 AWS CloudFront CDN과 S3를 이용하여 글로벌 배포하기 위한 설정 방법을 안내합니다.
S3는 프라이빗 오리진 저장소로만 사용하고, 모든 트래픽은 CloudFront를 통해 서빙됩니다.

## 🚀 필요한 AWS 리소스

### 1. S3 버킷 생성 및 설정 (프라이빗 버킷)

#### 1.1 S3 버킷 생성
```bash
# AWS CLI로 S3 버킷 생성
aws s3 mb s3://your-react-app-bucket-name --region ap-northeast-2
```

#### 1.2 버킷 보안 설정
- **퍼블릭 액세스 차단**: 모든 퍼블릭 액세스 차단 유지 (기본값)
- **정적 웹사이트 호스팅**: 활성화하지 않음
- **버킷 정책**: CloudFront에서만 접근 가능하도록 설정

### 2. CloudFront 배포 설정 (필수)

#### 2.1 Origin Access Control (OAC) 생성
AWS 콘솔에서 CloudFront > Origin access control 에서 새로 생성:
- **Name**: `react-app-oac`
- **Origin type**: S3
- **Signing behavior**: Sign requests (recommended)

#### 2.2 CloudFront 배포 생성
**CloudFront 배포 주요 설정값:**
- **Origin Domain**: `your-react-app-bucket-name.s3.ap-northeast-2.amazonaws.com` (REST API 엔드포인트)
- **Origin Access Control**: 위에서 생성한 OAC 선택
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Allowed HTTP Methods**: GET, HEAD, OPTIONS
- **Default Root Object**: `index.html`
- **Error Pages**: 
  - 403 → `/index.html` (HTTP 200 반환)
  - 404 → `/index.html` (HTTP 200 반환)

#### 2.3 캐시 동작 설정
최적의 성능을 위한 캐시 정책:
- **HTML 파일**: 캐시하지 않음 (0초)
- **JS/CSS 파일**: 1년 캐시 (31536000초)
- **이미지 파일**: 1개월 캐시 (2592000초)

### 3. S3 버킷 정책 설정

CloudFront 배포 생성 후, S3 버킷에 다음 정책 적용:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-react-app-bucket-name/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/E1234567890ABC"
                }
            }
        }
    ]
}
```

### 4. IAM 역할 및 정책 설정

#### 4.1 GitHub Actions용 IAM 정책
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-react-app-bucket-name",
        "arn:aws:s3:::your-react-app-bucket-name/*"
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

## 🔧 설정 단계별 가이드

### 단계 1: AWS 리소스 생성

1. **S3 버킷 생성**
   ```bash
   aws s3 mb s3://your-react-app-bucket-name --region ap-northeast-2
   ```

2. **Origin Access Control 생성**
   - AWS 콘솔 > CloudFront > Origin access control
   - "Create control setting" 클릭
   - 이름: `react-app-oac`, 타입: S3

3. **CloudFront 배포 생성**
   - Origin domain: S3 버킷 선택
   - Origin access: Origin access control settings 선택
   - 위에서 생성한 OAC 선택

4. **S3 버킷 정책 업데이트**
   - CloudFront 배포 생성 완료 후
   - 배포 ID를 사용하여 버킷 정책 적용

### 단계 2: GitHub Secrets 설정

Repository Settings > Secrets and variables > Actions에서 다음 시크릿 추가:

```
AWS_ROLE_ARN=arn:aws:iam::123456789012:role/github-actions-role
S3_BUCKET=your-react-app-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
AWS_REGION=ap-northeast-2
```

### 단계 3: 배포 테스트

```bash
# 태그 생성하여 자동 배포 트리거
git tag v1.0.0
git push origin main --tags
```

## 📊 비용 예상

### S3 비용 (서울 리전)
- **스토리지**: $0.025/GB/월
- **PUT 요청**: $0.0047/1,000 요청
- **GET 요청**: $0.0037/1,000 요청

### CloudFront 비용
- **데이터 전송 (첫 1TB)**: $0.085/GB
- **HTTP/HTTPS 요청**: $0.0075/10,000 요청
- **무효화**: 첫 1,000 경로 무료, 이후 $0.005/경로

**예상 월 비용** (트래픽 10GB, 10만 요청 기준): ~$2-5

## 🚀 배포 방법

### 자동 배포 (권장)
```bash
# 1. 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 2. 버전 태그 생성 및 푸시
git tag v1.0.1
git push origin main --tags
```

### 수동 배포
```bash
# 1. 프로덕션 빌드
npm run build

# 2. S3에 업로드
aws s3 sync build/ s3://your-bucket-name --delete

# 3. CloudFront 무효화
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## 🔧 고급 설정

### 1. React Router 설정 (SPA 라우팅)
CloudFront 에러 페이지 설정:
- **403 Forbidden**: `/index.html` (HTTP 200 반환)
- **404 Not Found**: `/index.html` (HTTP 200 반환)

### 2. 성능 최적화
- **Gzip 압축**: CloudFront에서 자동 활성화
- **Brotli 압축**: 지원됨
- **HTTP/2**: 기본 활성화
- **캐시 정책**: 파일 타입별 최적화

### 3. 보안 강화
- **HTTPS 전용**: HTTP → HTTPS 리다이렉트
- **Origin Access Control**: S3 직접 접근 차단
- **Security Headers**: 필요시 Lambda@Edge로 추가

## 📝 체크리스트

- [ ] S3 버킷 생성 완료
- [ ] Origin Access Control 생성
- [ ] CloudFront 배포 생성 완료
- [ ] S3 버킷 정책 설정 완료
- [ ] IAM 역할 및 정책 생성
- [ ] GitHub Secrets 설정 완료
- [ ] 에러 페이지 설정 (React Router 지원)
- [ ] 캐시 정책 설정 완료
- [ ] 배포 테스트 완료

## 🚨 주의사항

1. **S3 버킷은 프라이빗 유지**: 퍼블릭 액세스 차단 해제하지 않음
2. **Origin 도메인**: S3 웹사이트 엔드포인트가 아닌 REST API 엔드포인트 사용
3. **캐시 무효화**: 배포 시 `/*` 경로로 무효화 실행
4. **보안**: Origin Access Control을 통해 S3 직접 접근 차단

## 🔗 유용한 링크

- [CloudFront + S3 Origin Access Control 가이드](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [React Router + CloudFront 설정](https://create-react-app.dev/docs/deployment/#notes-on-client-side-routing)
- [GitHub Actions OIDC 연동](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

## 🆘 문제 해결

### 403 Forbidden 에러
- S3 버킷 정책에서 CloudFront ARN 확인
- Origin Access Control 설정 확인

### 404 에러 (React Router)
- CloudFront 에러 페이지 설정 확인
- `/index.html`로 리다이렉트 설정 확인

### 캐시 문제
- CloudFront 무효화 실행
- 브라우저 하드 리프레시 (Ctrl+F5)

### 배포 실패
- GitHub Secrets 설정 확인
- IAM 권한 확인
- AWS CLI 자격 증명 확인
