import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Wifi, Radio } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import vivoLogo from "@/assets/vivo-logo.png";

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticação
    setTimeout(() => {
      if (email === "Luiz.porta@gmail.com" && password === "Admin2025") {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Sistema de Controle VIVO",
        });
        onLogin(email);
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos. Entre em contato com o administrador.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 telecom-grid">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 signal-animation">
          <Radio className="h-8 w-8 text-primary/20" />
        </div>
        <div className="absolute top-20 right-20 signal-animation" style={{ animationDelay: "0.5s" }}>
          <Wifi className="h-6 w-6 text-primary/30" />
        </div>
        <div className="absolute bottom-20 left-1/4 signal-animation" style={{ animationDelay: "1s" }}>
          <Radio className="h-10 w-10 text-primary/15" />
        </div>
      </div>

      <Card className="w-full max-w-md glass-card border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={vivoLogo} alt="VIVO" className="h-16 w-16 rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            Sistema de Controle VIVO
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Controle de Produtividade - Suporte Técnico
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@vivo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-foreground/60">
            <p>Acesso restrito aos colaboradores autorizados</p>
            <p className="mt-1">Para solicitar acesso, entre em contato com o administrador</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;