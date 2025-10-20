import {fetchUtils, DataProvider} from "react-admin"
import jsonServerProvider from "ra-data-json-server";


const fetchJsonUtil=(url:string, options:fetchUtils.Options={})=>{
	url = url.replace(/\/$/, '');
	if(!options.headers){
		options.headers=new Headers({Accept: "application/json"});
	} else if (!(options.headers instanceof Headers)) {
		options.headers = new Headers(options.headers);
	}
	const authToken = sessionStorage.getItem("auth");
	if (authToken) {
		options.headers.set("Authentication", authToken);
	}
	return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL, fetchJsonUtil
);

// Extender el dataProvider para manejar endpoints del dashboard
// react admin solo contempla crud estandar para sus metodos predefinidos
export const dataProvider: DataProvider = {
  ...baseDataProvider,  // se desctructura el provider base de react-admin
  

  //sobreescribimos metodos para manejar nuestros endpoints
  getOne: async (resource, params) => {
    // Manejar endpoint de estadisticas del dashboard
    if (resource === 'dashboard/estadisticas') {
      const url = `${import.meta.env.VITE_JSON_SERVER_URL}/dashboard/estadisticas`;
      const { json } = await fetchJsonUtil(url);
      return { data: { id: 'stats', ...json } };
    }
    
    // Manejar endpoint de usuario actual
    if (resource === 'me') {
      const url = `${import.meta.env.VITE_JSON_SERVER_URL}/me`;
      const { json } = await fetchJsonUtil(url);
      return { data: { id: json.usuario, ...json } };
    }
    
    // Para otros recursos, usar el comportamiento estandar
    return baseDataProvider.getOne(resource, params);
  },
  
  getList: async (resource, params) => {
    // Manejar endpoints del dashboard
    if (resource === 'dashboard/reportes-recientes' || resource === 'dashboard/notas-recientes') {
      const { pagination = { page: 1, perPage: 10 } } = params;
      const url = `${import.meta.env.VITE_JSON_SERVER_URL}/${resource}?limit=${pagination.perPage}`;
      const { json } = await fetchJsonUtil(url);
      return {
        data: json,
        total: json.length
      };
    }
    
    // Para otros recursos, usar el comportamiento por defecto
    return baseDataProvider.getList(resource, params);
  }
};