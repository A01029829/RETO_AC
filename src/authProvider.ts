import { AuthProvider } from "react-admin";

// type StoredUser = {
//   id: string;
//   name: string;
//   role: "admin" | "operator" | "guest" | "jefeDeTurno" | "operatorU";
// };

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request("http://127.0.0.1:3000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    
    try {
      const res = await fetch(request);
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.statusText);
      }
      
      const auth = await res.json();
      sessionStorage.setItem("auth", auth.token);
      sessionStorage.setItem(
        "identity",
        JSON.stringify({ id: auth.id, fullName: auth.nombre })
      );
      return Promise.resolve();
    } catch {
      throw new Error("Error en usuario o password");
    }
  },

  logout: ()=>{
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("identity");
        return Promise.resolve();
  },
  checkAuth: ()=>{
    return sessionStorage.getItem("auth")?Promise.resolve():Promise.reject()
  },
  checkError: (error)=>{
      const status=error.status;
      if(status==401 || status==403){
          sessionStorage.removeItem("auth");
          sessionStorage.removeItem("identity");
          return Promise.reject();
      }
      return Promise.resolve();
  },
  getPermissions: () =>{
    return Promise.resolve();
  },
  getIdentity: () => {
    const identity = sessionStorage.getItem("identity");
    //const user: StoredUser | null = raw ? JSON.parse(raw) : null;
    if (!identity) {
      return Promise.reject(new Error("No identity"));
    }
    return Promise.resolve(JSON.parse(identity));
      //throw new Error("No identity");
    //return { id: user.id, fullName: user.name, role: user.role };
  },
}

export default authProvider;
