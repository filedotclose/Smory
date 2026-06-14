import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Flame, Sparkles } from "lucide-react";

type PostCardProps = {
  post: {
    id: string;
    content: string;
    created_at: Date;
    author: {
      anonymous_username: string;
      avatar_species: string;
    };
    community: {
      name: string;
    } | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const getAvatarEmoji = (species: string) => {
    const map: Record<string, string> = {
      Fox: '🦊', Wolf: '🐺', Cat: '🐱', Dragon: '🐉', Owl: '🦉', Rabbit: '🐰'
    };
    return map[species] || '👤';
  };

  return (
    <div className="bg-[#1D1D24] border border-[#2D2D36] p-5 rounded-3xl transition-all hover:bg-[#22222A]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#16161C] border border-[#2D2D36] flex items-center justify-center text-xl shadow-inner">
            {getAvatarEmoji(post.author.avatar_species)}
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-tight">{post.author.anonymous_username}</h3>
            <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium mt-0.5">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              {post.community && ` • ${post.community.name}`}
            </p>
          </div>
        </div>
        <button className="text-[#A1A1AA] hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
      
      <p className="text-[#E4E4E7] leading-relaxed text-[15px] mb-5 whitespace-pre-wrap">
        {post.content}
      </p>
      
      <div className="flex items-center gap-6 pt-4 border-t border-[#2D2D36]/50">
        <button className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#FF5C5C] text-sm font-medium transition-colors group">
          <Flame size={18} className="group-hover:fill-[#FF5C5C]/20" />
          <span>Puff</span>
        </button>
        <button className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#9B6DFF] text-sm font-medium transition-colors group">
          <Sparkles size={18} className="group-hover:fill-[#9B6DFF]/20" />
          <span>Insightful</span>
        </button>
        <button className="flex items-center gap-2 text-[#A1A1AA] hover:text-white text-sm font-medium transition-colors">
          <MessageSquare size={18} />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
}
