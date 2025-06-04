import { useState } from 'react';
import { Post } from '../types/Post';
import { toast } from 'react-hot-toast';

interface PostsResponse {
    posts: Post[];
    pagination: {
        total: number;
        pages: number;
        current: number;
    };
    error?: string;
}

interface UsePostsOptions {
    limit?: number;
    zipCode?: string;
}

export function usePosts(options: UsePostsOptions = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        current: 1,
    });

    const fetchPosts = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: (options.limit || 10).toString(),
            });

            if (options.zipCode) {
                params.append('zipCode', options.zipCode);
            }

            const response = await fetch(`/api/posts?${params}`);
            const data: PostsResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch posts');
            }

            setPosts(data.posts);
            setPagination(data.pagination);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unexpected error occurred';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (postData: Partial<Post>) => {
        try {
            setLoading(true);
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            setPosts((prev) => [data, ...prev]);
            toast.success('Post created successfully');
            return data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unexpected error occurred';
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (id: string, updateData: Partial<Post>) => {
        try {
            setLoading(true);
            const response = await fetch('/api/posts', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, ...updateData }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update post');
            }

            setPosts((prev) =>
                prev.map((post) => (post.id === id ? { ...post, ...updateData } : post))
            );
            toast.success('Post updated successfully');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unexpected error occurred';
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/posts?id=${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete post');
            }

            setPosts((prev) => prev.filter((post) => post.id !== id));
            toast.success('Post deleted successfully');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unexpected error occurred';
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        posts,
        loading,
        error,
        pagination,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
    };
}
