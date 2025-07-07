import { Helmet } from 'react-helmet-async';

export function SeoHelmet({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {/* 추가로 og:image, og:url 등도 필요시 추가 */}
    </Helmet>
  );
}
