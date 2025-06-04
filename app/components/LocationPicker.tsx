import React from 'react';
import { useGeoLocation } from '../hooks/useGeolocation';

interface LocationPickerProps {
  onLocationChange: (location: string) => void;
  onZipChange: (zip: string) => void;
  onCoordinatesChange: (lat: number | null, lng: number | null) => void;
  currentLocation?: string;
  currentZip?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationChange,
  onZipChange,
  onCoordinatesChange,
  currentLocation,
}) => {
  const {
    addressMethod,
    setAddressMethod,
    location,
    latitude,
    longitude,
    zipCode,
    setZipCode,
    isDetectingLocation,
    locationPermission,
  } = useGeoLocation();

  const [manualAddress, setManualAddress] = React.useState(currentLocation || "");

  React.useEffect(() => {
    if (addressMethod === "automatic" && location) {
      onLocationChange(location);
      onCoordinatesChange(latitude, longitude);
    } else if (addressMethod === "manual" && manualAddress) {
      onLocationChange(manualAddress);
      onCoordinatesChange(null, null);
    }
  }, [addressMethod, location, manualAddress, latitude, longitude, onLocationChange, onCoordinatesChange]);

  React.useEffect(() => {
    if (zipCode) {
      onZipChange(zipCode);
    }
  }, [zipCode, onZipChange]);

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualAddress(value);
    if (addressMethod === "manual") {
      onLocationChange(value);
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZipCode(value);
    onZipChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <label
          className={`bg-white flex items-center p-3 border rounded-md cursor-pointer ${
            addressMethod === "automatic"
              ? "border-accent bg-accent/10"
              : "border-gray-300"
          }`}
        >
          <input
            type="radio"
            value="automatic"
            checked={addressMethod === "automatic"}
            onChange={() => setAddressMethod("automatic")}
            className="mr-2"
          />
          Автоматска локација
        </label>

        <label
          className={`bg-white flex items-center p-3 border rounded-md cursor-pointer ${
            addressMethod === "manual"
              ? "border-accent bg-accent/10"
              : "border-gray-300"
          }`}
        >
          <input
            type="radio"
            value="manual"
            checked={addressMethod === "manual"}
            onChange={() => setAddressMethod("manual")}
            className="mr-2"
          />
          Внесете адреса
        </label>
      </div>

      {addressMethod === "automatic" ? (
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
          {isDetectingLocation ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <span>Детектирање на локација...</span>
            </div>
          ) : (
            <div>
              <p className="font-medium">Локација:</p>
              <p>{location}</p>
              {latitude && longitude && (
                <p className="text-sm text-gray-500 mt-1">
                  Координати: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              )}
            </div>
          )}
          {locationPermission === "denied" && (
            <p className="text-sm text-red-500 mt-2">
              Дозвола за локација е одбиена. Овозможете ја во поставките на
              прелистувачот.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Внесете адреса"
            value={manualAddress}
            onChange={handleManualAddressChange}
            className="input-default"
            required
          />

          <input
            type="text"
            placeholder="Поштенски код"
            maxLength={4}
            value={zipCode}
            onChange={handleZipChange}
            className="input-default"
            required
          />
        </div>
      )}
    </div>
  );
};

export default LocationPicker; 