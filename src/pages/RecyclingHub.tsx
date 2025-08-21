import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Recycle, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Truck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockRecyclingHubs, getNearestLocations, type RecyclingHub } from '@/utils/mockData';

interface DeliveryData {
  hubId: string;
  materials: string[];
  estimatedWeight: number;
  notes: string;
}

const RecyclingHub = () => {
  const [userLocation, setUserLocation] = useState<{lat: number; lon: number} | null>(null);
  const [nearestHubs, setNearestHubs] = useState<(RecyclingHub & {distance: number})[]>([]);
  const [filteredHubs, setFilteredHubs] = useState<(RecyclingHub & {distance: number})[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedHub, setSelectedHub] = useState<RecyclingHub | null>(null);
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    hubId: '',
    materials: [],
    estimatedWeight: 0,
    notes: ''
  });
  const { toast } = useToast();

  const commonMaterials = [
    'PET bottles',
    'HDPE containers', 
    'aluminum cans',
    'glass containers',
    'cardboard',
    'paper',
    'electronics',
    'batteries',
    'plastic packaging',
    'metal cans',
    'textiles'
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterHubs();
  }, [nearestHubs, searchQuery, selectedMaterials]);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          
          const nearest = getNearestLocations(latitude, longitude, mockRecyclingHubs, 10);
          setNearestHubs(nearest);
          setIsLocating(false);
          
          toast({
            title: "Location found!",
            description: `Found ${nearest.length} nearby recycling hubs.`,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          const defaultLocation = { lat: 34.0522, lon: -118.2437 };
          setUserLocation(defaultLocation);
          const nearest = getNearestLocations(defaultLocation.lat, defaultLocation.lon, mockRecyclingHubs, 10);
          setNearestHubs(nearest);
          setIsLocating(false);
          
          toast({
            title: "Using default location",
            description: "Showing recycling hubs near Los Angeles.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const filterHubs = () => {
    let filtered = nearestHubs;

    if (searchQuery) {
      filtered = filtered.filter(hub => 
        hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(hub =>
        selectedMaterials.some(material =>
          hub.acceptedMaterials.some(accepted =>
            accepted.toLowerCase().includes(material.toLowerCase())
          )
        )
      );
    }

    setFilteredHubs(filtered);
  };

  const handleMaterialFilter = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials(prev => [...prev, material]);
    } else {
      setSelectedMaterials(prev => prev.filter(m => m !== material));
    }
  };

  const openDeliveryForm = (hub: RecyclingHub) => {
    setSelectedHub(hub);
    setDeliveryData(prev => ({ ...prev, hubId: hub.id }));
    setShowDeliveryForm(true);
  };

  const handleDeliverySubmit = async () => {
    try {
      // API placeholder - replace with actual backend call
      const response = await fetch('/api/recycling/deliveries', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(deliveryData)
      });

      if (response.ok) {
        toast({
          title: "Delivery scheduled!",
          description: "Your recycling delivery has been recorded.",
        });
        setShowDeliveryForm(false);
        setDeliveryData({ hubId: '', materials: [], estimatedWeight: 0, notes: '' });
      }
    } catch (error) {
      console.error('Delivery submission error:', error);
    }

    // Mock success for development
    const delivery = {
      id: Date.now().toString(),
      hubId: deliveryData.hubId,
      hubName: selectedHub?.name || '',
      materials: deliveryData.materials,
      date: new Date().toISOString(),
      status: 'pending' as const
    };

    const existingDeliveries = JSON.parse(localStorage.getItem('recycling_deliveries') || '[]');
    existingDeliveries.push(delivery);
    localStorage.setItem('recycling_deliveries', JSON.stringify(existingDeliveries));

    toast({
      title: "Delivery recorded!",
      description: "Your recycling delivery has been logged.",
    });
    setShowDeliveryForm(false);
    setDeliveryData({ hubId: '', materials: [], estimatedWeight: 0, notes: '' });
  };

  if (showDeliveryForm && selectedHub) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="text-blue-500" />
              <span>Record Recycling Delivery</span>
            </CardTitle>
            <p className="text-muted-foreground">
              Recording delivery to: {selectedHub.name}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Materials Delivered *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {commonMaterials.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={material}
                      checked={deliveryData.materials.includes(material)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDeliveryData(prev => ({
                            ...prev,
                            materials: [...prev.materials, material]
                          }));
                        } else {
                          setDeliveryData(prev => ({
                            ...prev,
                            materials: prev.materials.filter(m => m !== material)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={material} className="text-sm">{material}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="weight">Estimated Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={deliveryData.estimatedWeight || ''}
                onChange={(e) => setDeliveryData(prev => ({
                  ...prev,
                  estimatedWeight: parseFloat(e.target.value) || 0
                }))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Additional information about your delivery..."
                value={deliveryData.notes}
                onChange={(e) => setDeliveryData(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
              />
            </div>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDeliveryForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeliverySubmit}
                className="flex-1"
                disabled={deliveryData.materials.length === 0}
              >
                Record Delivery
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Plastic Recycling Hubs</h1>
        <p className="text-muted-foreground">Find nearby recycling centers and track your deliveries</p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" onClick={getCurrentLocation} disabled={isLocating}>
                <Navigation size={16} className="mr-2" />
                {isLocating ? 'Locating...' : 'Update Location'}
              </Button>
            </div>

            {/* Material Filters */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Filter size={16} />
                <Label>Filter by accepted materials:</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonMaterials.slice(0, 6).map((material) => (
                  <div key={material} className="flex items-center space-x-1">
                    <Checkbox
                      id={`filter-${material}`}
                      checked={selectedMaterials.includes(material)}
                      onCheckedChange={(checked) => handleMaterialFilter(material, checked as boolean)}
                    />
                    <Label htmlFor={`filter-${material}`} className="text-sm">
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredHubs.length} of {nearestHubs.length} recycling hubs
          {selectedMaterials.length > 0 && (
            <span> accepting: {selectedMaterials.join(', ')}</span>
          )}
        </p>
        {selectedMaterials.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setSelectedMaterials([])}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Recycling Hubs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => (
          <Card key={hub.id} className="hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg">{hub.name}</h3>
                <Badge variant="secondary">{hub.distance.toFixed(1)} mi</Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="text-muted-foreground mt-0.5" />
                  <p className="text-sm">{hub.address}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <p className="text-sm">{hub.phone}</p>
                </div>

                <div className="flex items-start space-x-2">
                  <Clock size={16} className="text-muted-foreground mt-0.5" />
                  <p className="text-sm">{hub.operatingHours}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Accepted Materials:</p>
                <div className="flex flex-wrap gap-1">
                  {hub.acceptedMaterials.slice(0, 4).map((material, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                  {hub.acceptedMaterials.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{hub.acceptedMaterials.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hub.address)}`;
                    window.open(mapsUrl, '_blank');
                  }}
                >
                  <MapPin size={14} className="mr-2" />
                  View on Map
                </Button>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => openDeliveryForm(hub)}
                >
                  <CheckCircle size={14} className="mr-2" />
                  Mark Delivery Done
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHubs.length === 0 && !isLocating && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="font-semibold mb-2">No recycling hubs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedMaterials([]);
            }}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecyclingHub;