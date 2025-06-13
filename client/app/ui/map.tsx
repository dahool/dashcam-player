import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { type LatLngExpression } from 'leaflet'
import { useGetMapPointsQuery } from '~/api/slice'

/*
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'marker-icon-2x.png',
    iconUrl: 'marker-icon.png',
    shadowUrl: 'marker-shadow.png',
})
*/

export function Map({ source }: { source?: string }) {

    const [polylinePositions, setPolylinePositions] = useState<any>([])
    const [centerPoint, setCenterPoint] = useState<LatLngExpression>([0, 0])

    const {
        data: mapPointsData,
        isLoading,     // True on initial load and when refetching without existing data
        isFetching,    // True whenever a request is in flight (initial, refetch, background)
        isSuccess,     // True if the query was successful and data is available
        isError,       // True if the query resulted in an error
    } = useGetMapPointsQuery(source!, {
        skip: !source, // only run if 'source' is defined
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (mapPointsData) {
            // Prepare data for the Polyline (only lat, lon)
            const polylineData = mapPointsData.map(point => [point.latitude, point.longitude])
            setPolylinePositions(polylineData)

            const center = mapPointsData[mapPointsData.length / 2]
            setCenterPoint([center.latitude, center.longitude])
        }
    }, [ isSuccess, mapPointsData ])

    if (isLoading || isFetching) {
        return LoadingSkeleton()
    }

    if (!mapPointsData || isError) {
        return (
            <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-100">
                <div className="min-w-[300px] p-4 w-full h-full flex items-center justify-center">
                <div className="relative h-full w-full bg-gray-300 rounded-lg shadow-md">
                    {/* Placeholder for map tiles */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-2">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-gray-400 rounded-sm"></div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">

            <div className="min-w-[300px] overflow-hidden p-4 w-full">

                <div className="relative h-150 w-150">
                    {/* MapContainer is the Leaflet map component */}
                    <MapContainer
                        center={centerPoint}
                        zoom={13}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >
                        {/* OpenStreetMap Tile Layer */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Display the GPS track as a Polyline */}
                        {polylinePositions.length > 0 && (
                            <Polyline positions={polylinePositions} color="red" weight={3} />
                        )}

                        {/* Display CircleMarkers for each point with speed in popup */}
                        {mapPointsData.map((point, index) => (
                            <CircleMarker
                                key={index} // Using index as key is okay if items don't change order or get added/removed often
                                center={[point.latitude, point.longitude]}
                                radius={4} // Small circle radius
                                color="blue" // Color for the circle
                                fillOpacity={0.8}
                            >
                                <Popup>
                                    <div>
                                        <strong>Time:</strong> {point.timestamp}<br />
                                        <strong>Speed:</strong> {point.speed} km/h<br />
                                        <strong>Lat:</strong> {point.latitude.toFixed(5)}<br />
                                        <strong>Lon:</strong> {point.longitude.toFixed(5)}
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}

                        {/* Marker for the start of the track */}
                        {polylinePositions.length > 0 && (
                            <Marker position={polylinePositions[0]}>
                                <Popup>Start of Track</Popup>
                            </Marker>
                        )}
                        {/* Marker for the end of the track */}
                        {polylinePositions.length > 0 && (
                            <Marker position={polylinePositions[polylinePositions.length - 1]}>
                                <Popup>End of Track</Popup>
                            </Marker>
                        )}

                    </MapContainer>
                </div>
            </div>

        </div>
    );

};


const LoadingSkeleton = () => {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-100 animate-pulse">
        <div className="min-w-[300px] p-4 w-full h-full flex items-center justify-center">
          <div className="relative h-full w-full bg-gray-300 rounded-lg shadow-md">
            {/* Placeholder for map tiles */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-400 rounded-sm"></div>
              ))}
            </div>
            {/* Placeholder for polyline/markers */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-500 opacity-50 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
}
