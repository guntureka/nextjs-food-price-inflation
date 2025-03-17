import L from "leaflet";

// Import the marker icons
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"; // Adjust import if needed
import iconUrl from "leaflet/dist/images/marker-icon.png"; // Adjust import if needed
import shadowUrl from "leaflet/dist/images/marker-shadow.png"; // Adjust import if needed

// Define the default icon configuration
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl, // No need for .src
  iconUrl: iconUrl, // No need for .src
  shadowUrl: shadowUrl, // No need for .src
});
