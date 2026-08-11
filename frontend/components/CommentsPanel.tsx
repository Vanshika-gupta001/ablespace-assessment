'use client';

import { useState, type FormEvent } from 'react';
import type { Comment } from '@/lib/types';
import { Avatar } from './Avatar';

interface CommentsPanelProps {
  comments: Comment[];
  onAdd: (content: string) => Promise<void>;
}

export function CommentsPanel({ comments, onAdd }: CommentsPanelProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(content.trim());
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
        Updates
      </h3>

      <div className="flex flex-col gap-4">
        {comments.length === 0 && (
          <p className="text-sm text-slate-400">No updates yet.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar name={comment.authorName} />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {comment.authorName}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-start gap-2 border-t border-black/5 pt-4 dark:border-white/5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          placeholder="Add a comment..."
          disabled={submitting}
          className="flex-1 resize-none rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent dark:border-white/10 dark:text-white"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
