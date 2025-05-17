export interface TokenPayload {
  userId: string;
  id: string;
  email: string;
  role: string;
  organizationId?: string; // Ajout de cette propriété
  mainRole?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
    mainRole?: string;
    [key: string]: any;
  };
}
