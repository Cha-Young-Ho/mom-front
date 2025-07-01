#!/bin/bash

# CloudFront + S3 배포 상태 확인 스크립트
# 사용법: ./check-deployment.sh

set -e

echo "🔍 CloudFront + S3 배포 상태 확인 중..."
echo "=================================================="

# 환경 변수 확인
if [ -z "$S3_BUCKET" ]; then
    echo "❌ S3_BUCKET 환경 변수가 설정되지 않았습니다."
    echo "   export S3_BUCKET=your-bucket-name"
    exit 1
fi

if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "⚠️  CLOUDFRONT_DISTRIBUTION_ID 환경 변수가 설정되지 않았습니다."
    echo "   CloudFront 관련 확인을 건너뜁니다."
fi

echo "📦 S3 버킷 확인: $S3_BUCKET"
echo "🌐 CloudFront 배포 ID: ${CLOUDFRONT_DISTRIBUTION_ID:-'설정되지 않음'}"
echo ""

# S3 버킷 상태 확인
echo "1. S3 버킷 상태 확인..."
if aws s3 ls "s3://$S3_BUCKET" > /dev/null 2>&1; then
    echo "✅ S3 버킷에 접근 가능"
    
    # index.html 파일 확인
    if aws s3 ls "s3://$S3_BUCKET/index.html" > /dev/null 2>&1; then
        echo "✅ index.html 파일 존재"
        
        # 파일 수 확인
        FILE_COUNT=$(aws s3 ls "s3://$S3_BUCKET" --recursive | wc -l)
        echo "📁 총 $FILE_COUNT 개 파일 배포됨"
    else
        echo "❌ index.html 파일이 없습니다. 배포가 완료되지 않았을 수 있습니다."
    fi
else
    echo "❌ S3 버킷에 접근할 수 없습니다. 권한을 확인하세요."
    exit 1
fi

# CloudFront 배포 상태 확인
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo ""
    echo "2. CloudFront 배포 상태 확인..."
    
    DISTRIBUTION_STATUS=$(aws cloudfront get-distribution --id "$CLOUDFRONT_DISTRIBUTION_ID" --query 'Distribution.Status' --output text 2>/dev/null || echo "ERROR")
    
    if [ "$DISTRIBUTION_STATUS" = "ERROR" ]; then
        echo "❌ CloudFront 배포 정보를 가져올 수 없습니다."
    else
        echo "📊 배포 상태: $DISTRIBUTION_STATUS"
        
        if [ "$DISTRIBUTION_STATUS" = "Deployed" ]; then
            echo "✅ CloudFront 배포가 완료되었습니다."
            
            # 도메인 정보 가져오기
            DOMAIN_NAME=$(aws cloudfront get-distribution --id "$CLOUDFRONT_DISTRIBUTION_ID" --query 'Distribution.DomainName' --output text)
            echo "🌐 CloudFront URL: https://$DOMAIN_NAME"
            
            # 간단한 연결 테스트
            echo ""
            echo "3. 연결 테스트..."
            if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN_NAME" | grep -q "200\|301\|302"; then
                echo "✅ CloudFront 엔드포인트 접근 가능"
            else
                echo "⚠️  CloudFront 엔드포인트 접근 실패 (캐시 전파 대기 중일 수 있음)"
            fi
            
        else
            echo "⏳ CloudFront 배포가 진행 중입니다. 완료까지 최대 15분 소요됩니다."
        fi
    fi
fi

echo ""
echo "=================================================="
echo "🎉 배포 상태 확인 완료!"
echo ""
echo "📝 다음 단계:"
echo "1. CloudFront 배포가 'Deployed' 상태인지 확인"
echo "2. 브라우저에서 CloudFront URL 접속 테스트"
echo "3. React Router 경로 테스트 (예: /about, /contact)"
echo "4. 개발자 도구에서 캐시 헤더 확인"
echo ""
echo "🔧 문제 해결:"
echo "- 403/404 에러: CloudFront 에러 페이지 설정 확인"
echo "- 캐시 문제: 무효화 실행 또는 시크릿 브라우징 모드 사용"
echo "- 배포 실패: GitHub Actions 로그 확인"
