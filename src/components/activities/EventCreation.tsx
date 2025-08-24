import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Signal, AlertTriangle, User, Calendar, Activity } from "lucide-react";

interface EventForm {
  eventNumber: string;
  hostname: string;
  city: string;
  latitude: string;
  longitude: string;
  status: "aberto" | "fechado";
  attenuationDbm: string;
  threshold: string;
  technician: string;
  eventStatus: string;
  resolutionActions: string;
}

const EventCreation = () => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<EventForm>();
  const { toast } = useToast();
  const [isRecurrent, setIsRecurrent] = useState(false);

  const watchedStatus = watch("status");

  const onSubmit = (data: EventForm) => {
    console.log("Dados do evento:", data);
    toast({
      title: "Evento registrado",
      description: `Evento ${data.eventNumber} foi criado com sucesso`,
    });
    reset();
    setIsRecurrent(false);
  };

  const handleRecurrentCheck = () => {
    setIsRecurrent(!isRecurrent);
    if (!isRecurrent) {
      setValue("resolutionActions", "Equipamento reincidente - Falha em menos de 30 dias. Ações: 1) Verificar histórico completo, 2) Análise de causa raiz, 3) Substituição preventiva se necessário");
    } else {
      setValue("resolutionActions", "");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <CardTitle className="gradient-text">Registro de Novo Evento</CardTitle>
          </div>
          <CardDescription>
            Cadastre um novo evento para controle de produtividade e acompanhamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Linha 1: Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventNumber" className="flex items-center space-x-1">
                  <span>Número do Evento</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="eventNumber"
                  placeholder="EV-2025-001"
                  {...register("eventNumber", { required: "Número do evento é obrigatório" })}
                  className="glass-input"
                />
                {errors.eventNumber && (
                  <p className="text-sm text-destructive">{errors.eventNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostname" className="flex items-center space-x-1">
                  <Signal className="h-4 w-4" />
                  <span>Hostname do Equipamento</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hostname"
                  placeholder="OLT-SP-001"
                  {...register("hostname", { required: "Hostname é obrigatório" })}
                  className="glass-input"
                />
                {errors.hostname && (
                  <p className="text-sm text-destructive">{errors.hostname.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Cidade</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="São Paulo"
                  {...register("city", { required: "Cidade é obrigatória" })}
                  className="glass-input"
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* Linha 2: Coordenadas e Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  placeholder="-23.5505"
                  {...register("latitude")}
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  placeholder="-46.6333"
                  {...register("longitude")}
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Status do Evento</Label>
                <Select onValueChange={(value) => setValue("status", value as "aberto" | "fechado")}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-primary/20">
                    <SelectItem value="aberto">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-signal-weak"></div>
                        <span>Aberto</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="fechado">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-signal-strong"></div>
                        <span>Fechado</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventStatus">Status Detalhado</Label>
                <Input
                  id="eventStatus"
                  placeholder="Em análise, Resolvido, etc."
                  {...register("eventStatus")}
                  className="glass-input"
                />
              </div>
            </div>

            {/* Linha 3: Medições técnicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attenuationDbm">Atenuação (dBm)</Label>
                <Input
                  id="attenuationDbm"
                  placeholder="-25.5"
                  type="number"
                  step="0.1"
                  {...register("attenuationDbm")}
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="threshold">Limiar da Rota/Equipamento</Label>
                <Input
                  id="threshold"
                  placeholder="-28.0"
                  type="number"
                  step="0.1"
                  {...register("threshold")}
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Técnico Responsável</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="technician"
                  placeholder="João Silva"
                  {...register("technician", { required: "Técnico é obrigatório" })}
                  className="glass-input"
                />
                {errors.technician && (
                  <p className="text-sm text-destructive">{errors.technician.message}</p>
                )}
              </div>
            </div>

            {/* Controle de Reincidência */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant={isRecurrent ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleRecurrentCheck}
                  className="flex items-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Marcar como Reincidente</span>
                </Button>
                {isRecurrent && (
                  <Badge variant="destructive">
                    Falha em menos de 30 dias
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolutionActions">
                  Ações de Resolução {isRecurrent && "(Pré-definidas para reincidentes)"}
                </Label>
                <Textarea
                  id="resolutionActions"
                  placeholder="Descreva as ações tomadas ou planejadas..."
                  rows={4}
                  {...register("resolutionActions")}
                  className="glass-input resize-none"
                  readOnly={isRecurrent}
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsRecurrent(false);
                }}
              >
                Limpar Formulário
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Registrar Evento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreation;