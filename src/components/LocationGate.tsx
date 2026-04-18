import { useLocation_ } from '@/contexts/LocationContext';
import { MapPin, Navigation, Loader2, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationGate = ({ children }: { children: React.ReactNode }) => {
  const {
    locationStatus,
    requestEnableLocationServices,
    requestGPSLocation,
    isLocating,
    locationError,
    locationErrorKind,
  } = useLocation_();

  if (locationStatus === 'idle' || locationStatus === 'checking') {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (locationStatus === 'ready') {
    return <>{children}</>;
  }

  const isWaitingForLocation = locationStatus === 'enabling' || isLocating;
  const isPermissionDenied = locationErrorKind === 'permission-denied';

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: '2s' }} />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <MapPin className="h-12 w-12 text-primary" />
        </div>
      </div>

      <h1 className="mb-3 text-xl font-bold text-foreground">
        {isPermissionDenied ? 'Location Access Blocked' : 'Location Required'}
      </h1>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {isPermissionDenied
          ? 'You previously denied location access. Please enable it in your browser or device settings to continue.'
          : 'We need your location to show nearby salons and services available in your area.'}
      </p>

      {isPermissionDenied && (
        <div className="mb-6 max-w-xs rounded-xl border border-border bg-muted/40 p-4 text-left text-xs text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">How to enable:</p>
          <ul className="space-y-1.5 list-disc pl-4">
            <li><span className="font-medium text-foreground">iOS:</span> Settings → Safari/Chrome → Location → Allow</li>
            <li><span className="font-medium text-foreground">Android:</span> Settings → Apps → Browser → Permissions → Location</li>
            <li><span className="font-medium text-foreground">Desktop:</span> Tap the lock icon in the address bar → Site settings → Location</li>
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          size="lg"
          className="gap-2 rounded-full"
          onClick={() => {
            if (isPermissionDenied) {
              // Force re-check after user has (hopefully) enabled it in settings
              requestGPSLocation();
            } else {
              requestEnableLocationServices();
            }
          }}
          disabled={isWaitingForLocation}
        >
          {isWaitingForLocation ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Detecting Location…
            </>
          ) : isPermissionDenied ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Try Again
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Turn On Location
            </>
          )}
        </Button>

        {!isPermissionDenied && locationError && (
          <Button
            size="lg"
            variant="outline"
            className="gap-2 rounded-full"
            onClick={() => requestGPSLocation()}
            disabled={isWaitingForLocation}
          >
            <RefreshCw className="h-4 w-4" />
            Check Again
          </Button>
        )}
      </div>

      {locationError && (
        <p className="mt-4 max-w-xs text-xs text-destructive">{locationError}</p>
      )}
    </div>
  );
};

export default LocationGate;
