export interface User {
    created_at?: string;
    id: string;
    email: string | null;
    displayName: string | null;
    role: string;
}