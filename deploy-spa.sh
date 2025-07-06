#!/bin/bash

# SPA 라우팅을 위한 S3 배포 스크립트
echo "Building React app..."
npm run build:prod

echo "Creating SPA route folders..."
# 주요 라우트들을 위한 폴더 생성 및 index.html 복사
mkdir -p build/admin
mkdir -p build/gallery  
mkdir -p build/news
mkdir -p build/curriculum
mkdir -p build/courses

cp build/index.html build/admin/index.html
cp build/index.html build/gallery/index.html
cp build/index.html build/news/index.html
cp build/index.html build/curriculum/index.html
cp build/index.html build/courses/index.html

echo "Uploading to S3..."
aws s3 sync build/ s3://$S3_BUCKET --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths '/*'

echo "Deployment complete!"
