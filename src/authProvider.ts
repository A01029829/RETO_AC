import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const apiUrl = import.meta.env.VITE_JSON_SERVER_URL || "http://127.0.0.1:3000";
    const request = new Request(`${apiUrl}/login`, {
      method: "POST",
      body: JSON.stringify({ usuario: username, password }), // ← CAMBIO AQUÍ
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
        JSON.stringify({ 
          id: auth.id, 
          fullName: auth.nombre,
          role: auth.tipo})
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
  
  getIdentity: () => {
    const identity = sessionStorage.getItem("identity");
    if (!identity) {
      return Promise.reject(new Error("No identity"));
    }
    return Promise.resolve(JSON.parse(identity));
  },

  getPermissions: () =>{
    const identity = sessionStorage.getItem("identity");
    if (identity) {
      return Promise.resolve(JSON.parse(identity).role);
    }
    return Promise.reject(new Error("No identity"));
  },
};