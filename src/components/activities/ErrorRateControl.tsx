import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity, Plus, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ErrorRecord {
  id: string;
  linkName: string;
  location: string;
  errorRate: number;
  threshold: number;
  bitRate: string;
  status: "normal" | "warning" | "critical";
  lastMeasurement: string;
  technician: string;
}

const ErrorRateControl = () => {
  const [records, setRecords] = useState<ErrorRecord[]>([
    {
      id: "1",
      linkName: "LINK-ERR-001",
      location: "São Paulo - Backbone",
      errorRate: 1e-9,
      threshold: 1e-6,
      bitRate: "10 Gbps",
      status: "normal",
      lastMeasurement: new Date().toLocaleString(),
      technician: "Luiz Porta"
    },
    {
      id: "2",
      linkName: "LINK-ERR-002",
      location: "Rio - Distribuição",
      errorRate: 5e-6,
      threshold: 1e-6,
      status: "critical",
      bitRate: "1 Gbps",
      lastMeasurement: new Date(Date.now() - 600000).toLocaleString(),
      technician: "Luiz Porta"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    linkName: "",
    location: "",
    errorRate: 0,
    threshold: 1e-6,
    bitRate: ""
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

  const determineStatus = (errorRate: number, threshold: number) => {
    if (errorRate <= threshold * 0.1) return "normal";
    if (errorRate <= threshold) return "warning";
    return "critical";
  };

  const formatErrorRate = (rate: number) => {
    if (rate >= 1e-3) return rate.toExponential(2);
    if (rate >= 1e-6) return (rate * 1e6).toFixed(2) + "e-6";
    if (rate >= 1e-9) return (rate * 1e9).toFixed(2) + "e-9";
    return rate.toExponential(2);
  };

  const parseErrorRate = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    
    if (value.includes('e-')) {
      return num;
    } else if (num < 1) {
      return num;
    } else {
      return num * 1e-6; // Assume micro if no exponent
    }
  };

  const handleAddRecord = () => {
    if (!newRecord.linkName || !newRecord.location || !newRecord.bitRate) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const status = determineStatus(newRecord.errorRate, newRecord.threshold);
    
    const record: ErrorRecord = {
      id: Date.now().toString(),
      ...newRecord,
      status,
      lastMeasurement: new Date().toLocaleString(),
      technician: "Luiz Porta"
    };

    setRecords([...records, record]);
    setNewRecord({ linkName: "", location: "", errorRate: 0, threshold: 1e-6, bitRate: "" });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Link adicionado ao monitoramento"
    });
  };

  const handleUpdateErrorRate = (id: string, newErrorRate: number) => {
    setRecords(records.map(record => {
      if (record.id === id) {
        const status = determineStatus(newErrorRate, record.threshold);
        return {
          ...record,
          errorRate: newErrorRate,
          status,
          lastMeasurement: new Date().toLocaleString()
        };
      }
      return record;
    }));
    
    toast({
      title: "Taxa de erro atualizada",
      description: `Nova medição: ${formatErrorRate(newErrorRate)}`
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Registro removido",
      description: "Link removido do monitoramento"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Controle de Taxa de Erro</CardTitle>
                <CardDescription>
                  Monitoramento de BER (Bit Error Rate) em enlaces de transmissão
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Link
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAdding && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Adicionar Link ao Monitoramento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkName">Nome do Link</Label>
                <Input
                  id="linkName"
                  value={newRecord.linkName}
                  onChange={(e) => setNewRecord({...newRecord, linkName: e.target.value})}
                  placeholder="LINK-ERR-XXX"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="Região ou rota"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="bitRate">Taxa de Bits</Label>
                <Input
                  id="bitRate"
                  value={newRecord.bitRate}
                  onChange={(e) => setNewRecord({...newRecord, bitRate: e.target.value})}
                  placeholder="Ex: 10 Gbps, 1 Gbps"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="threshold">Limite de BER</Label>
                <Input
                  id="threshold"
                  type="number"
                  step="any"
                  min="0"
                  value={newRecord.threshold}
                  onChange={(e) => setNewRecord({...newRecord, threshold: parseErrorRate(e.target.value)})}
                  placeholder="1e-6"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="errorRate">Taxa de Erro Inicial</Label>
                <Input
                  id="errorRate"
                  type="number"
                  step="any"
                  min="0"
                  value={newRecord.errorRate}
                  onChange={(e) => setNewRecord({...newRecord, errorRate: parseErrorRate(e.target.value)})}
                  placeholder="1e-9"
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="text-sm text-foreground/70">
              <p>Formatos aceitos: 1e-6, 1e-9, 0.000001, etc.</p>
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
                <CardTitle className="text-lg">{record.linkName}</CardTitle>
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
                  <span className="text-sm text-foreground/70">BER Atual:</span>
                  <span className="font-bold text-lg">{formatErrorRate(record.errorRate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Limite:</span>
                  <span className="font-medium">{formatErrorRate(record.threshold)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Taxa de Bits:</span>
                  <span className="font-medium">{record.bitRate}</span>
                </div>
                
                {/* Visual indicator */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      record.status === "normal" ? "bg-signal-strong" :
                      record.status === "warning" ? "bg-signal-medium" : "bg-signal-weak"
                    }`}
                    style={{ 
                      width: `${Math.min((record.errorRate / record.threshold) * 100, 100)}%` 
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
                  type="text"
                  placeholder="Nova medição"
                  className="flex-1 bg-background/50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      const errorRate = parseErrorRate(value);
                      if (errorRate >= 0) {
                        handleUpdateErrorRate(record.id, errorRate);
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
            <Activity className="h-12 w-12 text-primary/50 mx-auto mb-4" />
            <p className="text-foreground/70">Nenhum link monitorado</p>
            <p className="text-sm text-foreground/50">Clique em "Novo Link" para começar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorRateControl;