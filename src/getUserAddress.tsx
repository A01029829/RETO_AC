export const getUserAddress = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          if (data && data.display_name) {
            resolve(data.display_name);
          } else {
            reject("No se pudo obtener la dirección.");
          }
        } catch (error) {
          console.error(error);
          reject("Error al obtener la dirección.");
        }
      },
      (err) => {
        alert("No se pudo obtener geolocalización");
        console.log(err);
        reject(err);
      },
    );
  });
};
