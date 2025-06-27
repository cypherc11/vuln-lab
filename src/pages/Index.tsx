
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, BookOpen, User, Search, Settings, Upload, Mail, FileText, Lock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VulnApp
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="h-4 w-4" />
            Environnement de test sécurisé
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Plateforme d'entraînement
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pentest Web
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Apprenez la cybersécurité avec une application volontairement vulnérable. 
            Découvrez et exploitez les failles les plus courantes du web en toute sécurité.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Authentification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Explorez les failles d'injection SQL et de gestion des sessions</p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button variant="outline" className="w-full justify-start hover:bg-red-50 hover:border-red-200">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="w-full justify-start hover:bg-red-50 hover:border-red-200">
                    <User className="h-4 w-4 mr-2" />
                    Inscription
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Profil Utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Upload non sécurisé et vulnérabilités XSS</p>
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-200">
                  <User className="h-4 w-4 mr-2" />
                  Mon Profil
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Injection SQL et XSS dans les résultats</p>
              <Link to="/search">
                <Button variant="outline" className="w-full justify-start hover:bg-yellow-50 hover:border-yellow-200">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Contrôle d'accès défaillant et élévation de privilèges</p>
              <Link to="/admin">
                <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-200">
                  <Settings className="h-4 w-4 mr-2" />
                  Panel Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Upload de fichiers malveillants et RCE</p>
              <Link to="/upload">
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200">
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Attaques CSRF et injection de commandes</p>
              <Link to="/contact">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Nous Contacter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Vulnerabilities Documentation */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              Vulnérabilités Implémentées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Failles Critiques
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    Injection SQL (Login, Recherche)
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    XSS Réfléchi et Stocké
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    Upload non sécurisé
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    Injection de commandes
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Failles Avancées
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    CSRF (Cross-Site Request Forgery)
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    Inclusion de fichiers (LFI/RFI)
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    Contrôle d'accès cassé
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    SSRF (Server-Side Request Forgery)
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Guide d'utilisation</h4>
                  <p className="text-blue-800">
                    Utilisez les outils de développement de votre navigateur pour examiner le code source. 
                    Chaque vulnérabilité est documentée avec des commentaires explicatifs et des exemples d'exploitation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">⚠️ Cette application est volontairement vulnérable</p>
            <p className="text-sm">Utilisez uniquement dans un environnement de test sécurisé</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
