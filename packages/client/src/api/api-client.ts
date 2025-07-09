import { getToken } from "@/lib/utils";

type RequestBody = Record<string, string> & { token?: string };

type RequestProps = {
    path: string
    method?: "GET" | "POST"
    body?: RequestBody
    query?: Record<string, string>
}

export class ApiClient {
    private readonly baseUrl: string;
    setLoader: ((value: boolean) => void) | undefined;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    addSetLoader (cb: (value: boolean) => void) {
        this.setLoader = cb
    }

    async request<T>(props: RequestProps): Promise<T> {
        if(this.setLoader) {
            this.setLoader(true)
        }
        const { path = "/", body = {}, method = "POST", query = {} } = props

        const token = getToken() || (body.token as string | undefined);

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const url = new URL(path, this.baseUrl);

        Object.entries(query).forEach(([key, val]) => url.searchParams.set(key, val))

        const res = await fetch(url, {
            method,
            headers,
            body: body && method === 'POST' ? JSON.stringify(body) : undefined,
        });

        if(this.setLoader) {
            this.setLoader(false)
        }
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API error ${res.status}: ${errorText}`);
        }

        return res.json();
    }

    public auth = {
        login: <T>(data: { email: string; password: string }) => this.request<T>({ path: "/auth/login", method: 'POST', body: data }),
        register: <T>(data: { email: string; password: string }) => this.request<T>({ path: "/auth/register", method: 'POST', body: data }),
    };

    public message = {
        send: <T>(data: { toId: string, text: string, type: 'ROOM' | 'USER' }) => this.request<T>({ path: "/message", body: data, method: 'POST' }),
        getUserMessages: <T>(userId: string) => this.request<T>({ path: "/message/user", method: 'GET', query: { user: userId } }),
        getRoomMessages: <T>(room: Room) => this.request<T>({ path: "/message/room", method: 'GET', query: { room: room.id } }),
    }
    public room = {
        create: <T>(name: string) => this.request<T>({ path: "/room", body: { room: name }, method: 'POST' }),
        getRooms: <T>() => this.request<T>({ path: "/room", method: 'GET' }),
    }
}

export const apiClient = new ApiClient(
    process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_API_HOST_DEV!
        : process.env.NEXT_PUBLIC_API_HOST_PROD!
);
