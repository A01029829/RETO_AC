import {fetchUtils} from "react-admin"
import jsonServerProvider from "ra-data-json-server";


const fetchJsonUtil=(url:string, options:fetchUtils.Options={})=>{
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

export const dataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL, fetchJsonUtil);