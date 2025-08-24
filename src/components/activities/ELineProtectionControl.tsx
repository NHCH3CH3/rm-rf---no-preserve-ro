import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ELineRecord {
  id: string;
  serviceName: string;
  location: string;
  protectionType: "1+1" | "1:1" | "1:N";
  primaryStatus: "active" | "failed" | "maintenance";
  backupStatus: "standby" | "active" | "failed" | "maintenance";
  switchingMode: "automatic" | "manual";
  lastSwitching: string;
  technician: string;
}

const ELineProtectionControl = () => {
  const [records, setRecords] = useState<ELineRecord[]>([
    {
      id: "1",
      serviceName: "E-LINE-SP-001",
      location: "São Paulo - Corporativo",
      protectionType: "1+1",
      primaryStatus: "active",
      backupStatus: "standby",
      switchingMode: "automatic",
      lastSwitching: "Sem comutações",
      technician: "Luiz Porta"
    },
    {
      id: "2",
      serviceName: "E-LINE-RJ-002",
      location: "Rio de Janeiro - Data Center",
      protectionType: "1:1",
      primaryStatus: "failed",
      backupStatus: "active",
      switchingMode: "automatic",
      lastSwitching: new Date(Date.now() - 7200000).toLocaleString(),
      technician: "Luiz Porta"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    serviceName: "",
    location: "",
    protectionType: "1+1" as const,
    primaryStatus: "active" as const,
    backupStatus: "standby" as const,
    switchingMode: "automatic" as const
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-signal-strong";
      case "standby": return "bg-signal-medium";
      case "failed": return "bg-signal-weak";
      case "maintenance": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "standby": return <RefreshCw className="h-4 w-4" />;
      case "failed": return <XCircle className="h-4 w-4" />;
      case "maintenance": return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getProtectionStatus = (primary: string, backup: string) => {
    if (primary === "active" && backup === "standby") return { status: "protected", color: "bg-signal-strong" };
    if (primary === "failed" && backup === "active") return { status: "using backup", color: "bg-signal-medium" };
    if (primary === "failed" && backup === "failed") return { status: "unprotected", color: "bg-signal-weak" };
    return { status: "check needed", color: "bg-warning" };
  };

  const handleAddRecord = () => {
    if (!newRecord.serviceName || !newRecord.location) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const record: ELineRecord = {
      id: Date.now().toString(),
      ...newRecord,
      lastSwitching: "Sem comutações",
      technician: "Luiz Porta"
    };

    setRecords([...records, record]);
    setNewRecord({ 
      serviceName: "", 
      location: "", 
      protectionType: "1+1", 
      primaryStatus: "active", 
      backupStatus: "standby", 
      switchingMode: "automatic" 
    });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Proteção E-Line adicionada"
    });
  };

  const handleSwitching = (id: string, mode: "primary" | "backup") => {
    setRecords(records.map(record => {
      if (record.id === id) {
        const newPrimaryStatus: "active" | "failed" | "maintenance" = mode === "primary" ? "active" : (record.primaryStatus === "maintenance" ? "maintenance" : "failed");
        const newBackupStatus: "active" | "failed" | "maintenance" | "standby" = mode === "backup" ? "active" : "standby";
        
        return {
          ...record,
          primaryStatus: newPrimaryStatus,
          backupStatus: newBackupStatus,
          lastSwitching: new Date().toLocaleString()
        };
      }
      return record;
    }));
    
    toast({
      title: "Comutação realizada",
      description: `Tráfego direcionado para ${mode === "primary" ? "circuito principal" : "circuito backup"}`
    });
  };

  const handleStatusUpdate = (id: string, circuit: "primary" | "backup", newStatus: any) => {
    setRecords(records.map(record => {
      if (record.id === id) {
        return {
          ...record,
          [circuit === "primary" ? "primaryStatus" : "backupStatus"]: newStatus
        };
      }
      return record;
    }));
    
    toast({
      title: "Status atualizado",
      description: `Circuito ${circuit === "primary" ? "principal" : "backup"} alterado para ${newStatus}`
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Registro removido",
      description: "Proteção removida da lista"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Controle Proteções E-Line</CardTitle>
                <CardDescription>
                  Monitoramento de proteções e redundância de circuitos E-Line
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Proteção
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAdding && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Adicionar Proteção E-Line</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceName">Nome do Serviço</Label>
                <Input
                  id="serviceName"
                  value={newRecord.serviceName}
                  onChange={(e) => setNewRecord({...newRecord, serviceName: e.target.value})}
                  placeholder="E-LINE-XXX-XXX"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="Cliente ou localização"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="protectionType">Tipo de Proteção</Label>
                <Select value={newRecord.protectionType} onValueChange={(value: any) => setNewRecord({...newRecord, protectionType: value})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1+1">1+1 (Linear)</SelectItem>
                    <SelectItem value="1:1">1:1 (Shared)</SelectItem>
                    <SelectItem value="1:N">1:N (Multiple)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="switchingMode">Modo de Comutação</Label>
                <Select value={newRecord.switchingMode} onValueChange={(value: any) => setNewRecord({...newRecord, switchingMode: value})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automático</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {records.map((record) => {
          const protection = getProtectionStatus(record.primaryStatus, record.backupStatus);
          return (
            <Card key={record.id} className="glass-card border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{record.serviceName}</CardTitle>
                  <Badge className={`${protection.color} text-white`}>
                    <Shield className="h-4 w-4 mr-1" />
                    {protection.status}
                  </Badge>
                </div>
                <CardDescription>{record.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Circuito Principal</span>
                      <Badge className={`${getStatusColor(record.primaryStatus)} text-white text-xs`}>
                        {getStatusIcon(record.primaryStatus)}
                        <span className="ml-1 capitalize">{record.primaryStatus}</span>
                      </Badge>
                    </div>
                    <Select 
                      value={record.primaryStatus} 
                      onValueChange={(value: any) => handleStatusUpdate(record.id, "primary", value)}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="failed">Falha</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Circuito Backup</span>
                      <Badge className={`${getStatusColor(record.backupStatus)} text-white text-xs`}>
                        {getStatusIcon(record.backupStatus)}
                        <span className="ml-1 capitalize">{record.backupStatus}</span>
                      </Badge>
                    </div>
                    <Select 
                      value={record.backupStatus} 
                      onValueChange={(value: any) => handleStatusUpdate(record.id, "backup", value)}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standby">Standby</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="failed">Falha</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Tipo:</span>
                    <span className="font-medium">{record.protectionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Modo:</span>
                    <span className="font-medium capitalize">{record.switchingMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Última Comutação:</span>
                    <span className="font-medium">{record.lastSwitching}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Técnico:</span>
                    <span className="font-medium">{record.technician}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleSwitching(record.id, "primary")}
                    className="flex-1 bg-gradient-primary"
                    disabled={record.primaryStatus === "failed"}
                  >
                    Para Principal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSwitching(record.id, "backup")}
                    className="flex-1"
                    disabled={record.backupStatus === "failed"}
                  >
                    Para Backup
                  </Button>
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
          );
        })}
      </div>

      {records.length === 0 && (
        <Card className="glass-card border-primary/20">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-primary/50 mx-auto mb-4" />
            <p className="text-foreground/70">Nenhuma proteção cadastrada</p>
            <p className="text-sm text-foreground/50">Clique em "Nova Proteção" para começar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ELineProtectionControl;