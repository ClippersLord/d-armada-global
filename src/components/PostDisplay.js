import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VideoEmbed from './VideoEmbed';
import { Tag } from './ui';

export default function PostDisplay({ post }) {
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-40 text-center">
        <h1 className="text-2xl font-bold text-text-bright mb-4">Content Not Found</h1>
        <p className="text-text-secondary">This page doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 md:px-12 pt-24 pb-40">
      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Tag>{post?.category}</Tag>
        {post?.subcategory && <Tag color="muted">{post?.subcategory}</Tag>}
        {post?.is_premium && <Tag color="caution">Premium</Tag>}
        {post?.published_at && (
          <span className="text-text-muted text-[11px]">
            {new Date(post?.published_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-text-bright leading-tight mb-4">
        {post?.title}
      </h1>

      {post?.excerpt && (
        <p className="text-text-secondary text-base font-light leading-relaxed mb-8 border-l-2 border-brand/30 pl-4">
          {post?.excerpt}
        </p>
      )}

      {/* Video Embed (above content) */}
      {post?.video_url && <VideoEmbed url={post?.video_url} />}

      {/* Markdown Content */}
      {post?.body && (
        <div className="prose-darmada">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post?.body}
          </ReactMarkdown>
        </div>
      )}

      {/* Tags */}
      {post?.tags && post?.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-16 pt-6 border-t border-border">
          {post?.tags.map(tag => (
            <span key={tag} className="text-[10px] text-text-muted border border-border rounded-full px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="mt-20 pt-6 border-t border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand text-lg">⚓</div>
        <div>
          <div className="text-sm text-text-bright font-medium">{post?.author || 'D-Armada Global'}</div>
          <div className="text-[11px] text-text-muted">Research & Analysis</div>
        </div>
      </div>
    </article>
  );
}
