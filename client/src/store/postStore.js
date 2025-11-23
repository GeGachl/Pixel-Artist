import { create } from 'zustand'

export const usePosts = create((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  clearPosts: () => set({ posts: [] }),
}))
