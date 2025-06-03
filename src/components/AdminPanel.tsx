
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Users, FileText, Activity, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { enhancedGoogleSheetsService } from "@/services/enhancedGoogleSheetsService";

interface Client {
  id: string;
  name: string;
  email: string;
  google_sheets_url: string | null;
  google_docs_url: string | null;
  created_at: string;
}

const AdminPanel = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    sheetsUrl: '',
    docsUrl: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      console.log('Loading clients...');
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Loaded clients:', data);
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Hiba",
        description: "Nem sikerült betölteni a klienseket.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Hiányzó adatok",
        description: "Név és email megadása kötelező!",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log('Adding client:', newClient);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Auth error:', userError);
        throw new Error('Nincs bejelentkezett felhasználó');
      }

      console.log('Current user:', user.id);

      // Process Google file links
      let sheetsUrl = newClient.sheetsUrl.trim() || null;
      let docsUrl = newClient.docsUrl.trim() || null;

      // If no manual links provided, try to find existing files
      if (!sheetsUrl && !docsUrl) {
        console.log('No manual links, trying to find files...');
        const result = await enhancedGoogleSheetsService.initializeClient(newClient.email);
        sheetsUrl = result.sheetsUrl;
        docsUrl = result.docsUrl;
        console.log('Found files:', { sheetsUrl, docsUrl });
      } else {
        console.log('Using manual links:', { sheetsUrl, docsUrl });
        // Initialize with provided links
        const result = await enhancedGoogleSheetsService.initializeClient(
          newClient.email, 
          { sheetsUrl: sheetsUrl || undefined, docsUrl: docsUrl || undefined }
        );
        console.log('Client initialized with provided links:', result);
      }

      // Insert client into database
      const clientData = {
        name: newClient.name.trim(),
        email: newClient.email.trim(),
        google_sheets_url: sheetsUrl,
        google_docs_url: docsUrl,
        created_by: user.id
      };

      console.log('Inserting client data:', clientData);

      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('Client inserted successfully:', data);

      toast({
        title: "Kliens hozzáadva",
        description: `${newClient.name} sikeresen hozzáadva a rendszerhez.`,
      });

      // Reset form and reload clients
      setNewClient({ name: '', email: '', sheetsUrl: '', docsUrl: '' });
      setShowAddForm(false);
      await loadClients();
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Hiba",
        description: `Nem sikerült hozzáadni a klienst: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`Biztosan törölni szeretnéd ${clientName} adatait?`)) {
      return;
    }

    try {
      console.log('Deleting client:', clientId);
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast({
        title: "Kliens törölve",
        description: `${clientName} sikeresen törölve.`,
      });

      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Hiba",
        description: "Nem sikerült törölni a klienst.",
        variant: "destructive"
      });
    }
  };

  const analyzeClientFiles = async (client: Client) => {
    try {
      setLoading(true);
      console.log('Analyzing files for client:', client.email);
      
      const result = await enhancedGoogleSheetsService.initializeClient(
        client.email,
        {
          sheetsUrl: client.google_sheets_url || undefined,
          docsUrl: client.google_docs_url || undefined
        }
      );

      console.log('Analysis result:', result);

      toast({
        title: "Fájlok elemezve",
        description: `${client.name} fájljai elemezve. Edzésgyakoriság: ${result.workoutFrequency}/hét`,
      });

    } catch (error) {
      console.error('Error analyzing files:', error);
      toast({
        title: "Hiba",
        description: "Nem sikerült elemezni a fájlokat.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Kliensek betöltése...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Kliensek kezelése és fájlok importálása</p>
        </div>

        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
            disabled={submitting}
          >
            <Plus className="w-4 h-4 mr-2" />
            Új kliens hozzáadása
          </Button>
        </div>

        {showAddForm && (
          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Új kliens hozzáadása</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Név *</Label>
                  <Input
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Kliens neve"
                    className="bg-gray-800 border-gray-600 text-white"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Email *</Label>
                  <Input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="kliens@email.com"
                    className="bg-gray-800 border-gray-600 text-white"
                    disabled={submitting}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Google Sheets URL (opcionális)</Label>
                  <Input
                    value={newClient.sheetsUrl}
                    onChange={(e) => setNewClient({ ...newClient, sheetsUrl: e.target.value })}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="bg-gray-800 border-gray-600 text-white"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Google Docs URL (opcionális)</Label>
                  <Input
                    value={newClient.docsUrl}
                    onChange={(e) => setNewClient({ ...newClient, docsUrl: e.target.value })}
                    placeholder="https://docs.google.com/document/d/..."
                    className="bg-gray-800 border-gray-600 text-white"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={addClient}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Hozzáadás...' : 'Kliens hozzáadása'}
                </Button>
                <Button
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                  disabled={submitting}
                >
                  Mégse
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {client.name}
                    </CardTitle>
                    <p className="text-gray-400">{client.email}</p>
                  </div>
                  <Button
                    onClick={() => deleteClient(client.id, client.name)}
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Google Sheets</Label>
                      {client.google_sheets_url ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">Csatolva</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(client.google_sheets_url!, '_blank')}
                            className="text-blue-400 border-gray-600"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Megnyitás
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          Nincs csatolva
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">Google Docs</Label>
                      {client.google_docs_url ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">Csatolva</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(client.google_docs_url!, '_blank')}
                            className="text-blue-400 border-gray-600"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Megnyitás
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          Nincs csatolva
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => analyzeClientFiles(client)}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      <Activity className="w-4 h-4 mr-1" />
                      Fájlok elemzése
                    </Button>
                    
                    {(client.google_sheets_url || client.google_docs_url) && (
                      <Button
                        onClick={() => window.open(`/?client=${client.email}`, '_blank')}
                        variant="outline"
                        size="sm"
                        className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Kliens nézet
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clients.length === 0 && !loading && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="text-center py-8">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">Még nincsenek kliensek</h3>
              <p className="text-gray-400 mb-4">Kezdd el az első kliens hozzáadásával!</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                disabled={submitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Első kliens hozzáadása
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
