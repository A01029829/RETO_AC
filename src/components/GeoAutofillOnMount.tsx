import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useNotify } from "react-admin";
import { getUserAddressDetails } from "../utils/getUserAddress";
import { parse } from "path";

const GeoAutofillOnMount = () => {
  const { setValue, getValues } = useFormContext();
  const notify = useNotify();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const { calle, colonia, alcaldia_municipio } = getValues();
        if (calle || colonia || alcaldia_municipio) return;

        const data = await getUserAddressDetails();
        const a = data.address ?? data;
        console.log("Datos de dirección crudos FORM:", a);

        const calleStr = [a.road, a.house_number].filter(Boolean).join(" ");
        const coloniaStr =
          a.neighbourhood || a.suburb || a.quarter || a.residential || "";
        const municipioStr =
          a.city || a.town || a.village || a.municipality || a.county || "";

        setValue("calle", a.addressLine);
        setValue("colonia", coloniaStr);
        setValue("alcaldia_municipio", municipioStr);

        if (data.lat && data.lon) {
          setValue("lat", parseFloat(data.lat));
          setValue("lng", parseFloat(data.lon));
        }

        notify("Ubicación detectada y campos completados");
        console.log("Reverse geocoding:", data.display_name || calleStr);
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
