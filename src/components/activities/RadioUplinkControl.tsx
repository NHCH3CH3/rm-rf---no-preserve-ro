import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Antenna, Plus, Radio, Signal, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RadioRecord {
  id: string;
  linkName: string;
  location: string;
  frequency: string;
  signalStrength: number;
  bandwidth: string;
  status: "active" | "inactive" | "interference" | "maintenance";
  lastCheck: string;
  technician: string;
}

const RadioUplinkControl = () => {
  const [records, setRecords] = useState<RadioRecord[]>([
    {
      id: "1",
      linkName: "RADIO-UL-001",
      location: "Torre SP Centro",
      frequency: "18 GHz",
      signalStrength: -45,
      bandwidth: "100 Mbps",
      status: "active",
      lastCheck: new Date().toLocaleString(),
      technician: "Luiz Porta"
    },
    {
      id: "2",
      linkName: "RADIO-UL-002",
      location: "Antena RJ Zona Sul",
      frequency: "23 GHz",
      signalStrength: -72,
      bandwidth: "50 Mbps",
      status: "interference",
      lastCheck: new Date(Date.now() - 1200000).toLocaleString(),
      technician: "Luiz Porta"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    linkName: "",
    location: "",
    frequency: "",
    signalStrength: 0,
    bandwidth: "",
    status: "inactive" as const
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-signal-strong";
      case "inactive": return "bg-muted";
      case "interference": return "bg-signal-weak";
      case "maintenance": return "bg-signal-medium";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "inactive": return <Radio className="h-4 w-4" />;
      case "interference": return <AlertTriangle className="h-4 w-4" />;
      case "maintenance": return <Signal className="h-4 w-4" />;
      default: return <Radio className="h-4 w-4" />;
    }
  };

  const getSignalQuality = (strength: number) => {
    if (strength >= -50) return { quality: "Excelente", color: "text-signal-strong" };
    if (strength >= -65) return { quality: "Bom", color: "text-signal-strong" };
    if (strength >= -75) return { quality: "Regular", color: "text-signal-medium" };
    return { quality: "Fraco", color: "text-signal-weak" };
  };

  const handleAddRecord = () => {
    if (!newRecord.linkName || !newRecord.location || !newRecord.frequency || !newRecord.bandwidth) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const record: RadioRecord = {
      id: Date.now().toString(),
      ...newRecord,
      lastCheck: new Date().toLocaleString(),
      technician: "Luiz Porta"
    };

    setRecords([...records, record]);
    setNewRecord({ 
      linkName: "", 
      location: "", 
      frequency: "", 
      signalStrength: 0, 
      bandwidth: "", 
      status: "inactive" 
    });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Link de rádio adicionado"
    });
  };

  const handleStatusUpdate = (id: string, newStatus: any) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { 
            ...record, 
            status: newStatus, 
            lastCheck: new Date().toLocaleString()
          }
        : record
    ));
    
    toast({
      title: "Status atualizado",
      description: `Link alterado para ${newStatus}`
    });
  };

  const handleSignalUpdate = (id: string, newSignal: number) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { 
            ...record, 
            signalStrength: newSignal, 
            lastCheck: new Date().toLocaleString()
          }
        : record
    ));
    
    toast({
      title: "Sinal atualizado",
      description: `Nova potência: ${newSignal} dBm`
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Registro removido",
      description: "Link removido da lista"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Antenna className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Controle Up-Link Rádio</CardTitle>
                <CardDescription>
                  Monitoramento de enlaces de microondas e transmissão via rádio
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
            <CardTitle>Adicionar Link de Rádio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkName">Nome do Link</Label>
                <Input
                  id="linkName"
                  value={newRecord.linkName}
                  onChange={(e) => setNewRecord({...newRecord, linkName: e.target.value})}
                  placeholder="RADIO-UL-XXX"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="Torre/Antena local"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequência</Label>
                <Select value={newRecord.frequency} onValueChange={(value) => setNewRecord({...newRecord, frequency: value})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6 GHz">6 GHz</SelectItem>
                    <SelectItem value="11 GHz">11 GHz</SelectItem>
                    <SelectItem value="15 GHz">15 GHz</SelectItem>
                    <SelectItem value="18 GHz">18 GHz</SelectItem>
                    <SelectItem value="23 GHz">23 GHz</SelectItem>
                    <SelectItem value="38 GHz">38 GHz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bandwidth">Largura de Banda</Label>
                <Select value={newRecord.bandwidth} onValueChange={(value) => setNewRecord({...newRecord, bandwidth: value})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Selecione a banda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10 Mbps">10 Mbps</SelectItem>
                    <SelectItem value="50 Mbps">50 Mbps</SelectItem>
                    <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                    <SelectItem value="250 Mbps">250 Mbps</SelectItem>
                    <SelectItem value="500 Mbps">500 Mbps</SelectItem>
                    <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="signalStrength">Potência do Sinal (dBm)</Label>
                <Input
                  id="signalStrength"
                  type="number"
                  min="-100"
                  max="0"
                  value={newRecord.signalStrength}
                  onChange={(e) => setNewRecord({...newRecord, signalStrength: parseInt(e.target.value) || 0})}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="status">Status Inicial</Label>
                <Select value={newRecord.status} onValueChange={(value: any) => setNewRecord({...newRecord, status: value})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="interference">Interferência</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
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
        {records.map((record) => {
          const signalQuality = getSignalQuality(record.signalStrength);
          return (
            <Card key={record.id} className="glass-card border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{record.linkName}</CardTitle>
                  <Badge className={`${getStatusColor(record.status)} text-white`}>
                    {getStatusIcon(record.status)}
                    <span className="ml-1 capitalize">{
                      record.status === "active" ? "Ativo" :
                      record.status === "inactive" ? "Inativo" :
                      record.status === "interference" ? "Interferência" : "Manutenção"
                    }</span>
                  </Badge>
                </div>
                <CardDescription>{record.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-foreground/70">Frequência:</span>
                    <p className="font-medium">{record.frequency}</p>
                  </div>
                  <div>
                    <span className="text-foreground/70">Banda:</span>
                    <p className="font-medium">{record.bandwidth}</p>
                  </div>
                  <div>
                    <span className="text-foreground/70">Sinal:</span>
                    <p className={`font-medium ${signalQuality.color}`}>
                      {record.signalStrength} dBm
                    </p>
                  </div>
                  <div>
                    <span className="text-foreground/70">Qualidade:</span>
                    <p className={`font-medium ${signalQuality.color}`}>
                      {signalQuality.quality}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-foreground/70">Último Check:</span>
                    <p className="font-medium">{record.lastCheck}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-foreground/70">Técnico:</span>
                    <p className="font-medium">{record.technician}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Select value={record.status} onValueChange={(value: any) => handleStatusUpdate(record.id, value)}>
                    <SelectTrigger className="flex-1 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="interference">Interferência</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(record.id)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    🗑️
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    min="-100"
                    max="0"
                    placeholder="Nova potência"
                    className="flex-1 bg-background/50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt((e.target as HTMLInputElement).value);
                        if (value >= -100 && value <= 0) {
                          handleSignalUpdate(record.id, value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <span className="text-sm text-foreground/70 flex items-center">dBm</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {records.length === 0 && (
        <Card className="glass-card border-primary/20">
          <CardContent className="text-center py-12">
            <Antenna className="h-12 w-12 text-primary/50 mx-auto mb-4" />
            <p className="text-foreground/70">Nenhum link cadastrado</p>
            <p className="text-sm text-foreground/50">Clique em "Novo Link" para começar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RadioUplinkControl;