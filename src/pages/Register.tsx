
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulation d'un délai de traitement
    setTimeout(() => {
      // Validation basique côté client
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 4) {
        setError('Le mot de passe doit contenir au moins 4 caractères');
        setIsLoading(false);
        return;
      }

      // Construction de la requête d'insertion
      const insertQuery = `INSERT INTO users (username, email, password) VALUES ('${formData.username}', '${formData.email}', '${formData.password}')`;
      console.log('User registration query:', insertQuery);

      // Gestion des erreurs SQL simulée
      if (formData.username.includes("'") || formData.email.includes("'")) {
        setError(`Erreur de base de données: caractères spéciaux non autorisés`);
        setIsLoading(false);
        return;
      }

      // Simulation de stockage utilisateur
      const userData = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password, // Stockage direct du mot de passe
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Sauvegarde en localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Vérification d'unicité
      if (existingUsers.find((user: any) => user.username === formData.username)) {
        setError('Ce nom d\'utilisateur est déjà pris');
        setIsLoading(false);
        return;
      }

      existingUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      toast.success("Inscription réussie! Vous pouvez maintenant vous connecter.");
      setIsLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
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
              <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Créer un compte
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Rejoignez notre plateforme dès maintenant
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">
                    Nom d'utilisateur
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Choisissez un nom d'utilisateur"
                    className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Créez un mot de passe"
                      className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 pr-12"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Déjà inscrit ?{' '}
                  <Link to="/login" className="text-emerald-600 hover:text-emerald-800 font-medium">
                    Se connecter
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

export default Register;
