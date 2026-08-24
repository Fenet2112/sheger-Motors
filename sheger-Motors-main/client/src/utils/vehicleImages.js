export function getVehicleImages(vehicle) {
  if (!vehicle || !Array.isArray(vehicle.images)) return [];
  return vehicle.images.filter((image) => image?.image_url);
}

export function getPrimaryImageUrl(vehicle) {
  return getVehicleImages(vehicle)[0]?.image_url || null;
}
