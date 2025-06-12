import axios from "axios";

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
            console.log("못받아옴 ㅅㄱ");
            throw error;
        }
    }
}

export const api = new ApiFetcher();