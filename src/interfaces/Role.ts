export interface Role {
    created_at?: string;
    id: string; // ex: "admin", "caixa", "gestor"
    name: string; // nome descritivo da role
    permissions: string[]; // ex: ["users.create", "roles.read"]
}