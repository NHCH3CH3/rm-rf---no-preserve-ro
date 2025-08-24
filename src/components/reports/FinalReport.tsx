import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Radio,
  Cable,
  Antenna,
  Shield,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FinalReport = () => {
  const [reportPeriod, setReportPeriod] = useState("week");
  const { toast } = useToast();

  // Mock data for demonstration
  const activitiesData = [
    { name: "OLT Manual", total: 12, active: 10, issues: 2, icon: Radio },
    { name: "Atenuação", total: 8, active: 6, issues: 2, icon: TrendingUp },
    { name: "Cabos", total: 5, active: 2, issues: 3, icon: Cable },
    { name: "Rádio", total: 15, active: 13, issues: 2, icon: Antenna },
    { name: "E-Line", total: 7, active: 6, issues: 1, icon: Shield },
    { name: "Taxa Erro", total: 3, active: 1, issues: 2, icon: Activity }
  ];

  const statusData = [
    { name: "Normal", value: 38, color: "#10B981" },
    { name: "Atenção", value: 8, color: "#F59E0B" },
    { name: "Crítico", value: 4, color: "#EF4444" }
  ];

  const trendsData = [
    { period: "Seg", incidents: 2, resolved: 8 },
    { period: "Ter", incidents: 1, resolved: 5 },
    { period: "Qua", incidents: 3, resolved: 7 },
    { period: "Qui", incidents: 0, resolved: 9 },
    { period: "Sex", incidents: 2, resolved: 6 },
    { period: "Sáb", incidents: 1, resolved: 4 },
    { period: "Dom", incidents: 0, resolved: 3 }
  ];

  const totalEquipments = activitiesData.reduce((sum, activity) => sum + activity.total, 0);
  const totalActive = activitiesData.reduce((sum, activity) => sum + activity.active, 0);
  const totalIssues = activitiesData.reduce((sum, activity) => sum + activity.issues, 0);
  const availability = ((totalActive / totalEquipments) * 100).toFixed(1);

  const handleExportReport = () => {
    const reportData = {
      date: new Date().toLocaleString(),
      period: reportPeriod,
      summary: {
        totalEquipments,
        totalActive,
        totalIssues,
        availability: `${availability}%`
      },
      activities: activitiesData,
      technician: "Luiz Porta"
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-vivo-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast({
      title: "Relatório exportado",
      description: "Arquivo baixado com sucesso"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Relatório Final de Produtividade</CardTitle>
                <CardDescription>
                  Consolidação das atividades de controle - Suporte VIVO
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setReportPeriod(reportPeriod === "week" ? "month" : "week")}>
                <Calendar className="h-4 w-4 mr-2" />
                {reportPeriod === "week" ? "Semanal" : "Mensal"}
              </Button>
              <Button onClick={handleExportReport} className="bg-gradient-primary">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Total Equipamentos</p>
                <p className="text-2xl font-bold">{totalEquipments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Operacionais</p>
                <p className="text-2xl font-bold text-signal-strong">{totalActive}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-signal-strong" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Com Problemas</p>
                <p className="text-2xl font-bold text-signal-weak">{totalIssues}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-signal-weak" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Disponibilidade</p>
                <p className="text-2xl font-bold text-primary">{availability}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activities Overview */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Detalhamento por Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesData.map((activity) => {
                const Icon = activity.icon;
                const successRate = ((activity.active / activity.total) * 100).toFixed(0);
                return (
                  <div key={activity.name} className="flex items-center justify-between p-3 rounded-lg bg-background/20">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-foreground/70">
                          {activity.active}/{activity.total} operacionais
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        activity.issues === 0 ? "bg-signal-strong" :
                        activity.issues <= 2 ? "bg-signal-medium" : "bg-signal-weak"
                      }>
                        {successRate}%
                      </Badge>
                      {activity.issues > 0 && (
                        <Badge variant="outline" className="text-signal-weak border-signal-weak">
                          {activity.issues} issues
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {statusData.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle>Tendência Semanal de Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="incidents" fill="#EF4444" name="Incidentes" />
                <Bar dataKey="resolved" fill="#10B981" name="Resolvidos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Report Metadata */}
      <Card className="glass-card border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-foreground/70">Gerado em:</span>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
            <div>
              <span className="text-foreground/70">Período:</span>
              <p className="font-medium">{reportPeriod === "week" ? "Última semana" : "Último mês"}</p>
            </div>
            <div>
              <span className="text-foreground/70">Responsável:</span>
              <p className="font-medium">Luiz Porta - Suporte Técnico VIVO</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalReport;