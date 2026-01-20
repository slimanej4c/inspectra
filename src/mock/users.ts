export type MockUser = {
  id: string;
  email: string;
  password: string;
  name: string;          // ❗ obligatoire
  fullName: string;      // ❗ obligatoire
  role: "admin" | "viewer" | "editor"; // ❗ obligatoire
};

  export const MOCK_USERS: MockUser[] = [
    { id: "u1", email: "admin@inspectra.com", password: "123456", name: "Admin", role: "admin" , fullName: "Compte Démo"},
    { id: "u2", email: "tech@inspectra.com", password: "123456", name: "Technicien", role: "editor", fullName: "Compte Démo" },
  ];

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
  