"use client";

import { useState } from "react";
import { Search, UserPlus, Check, X, Users, Settings } from "lucide-react";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { searchUser, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } from "@/server/friends/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FriendsSectionProps {
  initialFriends: any[];
  initialRequests: any[];
}

export function FriendsSection({ initialFriends, initialRequests }: FriendsSectionProps) {
  const [friends, setFriends] = useState(initialFriends);
  const [requests, setRequests] = useState(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"FRIENDS" | "REQUESTS" | "ADD">("FRIENDS");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const result = await searchUser(searchQuery);
    setIsSearching(false);
    
    if (result) {
      setSearchResults(result);
    } else {
      setSearchResults(null);
      toast.error("User not found");
    }
  };

  const handleAddFriend = async (userId: string) => {
    const result = await sendFriendRequest(userId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Friend request sent!");
      setSearchResults(null);
      setSearchQuery("");
    }
  };

  const handleAccept = async (requestId: string, sender: any) => {
    const result = await acceptFriendRequest(requestId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Friend request accepted!");
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setFriends(prev => [...prev, sender]);
    }
  };

  const handleReject = async (requestId: string) => {
    const result = await rejectFriendRequest(requestId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleRemove = async (friendId: string) => {
    const result = await removeFriend(friendId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Friend removed");
      setFriends(prev => prev.filter(f => f.id !== friendId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-12">
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setActiveTab("FRIENDS")}
          className={cn(
            "flex-1 py-3 border-[3px] border-ink-black font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2",
            activeTab === "FRIENDS" 
              ? "bg-marlboro-red text-paper-white shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]" 
              : "bg-paper-white text-ink-black hover:bg-marlboro-red/10"
          )}
        >
          <Users size={16} />
          Friends ({friends.length})
        </button>
        <button 
          onClick={() => setActiveTab("REQUESTS")}
          className={cn(
            "flex-1 py-3 border-[3px] border-ink-black font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2",
            activeTab === "REQUESTS" 
              ? "bg-marlboro-red text-paper-white shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]" 
              : "bg-paper-white text-ink-black hover:bg-marlboro-red/10"
          )}
        >
          <UserPlus size={16} />
          Requests {requests.length > 0 && `(${requests.length})`}
        </button>
        <button 
          onClick={() => setActiveTab("ADD")}
          className={cn(
            "flex-1 py-3 border-[3px] border-ink-black font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2",
            activeTab === "ADD" 
              ? "bg-marlboro-red text-paper-white shadow-[4px_4px_0px_0px_rgba(11,11,15,1)]" 
              : "bg-paper-white text-ink-black hover:bg-marlboro-red/10"
          )}
        >
          <Search size={16} />
          Add
        </button>
      </div>

      <PixelCard className="p-6">
        {activeTab === "FRIENDS" && (
          <div className="space-y-4">
            {friends.length === 0 ? (
              <p className="text-center font-bold text-ash-gray uppercase tracking-widest text-xs py-8">
                No friends yet. Time to socialize.
              </p>
            ) : (
              friends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between border-b-[3px] border-ink-black/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-paper-white border-[2px] border-ink-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
                      {friend.avatar_species === 'Fox' ? '🦊' : friend.avatar_species === 'Wolf' ? '🐺' : '👤'}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-black uppercase tracking-tight">{friend.display_name || friend.anonymous_username}</h4>
                      {friend.display_name && (
                        <p className="text-[10px] text-ash-gray font-bold uppercase tracking-wider">{friend.anonymous_username}</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemove(friend.id)}
                    className="text-ash-gray hover:text-marlboro-red p-2 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "REQUESTS" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-center font-bold text-ash-gray uppercase tracking-widest text-xs py-8">
                No pending requests.
              </p>
            ) : (
              requests.map(req => (
                <div key={req.id} className="flex items-center justify-between border-b-[3px] border-ink-black/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-paper-white border-[2px] border-ink-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
                      {req.sender.avatar_species === 'Fox' ? '🦊' : req.sender.avatar_species === 'Wolf' ? '🐺' : '👤'}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-black uppercase tracking-tight">{req.sender.anonymous_username}</h4>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAccept(req.id, req.sender)}
                      className="bg-filter-gold text-ink-black p-2 border-[2px] border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="bg-paper-white text-ink-black hover:bg-marlboro-red hover:text-paper-white p-2 border-[2px] border-ink-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "ADD" && (
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by anonymous username..."
                className="flex-1 bg-paper-white border-[3px] border-ink-black p-3 text-ink-black font-medium text-sm focus:outline-none focus:border-marlboro-red transition-colors"
              />
              <button 
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="bg-ink-black text-paper-white px-6 font-bold uppercase tracking-widest text-xs border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 transition-all"
              >
                Find
              </button>
            </form>

            {searchResults && (
              <div className="flex items-center justify-between p-4 border-[3px] border-ink-black bg-checkered">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-paper-white border-[2px] border-ink-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(11,11,15,1)]">
                    {searchResults.avatar_species === 'Fox' ? '🦊' : searchResults.avatar_species === 'Wolf' ? '🐺' : '👤'}
                  </div>
                  <h4 className="font-bold text-ink-black uppercase tracking-tight">{searchResults.anonymous_username}</h4>
                </div>
                <button 
                  onClick={() => handleAddFriend(searchResults.id)}
                  className="bg-marlboro-red text-paper-white px-4 py-2 text-xs font-bold uppercase tracking-widest border-[2px] border-ink-black shadow-[2px_2px_0px_0px_rgba(11,11,15,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      </PixelCard>
    </div>
  );
}
