import { AuthProvider } from "react-admin";

type StoredUser = {
  id: string;
  name: string;
  role: "admin" | "operator" | "guest";
};

const KEY = "ra_user";

export const authProvider: AuthProvider = {
  // called when the user attempts to log in
  async login({ username, password }) {
    // accept all username/password combinations
    if (password !== "tc2007b") {
      throw new Error("Invalid credentials, please try again");
    }
    const role: StoredUser["role"] =
      username === "operator" ? "operator" : "admin";
    const user: StoredUser = { id: username, name: username, role };
    localStorage.setItem(KEY, JSON.stringify(user));
  },
  async logout() {
    localStorage.removeItem(KEY);
  },
  // called when the API returns an error
  async checkError({ status }: { status: number }) {
    if (status === 401 || status === 403) {
      localStorage.removeItem(KEY);
      throw new Error("Session expired");
    }
  },
  // called when the user navigates to a new location, to check for authentication
  async checkAuth() {
    if (!localStorage.getItem(KEY)) {
      throw new Error("Authentication required");
    }
  },
  async getPermissions() {
    const raw = localStorage.getItem(KEY);
    const user: StoredUser | null = raw ? JSON.parse(raw) : null;
    return user?.role ?? "guest";
  },
  async getIdentity() {
    const raw = localStorage.getItem(KEY);
    const user: StoredUser | null = raw ? JSON.parse(raw) : null;
    if (!user) throw new Error("No identity");
    return { id: user.id, fullName: user.name, role: user.role };
  },
};
