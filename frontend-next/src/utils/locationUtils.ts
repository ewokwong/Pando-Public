// Location Utils
export const formatCityOption = (city: any) => ({
  value: `${city.name}, ${city.country}`,
  label: `${city.name}${city.region ? `, ${city.region}` : ""}, ${city.country}`,
  city: {
    id: city.id,
    name: city.name,
    country: city.country,
    countryCode: city.countryCode,
    region: city.region,
    regionCode: city.regionCode,
    latitude: city.latitude,
    longitude: city.longitude,
  },
});

export const getLocationPayload = (selectedCity: any) => ({
  displayName: selectedCity.value, // Human-readable name
  latitude: selectedCity.city.latitude, // Latitude coordinate
  longitude: selectedCity.city.longitude, // Longitude coordinate
});
