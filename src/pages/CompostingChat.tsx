import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Leaf, 
  Camera,
  Plus,
  Trash2,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface Plant {
  id: string;
  name: string;
  datePlanted: string;
  photo?: string;
}

const CompostingChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI Composting Assistant 🌱 Tell me what waste items you have, and I'll provide personalized composting guidance. What would you like to compost today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([
    { id: '1', name: 'Tomato Plant', datePlanted: '2024-01-15' },
    { id: '2', name: 'Basil Herbs', datePlanted: '2024-01-20' },
  ]);
  const [newPlantName, setNewPlantName] = useState('');
  const [showPlantForm, setShowPlantForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCompostingGuidance = (wasteItems: string): string => {
    // Mock AI responses - replace with actual AI integration
    const responses = {
      'fruit peels': "Great choice! Fruit peels are excellent for composting. Chop them into smaller pieces to speed decomposition. Mix with brown materials like dry leaves or paper for balanced composting.",
      'vegetable scraps': "Vegetable scraps are perfect for composting! Remove any stickers, chop larger pieces, and mix with carbon-rich materials. Avoid diseased vegetables.",
      'coffee grounds': "Coffee grounds are nitrogen-rich and great for compost! Mix with 3x the amount of brown materials. They also help attract earthworms!",
      'eggshells': "Eggshells provide calcium for your compost. Crush them first and rinse to remove egg residue. They help balance acidity too!",
      'leaves': "Dead leaves are excellent brown material! Shred them first for faster decomposition. Mix with green materials for optimal composting.",
      'grass clippings': "Fresh grass clippings are nitrogen-rich but can become slimy. Let them dry first or mix immediately with brown materials.",
    };

    const items = wasteItems.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (items.includes(key)) {
        return response;
      }
    }

    return `I can help you compost "${wasteItems}"! Here's general guidance: Mix green materials (like ${wasteItems}) with brown materials (dry leaves, paper) in a 1:3 ratio. Keep moist but not soggy, and turn regularly for best results. The composting process typically takes 2-6 months.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getCompostingGuidance(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);

      // Save session to localStorage
      const session = {
        id: Date.now().toString(),
        wasteItems: [inputMessage],
        guidance: botResponse.content,
        date: new Date().toISOString()
      };
      
      const existingSessions = JSON.parse(localStorage.getItem('compost_sessions') || '[]');
      existingSessions.push(session);
      localStorage.setItem('compost_sessions', JSON.stringify(existingSessions));
    }, 1500);
  };

  const addPlant = () => {
    if (!newPlantName.trim()) return;

    const newPlant: Plant = {
      id: Date.now().toString(),
      name: newPlantName,
      datePlanted: new Date().toISOString().split('T')[0]
    };

    setPlants(prev => [...prev, newPlant]);
    setNewPlantName('');
    setShowPlantForm(false);

    // Save to localStorage
    const existingPlants = JSON.parse(localStorage.getItem('plants') || '[]');
    existingPlants.push(newPlant);
    localStorage.setItem('plants', JSON.stringify(existingPlants));

    toast({
      title: "Plant added!",
      description: `${newPlant.name} has been added to your garden.`,
    });
  };

  const removePlant = (id: string) => {
    setPlants(prev => prev.filter(plant => plant.id !== id));
    
    const existingPlants = JSON.parse(localStorage.getItem('plants') || '[]');
    const updatedPlants = existingPlants.filter((plant: Plant) => plant.id !== id);
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
  };

  const quickSuggestions = [
    'Apple cores and banana peels',
    'Coffee grounds and filters',
    'Vegetable scraps from cooking',
    'Eggshells from breakfast',
    'Dead leaves from garden',
    'Grass clippings from lawn'
  ];

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="shadow-soft h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="text-green-500" />
              <span>AI Composting Assistant</span>
              <Badge variant="secondary" className="ml-auto">
                <Bot size={12} className="mr-1" />
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && <Bot size={16} className="text-green-500 mt-1" />}
                      {message.type === 'user' && <User size={16} className="text-primary-foreground mt-1" />}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} className="text-green-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="p-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your waste items..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plant Tracker Sidebar */}
      <div className="space-y-6">
        {/* Add Plant */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Leaf className="text-green-500" />
              <span>Plant Tracker</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showPlantForm ? (
              <Button 
                onClick={() => setShowPlantForm(true)}
                variant="outline" 
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Add New Plant
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  placeholder="Plant name (e.g., Tomato Plant)"
                  onKeyPress={(e) => e.key === 'Enter' && addPlant()}
                />
                <div className="flex space-x-2">
                  <Button onClick={addPlant} size="sm" className="flex-1">
                    Add Plant
                  </Button>
                  <Button 
                    onClick={() => setShowPlantForm(false)} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plant List */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">My Plants ({plants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {plants.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No plants added yet. Start by adding your first plant!
              </p>
            ) : (
              <div className="space-y-3">
                {plants.map((plant) => (
                  <div key={plant.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {plant.photo ? (
                        <img 
                          src={plant.photo} 
                          alt={plant.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Leaf size={14} className="text-green-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{plant.name}</p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar size={10} />
                          <span>Planted {new Date(plant.datePlanted).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Camera size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => removePlant(plant.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Composting Tips */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">Green vs Brown</p>
              <p className="text-xs text-green-600">Mix 1 part green materials with 3 parts brown materials</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Moisture Level</p>
              <p className="text-xs text-blue-600">Keep compost as moist as a wrung-out sponge</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Turn Regularly</p>
              <p className="text-xs text-orange-600">Turn your compost every 2-3 weeks for faster results</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompostingChat;