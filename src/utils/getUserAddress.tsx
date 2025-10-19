type AddressDetails = {
  addressLine: string; // "Calle 123, Colonia, Ciudad, CP"
  road?: string; // Calle
  house_number?: string; // Número
  neighbourhood?: string; // Barrio/colonia (a veces viene como "suburb")
  suburb?: string;
  city?: string;
  town?: string;
  municipality?: string;
  state?: string;
  postcode?: string;
  country?: string;
  lat: number;
  lon: number;
};

export const getUserAddressDetails = async (): Promise<AddressDetails> => {
  //console.log("Entre a locaciones");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=es&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

          const response = await fetch(url, {
            headers: {
              // Buenas prácticas con Nominatim (identifícate)
              "User-Agent": "tu-app/1.0 (tu-email@dominio.com)",
            },
          });

          const data = await response.json();
          console.log("Respuesta cruda de Nominatim:", data);

          if (!data?.address) {
            return reject("No se pudo obtener la dirección.");
          }

          const a = data.address as any;
          console.log("Datos de dirección crudos:", a);

          const road =
            a.road || a.pedestrian || a.footway || a.path || a.cycleway;
          const house_number = a.house_number;
          const neighbourhood = a.neighbourhood || a.quarter || a.suburb;
          const city = a.city || a.town || a.village || a.municipality;
          const state = a.state;
          const postcode = a.postcode;
          const country = a.country;

          // Línea legible: "Calle 123, Colonia, Ciudad, CP"
          const parts = [
            [road, house_number].filter(Boolean).join(" "),
            neighbourhood,
            city,
            postcode,
          ].filter(Boolean);

          const addressLine = parts.join(", ");

          resolve({
            addressLine,
            road,
            house_number,
            neighbourhood,
            suburb: a.suburb,
            city,
            municipality: a.municipality,
            state,
            postcode,
            country,
            lat: latitude,
            lon: longitude,
          });
        } catch (error) {
          console.error(error);
          reject("Error al obtener la dirección.");
        }
      },
      (err) => {
        console.log(err);
        reject("No se pudo obtener geolocalización");
      },
      // Opcional: mejora de precisión
      // { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};
