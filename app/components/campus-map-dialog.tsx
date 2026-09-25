'use client';

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, MapPin, Navigation, X } from "lucide-react";
import { useLocale } from "../i18n";

type Coordinates = [number, number];

type MapGLMapInstance = {
  destroy: () => void;
};

type MapGLApi = {
  Map: new (
    containerId: string,
    options: { center: Coordinates; zoom: number; key: string },
  ) => MapGLMapInstance;
  Marker: new (map: MapGLMapInstance, options: { coordinates: Coordinates }) => unknown;
};

declare global {
  interface Window {
    mapgl?: MapGLApi;
  }
}

const mapCenter: Coordinates = [51.941201, 47.133145];
const buildingTwoPin: Coordinates = [51.940272, 47.131842];

type CampusMapDialogProps = {
  isOpen: boolean;
  locationId: string;
  locationName: string;
  address: string;
  mapUrl: string;
  onClose: () => void;
};

export function CampusMapDialog({
  isOpen,
  locationId,
  locationName,
  address,
  mapUrl,
  onClose,
}: CampusMapDialogProps) {
  const { t } = useLocale();
  const mapContainerId = `aogu-map-${useId().replace(/:/g, "")}`;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapGLMapInstance | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_2GIS_MAPGL_KEY?.trim() ?? "";
  const hasExactPin = locationId === "building-2";

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !apiKey || !scriptReady || !window.mapgl || !mapContainerRef.current) return;

    setMapFailed(false);
    const pin = hasExactPin ? buildingTwoPin : undefined;
    let map: MapGLMapInstance | undefined;
    let errorTimeout: number | undefined;

    try {
      map = new window.mapgl.Map(mapContainerId, {
        center: pin ?? mapCenter,
        zoom: pin ? 17 : 14,
        key: apiKey,
      });

      if (pin) new window.mapgl.Marker(map, { coordinates: pin });
      mapRef.current = map;
    } catch {
      errorTimeout = window.setTimeout(() => setMapFailed(true), 0);
    }

    return () => {
      if (errorTimeout !== undefined) window.clearTimeout(errorTimeout);
      map?.destroy();
      if (mapRef.current === map) mapRef.current = null;
    };
  }, [apiKey, hasExactPin, isOpen, locationId, mapContainerId, scriptReady]);

  if (!isOpen) return null;

  return (
    <div className="map-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="map-dialog" role="dialog" aria-modal="true" aria-labelledby="map-dialog-title">
        <header className="map-dialog-header">
          <span className="map-dialog-icon"><MapPin size={19} /></span>
          <div className="map-dialog-heading">
            <span className="eyebrow">{t("mapDialogEyebrow")}</span>
            <h2 id="map-dialog-title">{locationName}</h2>
            <p>{address}</p>
          </div>
          <button className="map-dialog-close" onClick={onClose} aria-label={t("close")}><X size={18} /></button>
        </header>

        {apiKey && !mapFailed ? (
          <div className="mapgl-canvas" id={mapContainerId} ref={mapContainerRef}>
            <Script
              src="https://mapgl.2gis.com/api/js/v1"
              strategy="afterInteractive"
              onReady={() => {
                setMapFailed(false);
                setScriptReady(true);
              }}
              onError={() => setMapFailed(true)}
            />
          </div>
        ) : (
          <div className="mapgl-fallback" role="status">
            <span><MapPin size={24} /></span>
            <strong>{t(mapFailed ? "mapLoadFailed" : "mapKeyMissing")}</strong>
            <p>{hasExactPin ? t("mapPinBuilding2") : t("mapCenterGeneral")}</p>
          </div>
        )}

        <footer className="map-dialog-footer">
          <p>{hasExactPin ? t("mapPinBuilding2") : t("mapCenterGeneral")}</p>
          <a href={mapUrl} target="_blank" rel="noreferrer">
            <Navigation size={15} />{t("open2gis")}<ArrowUpRight size={14} />
          </a>
        </footer>
      </section>
    </div>
  );
}