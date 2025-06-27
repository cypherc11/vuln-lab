
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulation d'un délai de traitement
    setTimeout(() => {
      // Construction de la requête d'authentification
      const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
      console.log('Authentication query:', query);
      
      // Vérification des identifiants
      const authenticateUser = () => {
        // Injection SQL possible ici
        if (username.includes("'") || username.toLowerCase().includes('or ') || password.includes("'")) {
          const sessionId = `sess_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          localStorage.setItem('sessionId', sessionId);
          localStorage.setItem('username', username.replace(/'/g, ''));
          localStorage.setItem('isAdmin', username.toLowerCase().includes('admin') ? 'true' : 'false');
          
          toast.success("Connexion réussie!");
          navigate('/profile');
          return;
        }
        
        // Authentification standard
        if ((username === 'user' && password === 'password') || 
            (username === 'admin' && password === 'admin123')) {
          localStorage.setItem('sessionId', `sess_${Date.now()}_${username}`);
          localStorage.setItem('username', username);
          localStorage.setItem('isAdmin', username === 'admin' ? 'true' : 'false');
          toast.success("Connexion réussie!");
          navigate(username === 'admin' ? '/admin' : '/profile');
        } else {
          setError('Identifiants invalides');
        }
      };
      
      authenticateUser();
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">VulnApp</span>
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-fit">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Connexion
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Accédez à votre espace personnel
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">
                    Nom d'utilisateur
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre nom d'utilisateur"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-blue-900 text-sm">Comptes de démonstration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Utilisateur :</span>
                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">user / password</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Administrateur :</span>
                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">admin / admin123</code>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Nouveau sur la plateforme ?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
