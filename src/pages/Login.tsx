
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ 1: INJECTION SQL
    // Cette requête SQL est vulnérable à l'injection car elle concatène directement les entrées utilisateur
    // Exploit: Essayez username = "admin' OR '1'='1' --" avec n'importe quel mot de passe
    const sqlQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    // Simulation de la vulnérabilité - affichage de la requête SQL pour démonstration
    setDebugInfo(`Requête SQL exécutée: ${sqlQuery}`);
    console.log('VULNERABLE SQL QUERY:', sqlQuery);
    
    // VULNÉRABILITÉ 2: DIVULGATION D'INFORMATIONS SENSIBLES
    // Les informations de debug ne devraient jamais être exposées en production
    
    // Simulation d'une injection SQL réussie
    if (username.includes("'") || username.toLowerCase().includes('or ') || password.includes("'")) {
      toast.success("Connexion réussie via injection SQL!");
      
      // VULNÉRABILITÉ 3: GESTION DE SESSION FAIBLE
      // SessionID prévisible et stocké en localStorage (non sécurisé)
      const predictableSessionId = `sess_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('sessionId', predictableSessionId);
      localStorage.setItem('username', username.replace(/'/g, '')); // Nettoyage basique
      localStorage.setItem('isAdmin', username.toLowerCase().includes('admin') ? 'true' : 'false');
      
      console.log('SESSION CREATED:', { sessionId: predictableSessionId, user: username });
      navigate('/profile');
      return;
    }
    
    // Authentification normale (faible)
    if (username === 'user' && password === 'password') {
      localStorage.setItem('sessionId', `sess_${Date.now()}_user`);
      localStorage.setItem('username', username);
      localStorage.setItem('isAdmin', 'false');
      toast.success("Connexion réussie!");
      navigate('/profile');
    } else if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('sessionId', `sess_${Date.now()}_admin`);
      localStorage.setItem('username', username);
      localStorage.setItem('isAdmin', 'true');
      toast.success("Connexion administrateur réussie!");
      navigate('/admin');
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Connexion Vulnérable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Essayez: admin' OR '1'='1' --"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="N'importe quoi avec l'injection"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Se connecter
              </Button>
            </form>

            {/* VULNÉRABILITÉ: DIVULGATION D'INFORMATIONS DE DEBUG */}
            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                <strong>Debug Info (ne devrait pas être visible!):</strong><br />
                {debugInfo}
              </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Comptes de test:</strong></p>
              <p>• user / password (utilisateur normal)</p>
              <p>• admin / admin123 (administrateur)</p>
              <p className="text-red-600 mt-2">
                <strong>Test d'injection SQL:</strong> admin' OR '1'='1' --
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/register" className="text-blue-600 hover:text-blue-800 text-sm">
                Pas de compte ? S'inscrire
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
