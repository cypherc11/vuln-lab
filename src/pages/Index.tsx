
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, BookOpen } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header avec alerte de sécurité */}
      <div className="bg-red-600 text-white p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-bold">⚠️ ATTENTION: Site volontairement vulnérable - Environnement de test uniquement ⚠️</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">VulnApp</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Application Web Volontairement Vulnérable pour l'Entraînement au Pentest
          </p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800">
              <strong>Objectif éducatif :</strong> Cette application contient délibérément des failles de sécurité 
              basées sur l'OWASP Top 10 pour permettre l'apprentissage du pentest web.
            </p>
          </div>
        </div>

        {/* Navigation principale */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">🔐 Authentification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Pages de connexion et inscription avec failles d'injection SQL</p>
              <div className="space-y-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="w-full">Inscription</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-700">👤 Profil Utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gestion de profil avec upload non sécurisé et XSS</p>
              <Link to="/profile">
                <Button variant="outline" className="w-full">Mon Profil</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-700">🔍 Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Fonction de recherche vulnérable à l'injection SQL et XSS</p>
              <Link to="/search">
                <Button variant="outline" className="w-full">Rechercher</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">⚙️ Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Panel admin avec contrôle d'accès cassé</p>
              <Link to="/admin">
                <Button variant="outline" className="w-full">Admin Panel</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">📁 Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Upload de fichiers non sécurisé</p>
              <Link to="/upload">
                <Button variant="outline" className="w-full">Upload Fichier</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">📧 Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Formulaire de contact avec CSRF et injection</p>
              <Link to="/contact">
                <Button variant="outline" className="w-full">Nous Contacter</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Documentation des vulnérabilités */}
        <Card className="border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Vulnérabilités Implémentées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Failles Basiques :</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Injection SQL (Login, Recherche)</li>
                  <li>• XSS Réfléchi et Stocké</li>
                  <li>• CSRF (Formulaires)</li>
                  <li>• Upload non sécurisé</li>
                  <li>• Contrôle d'accès cassé</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Failles Avancées :</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Inclusion de fichiers (LFI/RFI)</li>
                  <li>• Gestion de sessions faible</li>
                  <li>• Divulgation d'informations</li>
                  <li>• Injection de commandes</li>
                  <li>• SSRF (Server-Side Request Forgery)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="text-sm text-gray-700">
                <strong>Conseil :</strong> Utilisez les outils de développement du navigateur pour examiner 
                le code source et identifier les vulnérabilités. Chaque faille est commentée dans le code.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
