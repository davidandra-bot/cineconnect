'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  like_count: number;
  user: {
    username: string;
    avatar_url: string | null;
  };
  reactions: Reaction[];
}

interface Reaction {
  id: string;
  user_id: string;
  reaction_type: string;
}

interface CommentSectionProps {
  targetId: string;
  targetType: 'movie' | 'review';
}

export default function CommentSection({ targetId, targetType }: CommentSectionProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [targetId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:user_id(username, avatar_url),
          reactions:reactions(reaction_type, user_id)
        `)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          target_type: targetType,
          target_id: targetId,
          content: newComment.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      const commentWithUser = {
        ...data,
        user: {
          username: user.email?.split('@')[0] || 'Anonymous',
          avatar_url: null,
        },
        reactions: [],
      };

      setComments([commentWithUser, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (commentId: string, reactionType: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      const existingReaction = comments
        .find(c => c.id === commentId)
        ?.reactions?.find(r => r.user_id === user.id);

      if (existingReaction) {
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reactions')
          .insert({
            user_id: user.id,
            target_type: 'comment',
            target_id: commentId,
            reaction_type: reactionType,
          });

        if (error) throw error;
      }

      await loadComments();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-text-muted">Loading comments...</div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-serif text-gold mb-6">💬 Discussion</h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Write a comment..." : "Sign in to comment"}
              disabled={!user}
              className="w-full px-4 py-3 bg-surface-elevated border border-gray-700 rounded-lg text-white focus:border-gold focus:outline-none transition resize-none"
              rows={2}
            />
          </div>
          <button
            type="submit"
            disabled={!user || submitting || !newComment.trim()}
            className="px-6 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/80 transition disabled:opacity-50 disabled:cursor-not-allowed self-start"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        {!user && (
          <p className="mt-2 text-sm text-text-muted">
            <button
              type="button"
              onClick={() => router.push('/auth')}
              className="text-gold hover:underline"
            >
              Sign in
            </button>{' '}
            to join the discussion
          </p>
        )}
      </form>

      {comments.length === 0 ? (
        <p className="text-text-muted text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-surface-elevated rounded-xl border border-gray-800"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  {comment.user?.avatar_url ? (
                    <Image
                      src={comment.user.avatar_url}
                      alt={comment.user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-gold text-sm font-bold">
                      {comment.user?.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span className="text-text-muted text-sm">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">{comment.content}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleReaction(comment.id, 'like')}
                      className="flex items-center gap-1 text-sm text-text-muted hover:text-electric-blue transition"
                    >
                      ❤️ {comment.reactions?.length || 0}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
