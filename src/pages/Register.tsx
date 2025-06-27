
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // VULNÉRABILITÉ: INJECTION SQL dans la requête d'inscription
    // Cette requête est vulnérable car elle concatène directement les entrées utilisateur
    if (field === 'username' || field === 'email') {
      const query = `INSERT INTO users (username, email, password) VALUES ('${field === 'username' ? value : formData.username}', '${field === 'email' ? value : formData.email}', 'hashed_password')`;
      setSqlQuery(query);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ: VALIDATION CÔTÉ CLIENT UNIQUEMENT
    // Ces validations peuvent être contournées en modifiant le JavaScript
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // VULNÉRABILITÉ: INJECTION SQL dans l'inscription
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ('${formData.username}', '${formData.email}', '${formData.password}')`;
    console.log('VULNERABLE INSERT QUERY:', insertQuery);

    // Simulation d'injection SQL
    if (formData.username.includes("'") || formData.email.includes("'")) {
      toast.error("Erreur SQL détectée - mais l'injection est possible!");
      console.log('SQL INJECTION ATTEMPT DETECTED');
      
      // VULNÉRABILITÉ: DIVULGATION D'INFORMATIONS D'ERREUR
      setError(`Erreur SQL: Syntax error near '${formData.username}' in query: ${insertQuery}`);
      return;
    }

    // VULNÉRABILITÉ: STOCKAGE DE MOT DE PASSE EN CLAIR
    // Les mots de passe ne sont pas hachés (bcrypt, argon2, etc.)
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password, // Stockage en clair !
      createdAt: new Date().toISOString()
    };

    // Simulation de stockage en localStorage (base de données simulée)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    toast.success("Inscription réussie! Mot de passe stocké en clair.");
    console.log('USER REGISTERED WITH PLAIN PASSWORD:', userData);
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Inscription Vulnérable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Essayez: test'; DROP TABLE users; --"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="test@example.com' OR '1'='1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Stocké en clair!"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Validation côté client uniquement"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200">
                  <AlertDescription className="text-red-700 text-xs">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                S'inscrire
              </Button>
            </form>

            {/* VULNÉRABILITÉ: DIVULGATION DE LA REQUÊTE SQL */}
            {sqlQuery && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                <strong>Requête SQL générée (exposée!):</strong><br />
                <code>{sqlQuery}</code>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
              <p className="text-red-600"><strong>Vulnérabilités présentes:</strong></p>
              <ul className="text-xs mt-2 space-y-1">
                <li>• Injection SQL dans username/email</li>
                <li>• Validation côté client uniquement</li>
                <li>• Stockage de mot de passe en clair</li>
                <li>• Divulgation d'informations d'erreur SQL</li>
                <li>• Pas de protection CSRF</li>
              </ul>
            </div>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                Déjà inscrit ? Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
