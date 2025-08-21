import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  Recycle, 
  TrendingUp, 
  Calendar,
  Award,
  Target,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock dashboard data - replace with actual API calls
  const stats = {
    totalDonations: 12,
    totalWeight: 45.2,
    compostSessions: 8,
    recyclingDeliveries: 15,
    impactScore: 87
  };

  const recentActivity = [
    {
      id: '1',
      type: 'donation',
      description: 'Donated 5kg vegetables to Green Valley Food Bank',
      date: '2 hours ago',
      icon: Heart
    },
    {
      id: '2', 
      type: 'compost',
      description: 'Completed composting guide for fruit peels',
      date: '1 day ago',
      icon: MessageSquare
    },
    {
      id: '3',
      type: 'recycle',
      description: 'Delivered plastic bottles to EcoCenter LA',
      date: '3 days ago',
      icon: Recycle
    }
  ];

  const quickActions = [
    {
      title: 'Donate Food',
      description: 'Find nearby NGOs for food donation',
      icon: Heart,
      color: 'text-red-500',
      action: () => navigate('/app/donate')
    },
    {
      title: 'Composting Guide',
      description: 'Get AI-powered composting advice',
      icon: MessageSquare,
      color: 'text-green-500',
      action: () => navigate('/app/compost')
    },
    {
      title: 'Recycling Hub',
      description: 'Find plastic recycling locations',
      icon: Recycle,
      color: 'text-blue-500',
      action: () => navigate('/app/recycle')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-card rounded-lg p-6 shadow-soft">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 🌱</h1>
        <p className="text-muted-foreground text-lg">
          Ready to make a positive impact today? Check out your sustainability journey below.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-medium transition-smooth">
          <CardContent className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-2xl font-bold">{stats.totalDonations}</div>
            <div className="text-sm text-muted-foreground">Food Donations</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-smooth">
          <CardContent className="p-4 text-center">
            <Target className="mx-auto mb-2 text-primary" size={24} />
            <div className="text-2xl font-bold">{stats.totalWeight}kg</div>
            <div className="text-sm text-muted-foreground">Food Donated</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-smooth">
          <CardContent className="p-4 text-center">
            <MessageSquare className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold">{stats.compostSessions}</div>
            <div className="text-sm text-muted-foreground">Compost Sessions</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-smooth">
          <CardContent className="p-4 text-center">
            <Recycle className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-2xl font-bold">{stats.recyclingDeliveries}</div>
            <div className="text-sm text-muted-foreground">Recycling Trips</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-smooth bg-gradient-success">
          <CardContent className="p-4 text-center text-white">
            <Award className="mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{stats.impactScore}</div>
            <div className="text-sm opacity-90">Impact Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-smooth cursor-pointer"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <action.icon className={`mb-4 ${action.color}`} size={32} />
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Impact Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                <activity.icon size={20} className="text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/app/history')}
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>This Month's Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="text-green-600" size={16} />
                  <span className="text-sm font-medium">People Helped</span>
                </div>
                <span className="font-bold text-green-600">24 families</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Recycle className="text-blue-600" size={16} />
                  <span className="text-sm font-medium">CO₂ Reduced</span>
                </div>
                <span className="font-bold text-blue-600">15.2 kg</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="text-primary" size={16} />
                  <span className="text-sm font-medium">Waste Diverted</span>
                </div>
                <span className="font-bold text-primary">45.2 kg</span>
              </div>
            </div>

            <div className="mt-6 text-center p-4 bg-gradient-hero rounded-lg text-white">
              <p className="text-sm font-medium">🎉 Amazing work!</p>
              <p className="text-xs opacity-90">You're in the top 10% of contributors this month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;