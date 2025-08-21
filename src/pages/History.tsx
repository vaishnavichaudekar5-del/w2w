import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  MessageSquare, 
  Recycle, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';

interface DonationRecord {
  id: string;
  ngoId: string;
  ngoName: string;
  foodType: string;
  quantity: number;
  unit: string;
  date: string;
  status: 'pending' | 'collected' | 'delivered';
}

interface CompostSession {
  id: string;
  wasteItems: string[];
  guidance: string;
  date: string;
}

interface RecyclingDelivery {
  id: string;
  hubId: string;
  hubName: string;
  materials: string[];
  date: string;
  status: 'pending' | 'delivered';
}

const History = () => {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [compostSessions, setCompostSessions] = useState<CompostSession[]>([]);
  const [recyclingDeliveries, setRecyclingDeliveries] = useState<RecyclingDelivery[]>([]);
  const [activeTab, setActiveTab] = useState('donations');

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = () => {
    // Load from localStorage - replace with actual API calls
    const storedDonations = JSON.parse(localStorage.getItem('food_donations') || '[]');
    const storedSessions = JSON.parse(localStorage.getItem('compost_sessions') || '[]');
    const storedDeliveries = JSON.parse(localStorage.getItem('recycling_deliveries') || '[]');

    // Add some mock data if no real data exists
    if (storedDonations.length === 0) {
      const mockDonations: DonationRecord[] = [
        {
          id: '1',
          ngoId: '1',
          ngoName: 'Green Valley Food Bank',
          foodType: 'vegetables',
          quantity: 5,
          unit: 'kg',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: 'delivered'
        },
        {
          id: '2', 
          ngoId: '2',
          ngoName: 'Hope Kitchen Network',
          foodType: 'fruits',
          quantity: 3,
          unit: 'kg', 
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          status: 'collected'
        },
        {
          id: '3',
          ngoId: '1',
          ngoName: 'Green Valley Food Bank',
          foodType: 'prepared meals',
          quantity: 10,
          unit: 'portions',
          date: new Date(Date.now() - 86400000 * 10).toISOString(),
          status: 'delivered'
        }
      ];
      setDonations(mockDonations);
    } else {
      setDonations(storedDonations);
    }

    if (storedSessions.length === 0) {
      const mockSessions: CompostSession[] = [
        {
          id: '1',
          wasteItems: ['fruit peels', 'coffee grounds'],
          guidance: 'Great choice! Fruit peels are excellent for composting...',
          date: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
          id: '2',
          wasteItems: ['vegetable scraps'],
          guidance: 'Vegetable scraps are perfect for composting!...',
          date: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: '3',
          wasteItems: ['eggshells', 'coffee grounds'],
          guidance: 'Eggshells provide calcium for your compost...',
          date: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ];
      setCompostSessions(mockSessions);
    } else {
      setCompostSessions(storedSessions);
    }

    if (storedDeliveries.length === 0) {
      const mockDeliveries: RecyclingDelivery[] = [
        {
          id: '1',
          hubId: '1',
          hubName: 'EcoCenter Los Angeles',
          materials: ['PET bottles', 'aluminum cans'],
          date: new Date(Date.now() - 86400000 * 1).toISOString(),
          status: 'delivered'
        },
        {
          id: '2',
          hubId: '2', 
          hubName: 'Green Future Recycling',
          materials: ['cardboard', 'paper'],
          date: new Date(Date.now() - 86400000 * 4).toISOString(),
          status: 'delivered'
        },
        {
          id: '3',
          hubId: '1',
          hubName: 'EcoCenter Los Angeles', 
          materials: ['electronics', 'batteries'],
          date: new Date(Date.now() - 86400000 * 8).toISOString(),
          status: 'delivered'
        }
      ];
      setRecyclingDeliveries(mockDeliveries);
    } else {
      setRecyclingDeliveries(storedDeliveries);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'collected':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-orange-500" />;
      default:
        return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'collected':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotals = () => {
    const totalDonations = donations.length;
    const totalWeight = donations.reduce((sum, donation) => {
      return donation.unit === 'kg' ? sum + donation.quantity : sum;
    }, 0);
    const totalCompostSessions = compostSessions.length;
    const totalRecycling = recyclingDeliveries.length;

    return { totalDonations, totalWeight, totalCompostSessions, totalRecycling };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Activity History</h1>
        <p className="text-muted-foreground">Track your environmental impact over time</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-2xl font-bold">{totals.totalDonations}</div>
            <div className="text-sm text-muted-foreground">Food Donations</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <TrendingUp className="mx-auto mb-2 text-primary" size={24} />
            <div className="text-2xl font-bold">{totals.totalWeight}kg</div>
            <div className="text-sm text-muted-foreground">Food Donated</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <MessageSquare className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold">{totals.totalCompostSessions}</div>
            <div className="text-sm text-muted-foreground">Compost Sessions</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Recycle className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-2xl font-bold">{totals.totalRecycling}</div>
            <div className="text-sm text-muted-foreground">Recycling Trips</div>
          </CardContent>
        </Card>
      </div>

      {/* History Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donations">Food Donations</TabsTrigger>
          <TabsTrigger value="composting">Composting</TabsTrigger>
          <TabsTrigger value="recycling">Recycling</TabsTrigger>
        </TabsList>

        {/* Food Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="text-red-500" />
                  <span>Food Donations ({donations.length})</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter size={14} className="mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download size={14} className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Heart className="text-red-500" size={20} />
                      <div>
                        <p className="font-medium">
                          {donation.quantity} {donation.unit} of {donation.foodType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Donated to {donation.ngoName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(donation.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(donation.status)}
                      <Badge className={getStatusColor(donation.status)}>
                        {donation.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {donations.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground">No food donations recorded yet.</p>
                    <Button variant="outline" className="mt-4">
                      Make Your First Donation
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Composting Tab */}
        <TabsContent value="composting">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="text-green-500" />
                  <span>Composting Sessions ({compostSessions.length})</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compostSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <MessageSquare className="text-green-500 mt-1" size={20} />
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {session.wasteItems.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {session.guidance}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Calendar size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(session.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {compostSessions.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground">No composting sessions recorded yet.</p>
                    <Button variant="outline" className="mt-4">
                      Start Composting Guide
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recycling Tab */}
        <TabsContent value="recycling">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Recycle className="text-blue-500" />
                  <span>Recycling Deliveries ({recyclingDeliveries.length})</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recyclingDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Recycle className="text-blue-500" size={20} />
                      <div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {delivery.materials.map((material, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Delivered to {delivery.hubName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(delivery.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(delivery.status)}
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {recyclingDeliveries.length === 0 && (
                  <div className="text-center py-8">
                    <Recycle className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground">No recycling deliveries recorded yet.</p>
                    <Button variant="outline" className="mt-4">
                      Find Recycling Hubs
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;