interface GeocodeResult {
  city: string | null;
  province: string | null;
}

/**
 * Reverse geocode coordinates to city + province using OpenStreetMap Nominatim
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodeResult> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
      {
        headers: {
          "User-Agent": "HeartLink-DatingApp/1.0",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Nominatim API error");
    }

    const data = await res.json();
    const address = data.address || {};

    return {
      city:
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        null,
      province: address.state || null,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return { city: null, province: null };
  }
}
