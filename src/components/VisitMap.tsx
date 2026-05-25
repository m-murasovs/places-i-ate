'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { VisitWithPlace } from '@/Server/VisitService/VisitService';

const RATING_COLORS: Record<string, string> = {
    'S': '#facc15',
    '5': '#10b981',
    '4': '#34d399',
    '3': '#fbbf24',
    '2': '#f97316',
    '1': '#ef4444',
};

function createIcon(rating: string) {
    const color = RATING_COLORS[rating] ?? '#6b7280';
    return L.divIcon({
        className: '',
        html: `<div style="
            background: ${color};
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 13px;
            border: 2px solid white;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        ">${rating}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
}

function FitBounds({ visits }: { visits: VisitWithPlace[] }) {
    const map = useMap();

    useEffect(() => {
        const points = visits
            .filter((v) => v.place.latitude !== 0 || v.place.longitude !== 0)
            .map((v) => [v.place.latitude, v.place.longitude] as [number, number]);

        if (points.length === 0) return;

        const bounds = L.latLngBounds(points);

        const fitOnce = () => {
            map.invalidateSize();
            map.fitBounds(bounds, { padding: [40, 40] });
        };

        const container = map.getContainer();
        const observer = new ResizeObserver(() => {
            fitOnce();
            observer.disconnect();
        });
        observer.observe(container);

        fitOnce();

        return () => observer.disconnect();
    }, [visits, map]);

    return null;
}

export default function VisitMap({ visits }: { visits: VisitWithPlace[] }) {
    const validVisits = visits.filter(
        (v) => v.place.latitude !== 0 || v.place.longitude !== 0
    );
    const hiddenCount = visits.length - validVisits.length;

    if (validVisits.length === 0) {
        return <p className='text-gray-500'>No visits with coordinates to show on the map.</p>;
    }

    const center = {
        lat: validVisits[0].place.latitude,
        lng: validVisits[0].place.longitude,
    };

    return (
        <div>
            {hiddenCount > 0 && (
                <p className='text-sm text-amber-600 mb-2'>
                    {hiddenCount} {hiddenCount === 1 ? 'visit' : 'visits'} without coordinates {hiddenCount === 1 ? 'is' : 'are'} not shown on the map.
                </p>
            )}
            <div className='h-[calc(100vh-12rem)] sm:h-[600px] w-full rounded-lg overflow-hidden shadow-md'>
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <FitBounds visits={validVisits} />
                <MarkerClusterGroup chunkedLoading>
                    {validVisits.map((visit) => (
                        <Marker
                            key={visit.id}
                            position={[visit.place.latitude, visit.place.longitude]}
                            icon={createIcon(visit.rating)}
                        >
                            <Popup>
                                <div style={{ minWidth: '200px', fontFamily: 'system-ui, sans-serif' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                                        {visit.place.name}
                                    </div>
                                    <div style={{
                                        display: 'inline-block',
                                        backgroundColor: RATING_COLORS[visit.rating] ?? '#6b7280',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px',
                                    }}>
                                        {visit.rating === 'S' ? 'S-tier' : `${visit.rating}/5`}
                                    </div>
                                    {visit.review && (
                                        <div style={{ fontStyle: 'italic', color: '#78716c', marginBottom: '8px' }}>
                                            {visit.review}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '12px', color: '#a8a29e' }}>
                                        {new Date(visit.visitDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
            </div>
        </div>
    );
}
