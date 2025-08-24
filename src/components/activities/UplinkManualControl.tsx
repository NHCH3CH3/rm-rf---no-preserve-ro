import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Radio, Plus, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UplinkRecord {
  id: string;
  oltName: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastCheck: string;
  signalLevel: number;
  technician: string;
}

const UplinkManualControl = () => {
  const [records, setRecords] = useState<UplinkRecord[]>([
    {
      id: "1",
      oltName: "OLT-REM-001",
      location: "São Paulo - Zona Sul",
      status: "online",
      lastCheck: new Date().toLocaleString(),
      signalLevel: 95,
      technician: "Luiz Porta"
    },
    {
      id: "2", 
      oltName: "OLT-REM-002",
      location: "Rio de Janeiro - Centro",
      status: "maintenance",
      lastCheck: new Date(Date.now() - 3600000).toLocaleString(),
      signalLevel: 0,
      technician: "Luiz Porta"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    oltName: "",
    location: "",
    status: "offline" as const,
    signalLevel: 0
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-signal-strong";
      case "offline": return "bg-signal-weak";
      case "maintenance": return "bg-signal-medium";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="h-4 w-4" />;
      case "offline": return <AlertCircle className="h-4 w-4" />;
      case "maintenance": return <Radio className="h-4 w-4" />;
      default: return <Radio className="h-4 w-4" />;
    }
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

    const record: UplinkRecord = {
      id: Date.now().toString(),
      ...newRecord,
      lastCheck: new Date().toLocaleString(),
      technician: "Luiz Porta"
    };

    setRecords([...records, record]);
    setNewRecord({ oltName: "", location: "", status: "offline", signalLevel: 0 });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Registro adicionado com sucesso"
    });
  };

  const handleStatusUpdate = (id: string, newStatus: "online" | "offline" | "maintenance") => {
    setRecords(records.map(record => 
      record.id === id 
        ? { 
            ...record, 
            status: newStatus, 
            lastCheck: new Date().toLocaleString(),
            signalLevel: newStatus === "online" ? Math.floor(Math.random() * 30) + 70 : 0
          }
        : record
    ));
    
    toast({
      title: "Status atualizado",
      description: `OLT alterada para ${newStatus}`
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Registro removido",
      description: "OLT removida da lista"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Controle de Up-Link Manual OLT´s Remotas</CardTitle>
                <CardDescription>
                  Monitoramento e controle manual das OLTs remotas
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova OLT
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAdding && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Adicionar Nova OLT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oltName">Nome da OLT</Label>
                <Input
                  id="oltName"
                  value={newRecord.oltName}
                  onChange={(e) => setNewRecord({...newRecord, oltName: e.target.value})}
                  placeholder="OLT-REM-XXX"
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
                <Label htmlFor="status">Status Inicial</Label>
                <Select value={newRecord.status} onValueChange={(value: any) => setNewRecord({...newRecord, status: value})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="signalLevel">Nível do Sinal (%)</Label>
                <Input
                  id="signalLevel"
                  type="number"
                  min="0"
                  max="100"
                  value={newRecord.signalLevel}
                  onChange={(e) => setNewRecord({...newRecord, signalLevel: parseInt(e.target.value) || 0})}
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
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-foreground/70">Último Check:</span>
                  <p className="font-medium">{record.lastCheck}</p>
                </div>
                <div>
                  <span className="text-foreground/70">Sinal:</span>
                  <p className="font-medium">{record.signalLevel}%</p>
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
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(record.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {records.length === 0 && (
        <Card className="glass-card border-primary/20">
          <CardContent className="text-center py-12">
            <Radio className="h-12 w-12 text-primary/50 mx-auto mb-4" />
            <p className="text-foreground/70">Nenhuma OLT cadastrada</p>
            <p className="text-sm text-foreground/50">Clique em "Nova OLT" para começar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UplinkManualControl;