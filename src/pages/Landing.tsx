import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Recycle, MessageSquare, BarChart3, Leaf, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: 'Food Donation',
      description: 'Connect with local NGOs to donate surplus food and reduce waste.'
    },
    {
      icon: MessageSquare,
      title: 'AI Composting Guide',
      description: 'Get personalized composting advice for your organic waste.'
    },
    {
      icon: Recycle,
      title: 'Plastic Recycling',
      description: 'Find nearby recycling hubs and track your environmental impact.'
    },
    {
      icon: BarChart3,
      title: 'Impact Dashboard',
      description: 'Monitor your contributions to environmental sustainability.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Meals Donated' },
    { number: '25K+', label: 'Pounds Composted' },
    { number: '15K+', label: 'Plastics Recycled' },
    { number: '200+', label: 'Partner NGOs' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="text-primary" size={32} />
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Waste2Worth
            </h1>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="absolute inset-0 bg-background/10" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Turn Waste Into Worth
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Connect, donate, compost, and recycle. Make a meaningful impact on your 
            community and environment with every action.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-medium"
              onClick={() => navigate('/signup')}
            >
              Start Making Impact
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate('/login')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Make a Difference
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform connects you with the tools and community needed to 
              reduce waste and create positive environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-medium transition-smooth">
                <CardContent className="p-6 text-center">
                  <feature.icon className="mx-auto mb-4 text-primary" size={48} />
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="mx-auto mb-6 text-primary" size={64} />
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Community of Change-Makers
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with local organizations, learn sustainable practices, and 
              track your positive impact on the environment and community.
            </p>
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="text-primary" size={24} />
              <span className="text-xl font-bold">Waste2Worth</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Making sustainability accessible and impactful for everyone.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 Waste2Worth. Built for positive environmental impact.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;