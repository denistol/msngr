import { create } from "zustand";

type LoaderState = {
    loading: boolean,
    setLoading: (value: boolean) => void

};

export const useLoaderStore = create<LoaderState>((set, get) => ({
    loading: false,
    setLoading: (loading) => {
        set({ loading })
    }
}));
