import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, deleteFavorite, getFavorite, getFavorites } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavorites() {
  const token = useAuthStore((state) => state.accessToken);
  return useQuery({ queryKey: ["favorites", "list"], queryFn: ({ signal }) => getFavorites(signal), enabled: Boolean(token), retry: false });
}
export function useFavorite(movieId: number) {
  const token = useAuthStore((state) => state.accessToken);
  return useQuery({ queryKey: ["favorites", "detail", movieId], queryFn: ({ signal }) => getFavorite(movieId, signal), enabled: Boolean(token), retry: false });
}
export function useFavoriteMutation(movieId: number) {
  const client = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  return useMutation({
    mutationKey: ["favorite-toggle", movieId],
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await deleteFavorite(movieId);
      else await addFavorite(movieId);
      return !isFavorite;
    },
    onSuccess: async (isFavorite) => {
      if (useAuthStore.getState().accessToken !== token) return;
      await client.cancelQueries({ queryKey: ["favorites", "detail", movieId] });
      client.setQueryData(["favorites", "detail", movieId], { isFavorite });
      await client.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
  });
}
