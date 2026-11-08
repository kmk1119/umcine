import { create } from "zustand";

interface ProfilePreview {
  email: string;
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const useProfilePreview = create<ProfilePreview>((set) => ({
  email: "member@example.com",
  nickname: "영화친구",
  setNickname: (nickname) => set({ nickname }),
}));
