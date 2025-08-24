import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Radio, Wifi, Cable, Antenna, Shield, TrendingUp, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import vivoLogo from "@/assets/vivo-logo.png";
import telecomHero from "@/assets/telecom-hero.jpg";
import UplinkManualControl from "./activities/UplinkManualControl";
import AttenuationControl from "./activities/AttenuationControl";
import CableSaturationControl from "./activities/CableSaturationControl";
import RadioUplinkControl from "./activities/RadioUplinkControl";
import ELineProtectionControl from "./activities/ELineProtectionControl";
import ErrorRateControl from "./activities/ErrorRateControl";
import FinalReport from "./reports/FinalReport";

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

const Dashboard = ({ userEmail, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    onLogout();
  };

  const activities = [
    {
      id: "uplink-manual",
      title: "Up-Link Manual OLT´s Remotas",
      icon: Radio,
      description: "Controle de conectividade das OLTs remotas",
      status: "active",
      count: 12
    },
    {
      id: "attenuation",
      title: "Atenuação OLT´s Remotas", 
      icon: TrendingUp,
      description: "Monitoramento de níveis de atenuação",
      status: "warning",
      count: 8
    },
    {
      id: "cable-saturation",
      title: "Ocupação de Cabo Saturado",
      icon: Cable,
      description: "Análise de saturação de cabos",
      status: "critical",
      count: 5
    },
    {
      id: "radio-uplink", 
      title: "Up-Link Rádio",
      icon: Antenna,
      description: "Controle de enlaces de rádio",
      status: "active",
      count: 15
    },
    {
      id: "eline-protection",
      title: "Proteções E-Line",
      icon: Shield,
      description: "Monitoramento de proteções E-Line",
      status: "active", 
      count: 7
    },
    {
      id: "error-rate",
      title: "Taxa de Erro",
      icon: Activity,
      description: "Controle de taxas de erro de transmissão",
      status: "warning",
      count: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-signal-strong";
      case "warning": return "bg-signal-medium"; 
      case "critical": return "bg-signal-weak";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={vivoLogo} alt="VIVO" className="h-10 w-10 rounded-full" />
              <div>
                <h1 className="text-xl font-bold gradient-text">Sistema de Controle VIVO</h1>
                <p className="text-sm text-foreground/70">Suporte Técnico - Produtividade</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-foreground/60">Administrador</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-background/10 backdrop-blur-md">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary">
              <Wifi className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="uplink-manual" className="data-[state=active]:bg-primary">
              <Radio className="h-4 w-4 mr-2" />
              OLT Manual
            </TabsTrigger>
            <TabsTrigger value="attenuation" className="data-[state=active]:bg-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Atenuação
            </TabsTrigger>
            <TabsTrigger value="cable-saturation" className="data-[state=active]:bg-primary">
              <Cable className="h-4 w-4 mr-2" />
              Cabos
            </TabsTrigger>
            <TabsTrigger value="radio-uplink" className="data-[state=active]:bg-primary">
              <Antenna className="h-4 w-4 mr-2" />
              Rádio
            </TabsTrigger>
            <TabsTrigger value="eline-protection" className="data-[state=active]:bg-primary">
              <Shield className="h-4 w-4 mr-2" />
              E-Line
            </TabsTrigger>
            <TabsTrigger value="error-rate" className="data-[state=active]:bg-primary">
              <Activity className="h-4 w-4 mr-2" />
              Taxa Erro
            </TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-primary">
              📊 Relatório
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="space-y-6">
              {/* Hero Section */}
              <Card className="glass-card border-primary/20 overflow-hidden">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${telecomHero})` }}
                >
                  <div className="absolute inset-0 bg-gradient-primary/80 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Controle de Produtividade
                      </h2>
                      <p className="text-white/90">
                        Monitoramento em tempo real das atividades de suporte
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Activities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <Card 
                      key={activity.id} 
                      className="glass-card border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                      onClick={() => setActiveTab(activity.id)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-sm font-medium line-clamp-2">
                            {activity.title}
                          </CardTitle>
                        </div>
                        <Badge className={`${getStatusColor(activity.status)} text-white`}>
                          {activity.count}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-foreground/70">
                          {activity.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="uplink-manual">
            <UplinkManualControl />
          </TabsContent>
          
          <TabsContent value="attenuation">
            <AttenuationControl />
          </TabsContent>
          
          <TabsContent value="cable-saturation">
            <CableSaturationControl />
          </TabsContent>
          
          <TabsContent value="radio-uplink">
            <RadioUplinkControl />
          </TabsContent>
          
          <TabsContent value="eline-protection">
            <ELineProtectionControl />
          </TabsContent>
          
          <TabsContent value="error-rate">
            <ErrorRateControl />
          </TabsContent>

          <TabsContent value="report">
            <FinalReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;