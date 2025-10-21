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

// Extencion del dataProvider para adaptarlo con el endpoint
export const dataProvider: DataProvider = {
  ...baseDataProvider,

  //sobreescribimos metodo getOne para manejar endpoint /me
  getOne: async (resource, params) => {
    // Manejar endpoint de usuario actual
    if (resource === 'me') {
      const url = `${import.meta.env.VITE_JSON_SERVER_URL}/me`;
      const { json } = await fetchJsonUtil(url);
      return { data: { id: json.usuario, ...json } };
    }
    
    // Para otros recursos, usar el comportamiento estandar
    return baseDataProvider.getOne(resource, params);
  }
};