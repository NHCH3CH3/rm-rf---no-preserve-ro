import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttenuationRecord {
  id: string;
  oltName: string;
  location: string;
  attenuationLevel: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
  lastMeasurement: string;
  technician: string;
}

const AttenuationControl = () => {
  const [records, setRecords] = useState<AttenuationRecord[]>([
    {
      id: "1",
      oltName: "OLT-ATT-001",
      location: "São Paulo - Norte",
      attenuationLevel: 2.5,
      threshold: 3.0,
      status: "normal",
      lastMeasurement: new Date().toLocaleString(),
      technician: "Luiz Porta"
    },
    {
      id: "2",
      oltName: "OLT-ATT-002", 
      location: "Campinas - Centro",
      attenuationLevel: 4.2,
      threshold: 3.0,
      status: "critical",
      lastMeasurement: new Date(Date.now() - 1800000).toLocaleString(),
      technician: "Luiz Porta"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    oltName: "",
    location: "",
    attenuationLevel: 0,
    threshold: 3.0
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
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const determineStatus = (attenuation: number, threshold: number) => {
    if (attenuation <= threshold * 0.8) return "normal";
    if (attenuation <= threshold) return "warning";
    return "critical";
  };

  const handleAddRecord = () => {
    if (!newRecord.oltName || !newRecord.location) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const status = determineStatus(newRecord.attenuationLevel, newRecord.threshold);
    
    const record: AttenuationRecord = {
      id: Date.now().toString(),
      ...newRecord,
      status,
      lastMeasurement: new Date().toLocaleString(),
      technician: "Luiz Porta"
    };

    setRecords([...records, record]);
    setNewRecord({ oltName: "", location: "", attenuationLevel: 0, threshold: 3.0 });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Medição de atenuação adicionada"
    });
  };

  const handleUpdateAttenuation = (id: string, newAttenuation: number) => {
    setRecords(records.map(record => {
      if (record.id === id) {
        const status = determineStatus(newAttenuation, record.threshold);
        return {
          ...record,
          attenuationLevel: newAttenuation,
          status,
          lastMeasurement: new Date().toLocaleString()
        };
      }
      return record;
    }));
    
    toast({
      title: "Atenuação atualizada",
      description: `Nova medição: ${newAttenuation} dB`
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Registro removido",
      description: "Medição removida da lista"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Controle de Atenuação OLT´s Remotas</CardTitle>
                <CardDescription>
                  Monitoramento dos níveis de atenuação para evitar degradação do sinal
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Medição
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAdding && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Nova Medição de Atenuação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oltName">Nome da OLT</Label>
                <Input
                  id="oltName"
                  value={newRecord.oltName}
                  onChange={(e) => setNewRecord({...newRecord, oltName: e.target.value})}
                  placeholder="OLT-ATT-XXX"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="Cidade - Região"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="attenuationLevel">Nível de Atenuação (dB)</Label>
                <Input
                  id="attenuationLevel"
                  type="number"
                  step="0.1"
                  min="0"
                  value={newRecord.attenuationLevel}
                  onChange={(e) => setNewRecord({...newRecord, attenuationLevel: parseFloat(e.target.value) || 0})}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="threshold">Limite Crítico (dB)</Label>
                <Input
                  id="threshold"
                  type="number"
                  step="0.1"
                  min="0"
                  value={newRecord.threshold}
                  onChange={(e) => setNewRecord({...newRecord, threshold: parseFloat(e.target.value) || 3.0})}
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
                <CardTitle className="text-lg">{record.oltName}</CardTitle>
                <Badge className={`${getStatusColor(record.status)} text-white`}>
                  {getStatusIcon(record.status)}
                  <span className="ml-1 capitalize">{record.status}</span>
                </Badge>
              </div>
              <CardDescription>{record.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Atenuação Atual:</span>
                  <span className="font-bold text-lg">{record.attenuationLevel} dB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Limite:</span>
                  <span className="font-medium">{record.threshold} dB</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      record.status === "normal" ? "bg-signal-strong" :
                      record.status === "warning" ? "bg-signal-medium" : "bg-signal-weak"
                    }`}
                    style={{ 
                      width: `${Math.min((record.attenuationLevel / (record.threshold * 1.5)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-foreground/70">Última Medição:</span>
                  <p className="font-medium">{record.lastMeasurement}</p>
                </div>
                <div>
                  <span className="text-foreground/70">Técnico:</span>
                  <p className="font-medium">{record.technician}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Nova medição"
                  className="flex-1 bg-background/50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = parseFloat((e.target as HTMLInputElement).value);
                      if (value >= 0) {
                        handleUpdateAttenuation(record.id, value);
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
            <TrendingUp className="h-12 w-12 text-primary/50 mx-auto mb-4" />
            <p className="text-foreground/70">Nenhuma medição cadastrada</p>
            <p className="text-sm text-foreground/50">Clique em "Nova Medição" para começar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttenuationControl;