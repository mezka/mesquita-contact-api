function parseGeoData(geoData) {
    if (!geoData) return null;
  
    return {
      city: geoData.city?.names?.es || 'No disponible',
      region: geoData.subdivisions?.[0]?.names?.es || 'No disponible',
      country: geoData.country?.names?.es || 'No disponible',
      latitude: geoData.location?.latitude || 'No disponible',
      longitude: geoData.location?.longitude || 'No disponible'
    };
  }