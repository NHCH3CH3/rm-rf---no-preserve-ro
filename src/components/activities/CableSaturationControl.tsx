import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Cable, Plus, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CableRecord {
  id: string;
  cableName: string;
  location: string;
  capacity: number;
  currentUsage: number;
  saturationPercentage: number;
  status: "normal" | "warning" | "critical";
  lastCheck: string;
  technician: string;
}

const CableSaturationControl = () => {
  const [records, setRecords] = useState<CableRecord[]>([
    {
      id: "1",
      cableName: "CABO-FO-001",
      location: "Backbone São Paulo",
      capacity: 144,
      currentUsage: 98,
      saturationPercentage: 68,
      status: "warning",
      lastCheck: new Date().toLocaleString(),
      technician: "Luiz Porta"
    },
    {
      id: "2",
      cableName: "CABO-FO-002",
      location: "Anel Rio-SP",
      capacity: 288,
      currentUsage: 276,
      saturationPercentage: 96,
      status: "critical",
      lastCheck: new Date(Date.now() - 900000).toLocaleString(),
      technician: "Luiz Porta"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    cableName: "",
    location: "",
    capacity: 0,
    currentUsage: 0
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-signal-strong";
      case "warning": return "bg-signal-medium";
      case "critical": return "bg-signal-weak";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "critical": return <Zap className="h-4 w-4" />;
      default: return <Cable className="h-4 w-4" />;
    }
  };

  const determineStatus = (saturationPercentage: number) => {
    if (saturationPercentage <= 70) return "normal";
    if (saturationPercentage <= 85) return "warning";
    return "critical";
  };

  const calculateSaturation = (usage: number, capacity: number) => {
    return capacity > 0 ? Math.round((usage / capacity) * 100) : 0;
  };

  const handleAddRecord = () => {
    if (!newRecord.cableName || !newRecord.location || newRecord.capacity <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const saturationPercentage = calculateSaturation(newRecord.currentUsage, newRecord.capacity);
    const status = determineStatus(saturationPercentage);
    
    const record: CableRecord = {
      id: Date.now().toString(),
      ...newRecord,
      saturationPercentage,
      status,
      lastCheck: new Date().toLocaleString(),
      technician: "Luiz Porta"
    };

    setRecords([...records, record]);
    setNewRecord({ cableName: "", location: "", capacity: 0, currentUsage: 0 });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Cabo adicionado ao monitoramento"
    });
  };

  const handleUpdateUsage = (id: string, newUsage: number) => {
    setRecords(records.map(record => {
      if (record.id === id) {
        const saturationPercentage = calculateSaturation(newUsage, record.capacity);
        const status = determineStatus(saturationPercentage);
        return {
          ...record,
          currentUsage: newUsage,
          saturationPercentage,
          status,
          lastCheck: new Date().toLocaleString()
        };
      }
      return record;
    }));
    
    toast({
      title: "Uso atualizado",
      description: `Nova ocupação: ${newUsage} fibras`
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Registro removido",
      description: "Cabo removido do monitoramento"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cable className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Ocupação de Cabo Saturado</CardTitle>
                <CardDescription>
                  Monitoramento da saturação de cabos de fibra óptica
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cabo
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAdding && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Adicionar Cabo ao Monitoramento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cableName">Nome do Cabo</Label>
                <Input
                  id="cableName"
                  value={newRecord.cableName}
                  onChange={(e) => setNewRecord({...newRecord, cableName: e.target.value})}
                  placeholder="CABO-FO-XXX"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="Rota ou região"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacidade (fibras)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={newRecord.capacity}
                  onChange={(e) => setNewRecord({...newRecord, capacity: parseInt(e.target.value) || 0})}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="currentUsage">Uso Atual (fibras)</Label>
                <Input
                  id="currentUsage"
                  type="number"
                  min="0"
                  max={newRecord.capacity}
                  value={newRecord.currentUsage}
                  onChange={(e) => setNewRecord({...newRecord, currentUsage: parseInt(e.target.value) || 0})}
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddRecord} className="bg-gradient-primary">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record) => (
          <Card key={record.id} className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{record.cableName}</CardTitle>
                <Badge className={`${getStatusColor(record.status)} text-white`}>
                  {getStatusIcon(record.status)}
                  <span className="ml-1">{record.saturationPercentage}%</span>
                </Badge>
              </div>
              <CardDescription>{record.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Uso Atual:</span>
                  <span className="font-bold">{record.currentUsage}/{record.capacity} fibras</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      record.status === "normal" ? "bg-signal-strong" :
                      record.status === "warning" ? "bg-signal-medium" : "bg-signal-weak"
                    }`}
                    style={{ width: `${record.saturationPercentage}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium">
                    Saturação: {record.saturationPercentage}%
                  </span>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-foreground/70">Status:</span>
                  <p className="font-medium capitalize">{
                    record.status === "normal" ? "Normal" :
                    record.status === "warning" ? "Atenção" : "Crítico"
                  }</p>
                </div>
                <div>
                  <span className="text-foreground/70">Último Check:</span>
                  <p className="font-medium">{record.lastCheck}</p>
                </div>
                <div>
                  <span className="text-foreground/70">Técnico:</span>
                  <p className="font-medium">{record.technician}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min="0"
                  max={record.capacity}
                  placeholder="Novo uso"
                  className="flex-1 bg-background/50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = parseInt((e.target as HTMLInputElement).value);
                      if (value >= 0 && value <= record.capacity) {
                        handleUpdateUsage(record.id, value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(record.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  🗑️
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {records.length === 0 && (
        <Card className="glass-card border-primary/20">
          <CardContent className="text-center py-12">
            <Cable className="h-12 w-12 text-primary/50 mx-auto mb-4" />
            <p className="text-foreground/70">Nenhum cabo monitorado</p>
            <p className="text-sm text-foreground/50">Clique em "Novo Cabo" para começar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CableSaturationControl;