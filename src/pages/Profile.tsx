
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Upload, User } from 'lucide-react';
import { toast } from "sonner";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    bio: '',
    website: ''
  });
  const [comments, setComments] = useState<Array<{id: number, author: string, text: string, date: string}>>([]);
  const [newComment, setNewComment] = useState('');
  const [uploadedFile, setUploadedFile] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // VULNÉRABILITÉ: CONTRÔLE D'ACCÈS FAIBLE
    // Vérification basique de session côté client (facilement contournable)
    const sessionId = localStorage.getItem('sessionId');
    const username = localStorage.getItem('username');
    
    if (!sessionId) {
      toast.error("Session expirée");
      navigate('/login');
      return;
    }

    // VULNÉRABILITÉ: DIVULGATION D'INFORMATIONS DE SESSION
    console.log('SESSION INFO:', { sessionId, username });

    setUserInfo({
      username: username || '',
      email: `${username}@example.com`,
      bio: localStorage.getItem('userBio') || '',
      website: localStorage.getItem('userWebsite') || ''
    });

    // Charger les commentaires depuis localStorage
    const savedComments = JSON.parse(localStorage.getItem('profileComments') || '[]');
    setComments(savedComments);
  }, [navigate]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ: PAS DE TOKEN CSRF
    // Ce formulaire n'a pas de protection CSRF, permettant des attaques cross-site
    console.log('NO CSRF TOKEN - Form vulnerable to CSRF attacks');

    // VULNÉRABILITÉ: XSS STOCKÉ via les champs de profil
    // Les données ne sont pas échappées avant stockage
    localStorage.setItem('userBio', userInfo.bio);
    localStorage.setItem('userWebsite', userInfo.website);
    
    toast.success("Profil mis à jour (données non filtrées!)");
    console.log('STORED XSS POSSIBLE:', userInfo);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ: XSS STOCKÉ dans les commentaires
    // Les commentaires ne sont pas filtrés ou échappés
    const comment = {
      id: Date.now(),
      author: userInfo.username,
      text: newComment, // Contenu non filtré - XSS possible!
      date: new Date().toLocaleString()
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem('profileComments', JSON.stringify(updatedComments));
    
    console.log('XSS VULNERABLE COMMENT STORED:', comment);
    setNewComment('');
    toast.success("Commentaire ajouté (XSS possible!)");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // VULNÉRABILITÉ: UPLOAD DE FICHIER NON SÉCURISÉ
      // Aucune validation du type de fichier, taille, ou contenu
      console.log('UNSAFE FILE UPLOAD:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Simulation d'upload (en réalité, on stocke juste le nom)
      setUploadedFile(file.name);
      localStorage.setItem('uploadedAvatar', file.name);
      
      toast.success(`Fichier ${file.name} uploadé sans validation!`);
    }
  };

  const handleLogout = () => {
    // VULNÉRABILITÉ: DÉCONNEXION INCOMPLÈTE
    // La session n'est pas correctement invalidée côté serveur
    localStorage.removeItem('sessionId');
    toast.success("Déconnexion (session non invalidée côté serveur)");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <Button onClick={handleLogout} variant="outline">
            Déconnexion
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profil utilisateur */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Profil Vulnérable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    value={userInfo.username}
                    onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio (XSS possible)</Label>
                  <Textarea
                    id="bio"
                    value={userInfo.bio}
                    onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                    placeholder="Essayez: <script>alert('XSS')</script>"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={userInfo.website}
                    onChange={(e) => setUserInfo({...userInfo, website: e.target.value})}
                    placeholder="javascript:alert('XSS')"
                  />
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Mettre à jour (sans CSRF token)
                </Button>
              </form>

              {/* Upload d'avatar */}
              <div className="mt-6 space-y-2">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Avatar (Upload non sécurisé)
                </Label>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept="*/*"
                  className="cursor-pointer"
                />
                {uploadedFile && (
                  <p className="text-sm text-gray-600">
                    Fichier uploadé: <span className="text-red-600">{uploadedFile}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section commentaires */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💬 Commentaires (XSS Stocké)
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="comment">Nouveau commentaire</Label>
                  <Textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="<img src=x onerror=alert('XSS')>"
                    rows={3}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Publier commentaire
                </Button>
              </form>

              {/* Affichage des commentaires (VULNÉRABLE À XSS) */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-sm">{comment.author}</strong>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    {/* VULNÉRABILITÉ CRITIQUE: XSS STOCKÉ */}
                    {/* Le contenu est directement injecté dans le HTML sans échappement */}
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: comment.text }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affichage des données de profil avec XSS */}
        {userInfo.bio && (
          <Card className="border-red-400">
            <CardHeader>
              <CardTitle className="text-red-700">Bio affichée (XSS)</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: userInfo.bio }} />
            </CardContent>
          </Card>
        )}

        <Alert className="border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-700">
            <strong>Vulnérabilités de cette page:</strong><br />
            • XSS Stocké (bio, commentaires) • Upload non sécurisé • Pas de token CSRF 
            • Validation côté client • Session mal gérée
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Profile;
