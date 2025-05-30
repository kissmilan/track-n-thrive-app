
import { useState } from "react";
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
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [clients, setClients] = useState([
    {
      id: "1",
      name: "Nagy János",
      email: "nagy.janos@email.com",
      lastActivity: "2024-01-21 14:30",
      workoutCompleted: true,
      weightLogged: true,
      mealPlanFollowed: true,
      sheetsUrl: "https://docs.google.com/spreadsheets/d/sample1",
      docsUrl: "https://docs.google.com/document/d/sample1"
    },
    {
      id: "2", 
      name: "Kovács Mária",
      email: "kovacs.maria@email.com",
      lastActivity: "2024-01-21 09:15",
      workoutCompleted: false,
      weightLogged: true,
      mealPlanFollowed: false,
      sheetsUrl: "https://docs.google.com/spreadsheets/d/sample2",
      docsUrl: "https://docs.google.com/document/d/sample2"
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    sheetsUrl: "",
    docsUrl: ""
  });

  const { toast } = useToast();

  const addClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Hiba",
        description: "Kérlek töltsd ki a kötelező mezőket!",
        variant: "destructive",
      });
      return;
    }

    const client = {
      id: Date.now().toString(),
      ...newClient,
      lastActivity: "Még nincs aktivitás",
      workoutCompleted: false,
      weightLogged: false,
      mealPlanFollowed: false
    };

    setClients([...clients, client]);
    setNewClient({ name: "", email: "", sheetsUrl: "", docsUrl: "" });
    
    toast({
      title: "Kliens hozzáadva!",
      description: `${newClient.name} sikeresen hozzáadva a rendszerhez.`,
    });
  };

  const getActivityStatus = (client: any) => {
    const completed = [client.workoutCompleted, client.weightLogged, client.mealPlanFollowed].filter(Boolean).length;
    return `${completed}/3`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard 👨‍💼</h1>
          <p className="text-gray-600">Kövesd a klienseid haladását és kezeld az adatokat</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Áttekintés
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Kliensek
            </TabsTrigger>
            <TabsTrigger value="add-client" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Új kliens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Aktív ma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {clients.filter(c => c.lastActivity.includes("2024-01-21")).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Edzés teljesítve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {clients.filter(c => c.workoutCompleted).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Heti átlag
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">87%</div>
                  <p className="text-purple-100">követés</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mai aktivitás</CardTitle>
                <CardDescription>Kliensek mai teljesítménye</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-gray-600">Utolsó aktivitás: {client.lastActivity}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {client.workoutCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm">Edzés</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {client.weightLogged ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm">Testsúly</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {client.mealPlanFollowed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm">Étrend</span>
                        </div>
                        <Badge variant="outline">
                          {getActivityStatus(client)}
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
                <Card key={client.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{client.name}</CardTitle>
                        <CardDescription>{client.email}</CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getActivityStatus(client)} befejezve
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Mai aktivitás</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={client.workoutCompleted ? "default" : "secondary"}>
                            {client.workoutCompleted ? "✓" : "✗"} Edzés
                          </Badge>
                          <Badge variant={client.weightLogged ? "default" : "secondary"}>
                            {client.weightLogged ? "✓" : "✗"} Testsúly
                          </Badge>
                          <Badge variant={client.mealPlanFollowed ? "default" : "secondary"}>
                            {client.mealPlanFollowed ? "✓" : "✗"} Étrend
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Utolsó aktivitás</h4>
                        <p className="text-sm text-gray-600">{client.lastActivity}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Google Sheets
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Google Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Új kliens hozzáadása
                </CardTitle>
                <CardDescription>
                  Add meg az új kliens adatait és a Google Sheets/Docs linkeket
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Név *</Label>
                    <Input
                      id="clientName"
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      placeholder="Nagy János"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email cím *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      placeholder="nagy.janos@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sheetsUrl">Google Sheets URL</Label>
                  <Input
                    id="sheetsUrl"
                    value={newClient.sheetsUrl}
                    onChange={(e) => setNewClient({...newClient, sheetsUrl: e.target.value})}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                </div>
                <div>
                  <Label htmlFor="docsUrl">Google Docs URL</Label>
                  <Input
                    id="docsUrl"
                    value={newClient.docsUrl}
                    onChange={(e) => setNewClient({...newClient, docsUrl: e.target.value})}
                    placeholder="https://docs.google.com/document/d/..."
                  />
                </div>
                <Button onClick={addClient} className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Kliens hozzáadása
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
