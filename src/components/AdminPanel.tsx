
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp, 
  Calendar,
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { googleApiService } from "@/services/googleApiService";

interface Client {
  id: string;
  name: string;
  email: string;
  google_sheets_url: string | null;
  google_docs_url: string | null;
  created_at: string;
  updated_at: string;
}

const AdminPanel = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState({
    name: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Hiba a kliensek lekérésekor:', error);
      toast({
        title: "Hiba",
        description: "Nem sikerült betölteni a klienseket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Hiba",
        description: "Kérlek töltsd ki a kötelező mezőket!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Először megpróbáljuk megkeresni a meglévő fájlokat
      let fileUrls = await googleApiService.findExistingFiles(newClient.email);
      
      // Ha nincsenek fájlok, létrehozzuk őket
      if (!fileUrls.sheetsUrl || !fileUrls.docsUrl) {
        try {
          const createdFiles = await googleApiService.createClientFiles(newClient.name, newClient.email);
          fileUrls = {
            sheetsUrl: fileUrls.sheetsUrl || createdFiles.sheetsUrl,
            docsUrl: fileUrls.docsUrl || createdFiles.docsUrl
          };
        } catch (apiError) {
          console.warn('Google API fájl létrehozás sikertelen:', apiError);
          // Folytatjuk fájlok nélkül
        }
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: newClient.name,
          email: newClient.email,
          google_sheets_url: fileUrls.sheetsUrl,
          google_docs_url: fileUrls.docsUrl,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setClients([data, ...clients]);
      setNewClient({ name: "", email: "" });
      
      toast({
        title: "Kliens hozzáadva!",
        description: `${newClient.name} sikeresen hozzáadva a rendszerhez.`,
      });
    } catch (error: any) {
      console.error('Hiba a kliens hozzáadásakor:', error);
      toast({
        title: "Hiba",
        description: error.message || "Nem sikerült hozzáadni a klienst",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenFile = (url: string | null, type: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Fájl nem elérhető",
        description: `A ${type} fájl még nem lett létrehozva ehhez a klienshez.`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard 👨‍💼</h1>
          <p className="text-gray-400">Kövesd a klienseid haladását és kezeld az adatokat</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-700">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4" />
              Áttekintés
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              <Users className="w-4 h-4" />
              Kliensek
            </TabsTrigger>
            <TabsTrigger value="add-client" className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              <UserPlus className="w-4 h-4" />
              Új kliens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Összes kliens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{clients.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Aktív ma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {clients.filter(c => {
                      const today = new Date().toISOString().split('T')[0];
                      return c.updated_at.startsWith(today);
                    }).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Google fájlok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {clients.filter(c => c.google_sheets_url && c.google_docs_url).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Új kliensek
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {clients.filter(c => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(c.created_at) > weekAgo;
                    }).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Legutóbbi kliensek</CardTitle>
                <CardDescription className="text-gray-400">Nemrég hozzáadott kliensek</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800">
                      <div>
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        <p className="text-sm text-gray-400">{client.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={client.google_sheets_url ? "default" : "secondary"}>
                          {client.google_sheets_url ? "✓" : "✗"} Sheets
                        </Badge>
                        <Badge variant={client.google_docs_url ? "default" : "secondary"}>
                          {client.google_docs_url ? "✓" : "✗"} Docs
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{client.name}</CardTitle>
                        <CardDescription className="text-gray-400">{client.email}</CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(client.created_at).toLocaleDateString('hu-HU')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">Google fájlok</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={client.google_sheets_url ? "default" : "secondary"}>
                            {client.google_sheets_url ? "✓" : "✗"} Sheets
                          </Badge>
                          <Badge variant={client.google_docs_url ? "default" : "secondary"}>
                            {client.google_docs_url ? "✓" : "✗"} Docs
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">Utolsó frissítés</h4>
                        <p className="text-sm text-gray-400">{new Date(client.updated_at).toLocaleString('hu-HU')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        onClick={() => handleOpenFile(client.google_sheets_url, 'Sheets')}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Google Sheets
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        onClick={() => handleOpenFile(client.google_docs_url, 'Docs')}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Google Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {clients.length === 0 && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Users className="w-12 h-12 text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Még nincsenek kliensek</h3>
                    <p className="text-gray-400 text-center">Adj hozzá az első klienst az "Új kliens" fülön!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="add-client" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <UserPlus className="w-5 h-5" />
                  Új kliens hozzáadása
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Add meg az új kliens adatait. A Google Sheets és Docs fájlok automatikusan létrejönnek.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName" className="text-gray-300">Név *</Label>
                    <Input
                      id="clientName"
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      placeholder="Nagy János"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail" className="text-gray-300">Email cím *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      placeholder="nagy.janos@email.com"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <Button 
                  onClick={addClient} 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kliens hozzáadása...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Kliens hozzáadása
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
