// api/ApiFetcher.ts
import axios from "axios";
import type { Place } from "../@types/types";

export class ApiFetcher {
    private baseUrl: string;

    constructor() {
        this.baseUrl = "http://localhost:3000"
    }

    async getList<T>(endpoint: string): Promise<T> {
        try {
            const res = await axios.get(`${ this.baseUrl }${ endpoint }`)
            return res.data;
        }
        catch (error: unknown) {
            console.log("데이터를 받아오지 못했습니다.");
            throw error;
        }
    }

    async PostList<T>(endpoint: string, data: { place: Place }): Promise<T> {
        try {
            const res = await axios.post(`${ this.baseUrl }${ endpoint }`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return res.data;
        } catch (error: unknown) {
            console.error("POST 요청 중 오류 발생:", error);
            throw error;
        }
    }
    async GetFavorites(): Promise<Place[]> {
        const res = await this.getList<{ places: Place[] }>('/users/places');
        return res.places;
    }

    async DeleteFavorite(id: string): Promise<void> {
        await fetch(`${this.baseUrl}/users/places/${id}`, { method: 'DELETE' });
    }
}

export const api = new ApiFetcher();