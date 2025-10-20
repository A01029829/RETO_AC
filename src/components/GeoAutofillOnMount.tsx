import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useNotify } from "react-admin";
import { getUserAddressDetails } from "../utils/getUserAddress";

const GeoAutofillOnMount = () => {
  const notify = useNotify();
  const ran = useRef(false);
  
  // Obtener el contexto del formulario de forma segura
  const formContext = useFormContext();
  
  // Si no hay contexto, retornar null sin hacer nada
  if (!formContext) {
    return null;
  }
  
  const { setValue, getValues } = formContext;

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const { calle, colonia, alcaldia_municipio } = getValues();
        if (calle || colonia || alcaldia_municipio) return;

        const data = await getUserAddressDetails();
        console.log("Datos de dirección obtenidos:", data);

        // data ya es el objeto AddressDetails procesado
        const calleStr = [data.road, data.house_number].filter(Boolean).join(" ");
        const coloniaStr =
          data.neighbourhood || data.suburb || "";
        const municipioStr =
          data.city || data.town || data.municipality || "";

        setValue("calle", data.addressLine || calleStr);
        setValue("colonia", coloniaStr);
        setValue("alcaldia_municipio", municipioStr);

        if (data.lat && data.lon) {
          setValue("lat", data.lat);
          setValue("lng", data.lon);
        }

        notify("Ubicación detectada y campos completados");
        console.log("Dirección completa:", data.addressLine);
      } catch (e) {
        console.error(e);
        notify("No se pudo obtener la ubicación automáticamente", {
          type: "warning",
        });
      }
    })();
  }, [getValues, notify, setValue]);

  return null;
};

export default GeoAutofillOnMount;
