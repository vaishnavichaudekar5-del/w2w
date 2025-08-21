import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Heart, 
  Clock, 
  Phone, 
  Mail, 
  Navigation,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockNGOs, getNearestLocations, NGO } from '@/utils/mockData';

const FoodDonation = () => {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    description: '',
    pickupAddress: '',
    contactNumber: '',
    preferredTime: ''
  });
  
  const [userLocation, setUserLocation] = useState<{lat: number; lon: number} | null>(null);
  const [nearestNGOs, setNearestNGOs] = useState<(NGO & {distance: number})[]>([]);
  const [selectedNGO, setSelectedNGO] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          
          // Get nearest NGOs
          const nearest = getNearestLocations(latitude, longitude, mockNGOs, 5);
          setNearestNGOs(nearest);
          setIsLocating(false);
          
          toast({
            title: "Location found!",
            description: `Found ${nearest.length} nearby NGOs.`,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Use default location (Los Angeles) if geolocation fails
          const defaultLocation = { lat: 34.0522, lon: -118.2437 };
          setUserLocation(defaultLocation);
          const nearest = getNearestLocations(defaultLocation.lat, defaultLocation.lon, mockNGOs, 5);
          setNearestNGOs(nearest);
          setIsLocating(false);
          
          toast({
            title: "Using default location",
            description: "Couldn't access GPS. Showing NGOs near Los Angeles.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        title: "Geolocation not supported",
        description: "Please enable location services.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedNGO) {
      toast({
        title: "Please select an NGO",
        description: "Choose an NGO to complete your donation.",
        variant: "destructive",
      });
      return;
    }

    try {
      // API placeholder - replace with actual backend call
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          ...formData,
          ngoId: selectedNGO,
          userLocation
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Donation request submitted!",
          description: "The NGO will contact you for pickup details.",
        });
        
        // Reset form and move to confirmation
        setStep(3);
      }
    } catch (error) {
      console.error('Donation submission error:', error);
    }

    // Mock success for development
    toast({
      title: "Donation request submitted!",
      description: "The NGO will contact you for pickup details.",
    });
    setStep(3);
  };

  const selectedNGOData = nearestNGOs.find(ngo => ngo.id === selectedNGO);

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-medium">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
            <h1 className="text-2xl font-bold mb-4">Donation Request Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your generous donation. {selectedNGOData?.name} has been notified 
              and will contact you within 2-4 hours to arrange pickup.
            </p>
            <div className="space-y-2">
              <Button onClick={() => { setStep(1); setFormData({ foodType: '', quantity: '', unit: 'kg', description: '', pickupAddress: '', contactNumber: '', preferredTime: '' }); setSelectedNGO(''); }}>
                Make Another Donation
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/app'}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Donate Food to NGOs</h1>
        <p className="text-muted-foreground">Connect with local organizations to reduce food waste</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
          <span>Food Details</span>
        </div>
        <div className={`w-8 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
          <span>Select NGO</span>
        </div>
      </div>

      {step === 1 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="text-red-500" />
              <span>Food Donation Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="foodType">Food Type *</Label>
                <Select onValueChange={(value) => handleInputChange('foodType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select food type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetables">Fresh Vegetables</SelectItem>
                    <SelectItem value="fruits">Fresh Fruits</SelectItem>
                    <SelectItem value="grains">Grains & Cereals</SelectItem>
                    <SelectItem value="dairy">Dairy Products</SelectItem>
                    <SelectItem value="prepared">Prepared Meals</SelectItem>
                    <SelectItem value="bakery">Bakery Items</SelectItem>
                    <SelectItem value="canned">Canned Goods</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select onValueChange={(value) => handleInputChange('unit', value)} defaultValue="kg">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="portions">portions</SelectItem>
                      <SelectItem value="boxes">boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Additional details about the food (expiry date, condition, etc.)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Textarea
                id="pickupAddress"
                placeholder="Enter complete pickup address"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="preferredTime">Preferred Pickup Time</Label>
                <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={() => setStep(2)} 
              className="w-full"
              disabled={!formData.foodType || !formData.quantity || !formData.pickupAddress || !formData.contactNumber}
            >
              Continue to Select NGO
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="text-primary" />
                <span>Nearest NGOs</span>
                {isLocating && <AlertCircle className="animate-spin" size={16} />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {nearestNGOs.length} NGOs found near your location
                </p>
                <Button variant="outline" size="sm" onClick={getCurrentLocation}>
                  <Navigation size={16} className="mr-2" />
                  Update Location
                </Button>
              </div>

              <div className="space-y-4">
                {nearestNGOs.map((ngo) => (
                  <Card 
                    key={ngo.id} 
                    className={`cursor-pointer transition-smooth hover:shadow-medium ${
                      selectedNGO === ngo.id ? 'ring-2 ring-primary shadow-medium' : ''
                    }`}
                    onClick={() => setSelectedNGO(ngo.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{ngo.name}</h3>
                            <Badge variant="secondary">{ngo.distance.toFixed(1)} miles</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{ngo.description}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin size={14} />
                              <span>{ngo.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone size={14} />
                              <span>{ngo.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail size={14} />
                              <span>{ngo.email}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Accepted Food Types:</p>
                            <div className="flex flex-wrap gap-1">
                              {ngo.acceptedFoodTypes.slice(0, 3).map((type, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                              {ngo.acceptedFoodTypes.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{ngo.acceptedFoodTypes.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedNGO === ngo.id && (
                          <CheckCircle className="text-primary flex-shrink-0" size={24} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex space-x-4 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back to Details
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={!selectedNGO}
                >
                  Submit Donation Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FoodDonation;