import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function useGeoLocation() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [location, setLocation] = useState("Вашата локација...");
  const [zipCode, setZipCode] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [permission, setPermission] = useState<PermissionState>("prompt");
  const [addressMethod, setAddressMethod] = useState<"automatic" | "manual">(
    "automatic"
  );

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        setPermission(status.state);
        status.onchange = () => setPermission(status.state);
      });
    }
  }, []);

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (data.address) {
        const parts = [
          data.address.road,
          data.address.city,
          data.address.country,
        ].filter(Boolean);

        setLocation(parts.join(", "));
        if (data.address.postcode) setZipCode(data.address.postcode);
      } else {
        setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        toast.error("Не е пронајдена локација");
      }
    } catch {
      toast.error("Грешка при пристап до локација");
    } finally {
      setIsDetecting(false);
    }
  };

  const resetLocation = () => {
    setLatitude(null);
    setLongitude(null);
    setLocation("Вашата локација...");
  };

  useEffect(() => {
    if (addressMethod === "automatic") {
      detectLocation();
    } else {
      resetLocation();
    }
  }, [addressMethod]);

  return {
    addressMethod,
    setAddressMethod,
    location,
    latitude,
    longitude,
    zipCode,
    setZipCode,
    isDetectingLocation: isDetecting,
    locationPermission: permission,
  };
}
