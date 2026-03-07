import Link from 'next/link';
import { Card, Tag } from '@/components/ui';

export default function PostCard({ post, basePath }) {
  const href = `${basePath}/${post.slug}`;
  return (
    <Link href={href}>
      <Card className="h-full relative">
        {post.tags?.includes('NEW') && (
          <div className="absolute top-3 right-3"><Tag color="profit">NEW</Tag></div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <Tag color="muted">{post.subcategory || post.category}</Tag>
          {post.published_at && (
            <span className="text-text-muted text-[11px]">
              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-text-bright mb-1.5 leading-snug">{post.title}</h3>
        {post.excerpt && (
          <p className="text-text-secondary text-xs leading-relaxed font-light mb-3 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-brand text-xs font-medium">
            {post.video_url ? 'Watch →' : 'Read →'}
          </span>
          {post.is_premium && <Tag color="caution">Premium</Tag>}
        </div>
      </Card>
    </Link>
  );
}
