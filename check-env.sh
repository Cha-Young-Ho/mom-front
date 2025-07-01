#!/bin/bash

# 환경 변수 확인 스크립트
# 사용법: ./check-env.sh

set -e

echo "🔍 환경 변수 확인..."
echo "=================================================="

# 필수 환경 변수 확인
REQUIRED_VARS=("S3_BUCKET" "CLOUDFRONT_DISTRIBUTION_ID" "AWS_REGION")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
        echo "❌ $var: 설정되지 않음"
    else
        # 보안을 위해 일부만 표시
        if [[ "$var" == *"ID"* ]] || [[ "$var" == *"BUCKET"* ]]; then
            VALUE="${!var}"
            MASKED="${VALUE:0:8}...${VALUE: -4}"
            echo "✅ $var: $MASKED"
        else
            echo "✅ $var: ${!var}"
        fi
    fi
done

# 선택적 환경 변수 확인
OPTIONAL_VARS=("AWS_PROFILE" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")

echo ""
echo "📋 선택적 환경 변수:"
for var in "${OPTIONAL_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        if [[ "$var" == *"SECRET"* ]] || [[ "$var" == *"KEY"* ]]; then
            echo "✅ $var: ****설정됨****"
        else
            echo "✅ $var: ${!var}"
        fi
    else
        echo "⚪ $var: 설정되지 않음"
    fi
done

# GitHub Secrets 체크리스트
echo ""
echo "📝 GitHub Secrets 체크리스트:"
echo "Repository Settings > Secrets and variables > Actions에서 확인:"
echo ""
for var in "${REQUIRED_VARS[@]}"; do
    if [[ "$var" != "AWS_REGION" ]]; then
        echo "  - $var"
    fi
done
echo "  - AWS_ROLE_ARN"

# 결과 요약
echo ""
echo "=================================================="
if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "🎉 모든 필수 환경 변수가 설정되어 있습니다!"
    echo ""
    echo "✅ 다음 명령으로 배포 상태를 확인할 수 있습니다:"
    echo "   ./check-deployment.sh"
    echo ""
    echo "✅ 수동 배포를 원한다면:"
    echo "   npm run deploy:manual"
else
    echo "⚠️  다음 환경 변수를 설정해주세요:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   export $var=your-value"
    done
    echo ""
    echo "또는 .env 파일에 추가하세요:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   $var=your-value"
    done
fi

echo ""
echo "🔧 환경 변수 설정 방법:"
echo "1. 터미널에서 직접 설정:"
echo "   export S3_BUCKET=your-bucket-name"
echo "   export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC"
echo ""
echo "2. .env 파일 생성 (프로젝트 루트):"
echo "   echo 'S3_BUCKET=your-bucket-name' >> .env"
echo "   echo 'CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC' >> .env"
echo ""
echo "3. ~/.zshrc 또는 ~/.bashrc에 추가 (영구 설정)"
