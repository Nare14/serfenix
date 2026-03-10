import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  LayoutDashboard,
  Users,
  FileEdit,
  Settings,
  Shield,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Video,
  Pencil,
  X,
  Crown,
  Sparkles,
  BadgeDollarSign,
} from "lucide-react";
import {
  fetchUsers,
  updateUser,
  deleteUser as apiDeleteUser,
  fetchAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo as apiDeleteVideo,
  fetchSettings,
  saveSettings,
  adminChangePassword,
} from "@/lib/api";

interface UserItem {
  id: number;
  email: string;
  disabled: boolean;
  membershipActive: boolean;
  membershipType: string | null;
}

interface VideoItem {
  id: number;
  title: string;
  description: string | null;
  url: string;
  category: string;
  sortOrder: number;
  active: boolean;
  membershipRequired: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [siteTitle, setSiteTitle] = useState("");
  const [siteSubtitle, setSiteSubtitle] = useState("");
  const [priceFenix, setPriceFenix] = useState("99");
  const [priceFenixPro, setPriceFenixPro] = useState("899");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [payLinkFenix, setPayLinkFenix] = useState("");
  const [payLinkFenixPro, setPayLinkFenixPro] = useState("");

  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoCategory, setVideoCategory] = useState("general");
  const [videoOrder, setVideoOrder] = useState("0");
  const [videoMembership, setVideoMembership] = useState("fenix");
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoError, setVideoError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "true") {
      setLocation("/admin");
      return;
    }
    loadData();
  }, [setLocation]);

  const loadData = async () => {
    const [u, v, s] = await Promise.all([
      fetchUsers(),
      fetchAdminVideos(),
      fetchSettings(),
    ]);

    setUsers(u);
    setVideos(v);
    setSiteTitle(s.siteTitle || "Tu poder habita dentro de ti ");
    setSiteSubtitle(s.siteSubtitle || "Bienvenido a tu renacer");
    setPriceFenix(s.priceFenix || "99");
    setPriceFenixPro(s.priceFenixPro || "899");
    setWhatsapp(s.contactWhatsapp || "");
    setInstagram(s.contactInstagram || "");
    setContactEmail(s.contactEmail || "");
    setSocialInstagram(s.socialInstagram || "");
    setSocialTiktok(s.socialTiktok || "");
    setSocialYoutube(s.socialYoutube || "");
    setPayLinkFenix(s.payLinkFenix || "");
    setPayLinkFenixPro(s.payLinkFenixPro || "");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setLocation("/admin");
  };

  const showSaved = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleSaveContent = async () => {
    await saveSettings({
      siteTitle,
      siteSubtitle,
      priceFenix,
      priceFenixPro,
    });
    showSaved("Contenido guardado exitosamente");
  };

  const handleSaveSettings = async () => {
    await saveSettings({
      contactWhatsapp: whatsapp,
      contactInstagram: instagram,
      contactEmail,
      socialInstagram,
      socialTiktok,
      socialYoutube,
      payLinkFenix,
      payLinkFenixPro,
    });
    showSaved("Configuración guardada exitosamente");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return;
    await adminChangePassword(newPassword);
    setNewPassword("");
    showSaved("Contraseña actualizada");
  };

  const handleToggleUser = async (user: UserItem) => {
    await updateUser(user.id, { disabled: !user.disabled });
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, disabled: !u.disabled } : u))
    );
  };

  const handleToggleMembership = async (user: UserItem) => {
    const newStatus = !user.membershipActive;
    await updateUser(user.id, {
      membershipActive: newStatus,
      membershipType: newStatus ? "fenix" : null,
    });

    setUsers(
      users.map((u) =>
        u.id === user.id
          ? {
              ...u,
              membershipActive: newStatus,
              membershipType: newStatus ? "fenix" : null,
            }
          : u
      )
    );
  };

  const handleChangeMembershipType = async (user: UserItem, type: string) => {
    await updateUser(user.id, { membershipType: type });
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, membershipType: type } : u))
    );
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`¿Eliminar al usuario ${user.email}?`)) return;
    await apiDeleteUser(user.id);
    setUsers(users.filter((u) => u.id !== user.id));
    showSaved("Usuario eliminado");
  };

  const openNewVideo = () => {
    setEditingVideo(null);
    setVideoTitle("");
    setVideoUrl("");
    setVideoDesc("");
    setVideoCategory("general");
    setVideoOrder("0");
    setVideoMembership("fenix");
    setVideoError("");
    setShowVideoForm(true);
  };

  const openEditVideo = (v: VideoItem) => {
    setEditingVideo(v);
    setVideoTitle(v.title);
    setVideoUrl(v.url);
    setVideoDesc(v.description || "");
    setVideoCategory(v.category);
    setVideoOrder(String(v.sortOrder));
    setVideoMembership(v.membershipRequired);
    setVideoError("");
    setShowVideoForm(true);
  };

  const handleSaveVideo = async () => {
    setVideoError("");

    if (!videoTitle.trim()) {
      setVideoError("Ingresá un título para el video.");
      return;
    }

    if (!videoUrl.trim()) {
      setVideoError("Ingresá la URL del video.");
      return;
    }

    setVideoSaving(true);

    try {
      const data = {
        title: videoTitle.trim(),
        url: videoUrl.trim(),
        description: videoDesc.trim(),
        category: videoCategory.trim() || "general",
        sortOrder: parseInt(videoOrder) || 0,
        membershipRequired: videoMembership,
        active: true,
      };

      if (editingVideo) {
        const updated = await updateVideo(editingVideo.id, data);
        setVideos(videos.map((v) => (v.id === editingVideo.id ? updated : v)));
        showSaved("Video actualizado");
      } else {
        const created = await createVideo(data);
        setVideos([...videos, created]);
        showSaved("Video creado exitosamente");
      }

      setShowVideoForm(false);
      setEditingVideo(null);
      setVideoTitle("");
      setVideoUrl("");
      setVideoDesc("");
      setVideoCategory("general");
      setVideoOrder("0");
      setVideoMembership("fenix");
    } catch (error) {
      console.error(error);
      setVideoError(
        "No se pudo guardar el video. Revisá la URL o intentá de nuevo."
      );
    } finally {
      setVideoSaving(false);
    }
  };

  const handleToggleVideoActive = async (v: VideoItem) => {
    const updated = await updateVideo(v.id, { active: !v.active });
    setVideos(videos.map((x) => (x.id === v.id ? updated : x)));
  };

  const handleDeleteVideo = async (v: VideoItem) => {
    if (!confirm(`¿Eliminar el video "${v.title}"?`)) return;
    await apiDeleteVideo(v.id);
    setVideos(videos.filter((x) => x.id !== v.id));
    showSaved("Video eliminado");
  };

  const totalUsers = users.length;
  const activeMemberships = users.filter((u) => u.membershipActive).length;
  const fenixUsers = users.filter(
    (u) => u.membershipActive && u.membershipType === "fenix"
  ).length;
  const fenixProUsers = users.filter(
    (u) => u.membershipActive && u.membershipType === "fenix_pro"
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-zinc-950 text-zinc-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-900">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-500/80 mb-2">
            SerFenix
          </p>
          <h2 className="text-3xl font-serif font-bold text-white">
            Fénix Admin
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Gestioná usuarios, videos, pagos y configuración del sitio.
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 hidden md:block">
          <div className="flex items-center gap-3 px-4 py-3 bg-rose-600/10 text-rose-400 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-900">
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-rose-500/80 mb-2">
              Panel de control
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">
              Dashboard
            </h1>
            <p className="text-zinc-500 mt-2">
              Administrá SerFenix desde un solo lugar.
            </p>
          </div>

          {savedMessage && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl flex items-center text-sm font-medium shadow-sm">
              <Check className="w-4 h-4 mr-2" />
              {savedMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <Card className="border-zinc-200 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Usuarios registrados</p>
                <h3 className="text-3xl font-bold text-zinc-900 mt-1">
                  {totalUsers}
                </h3>
              </div>
              <Users className="w-8 h-8 text-rose-500" />
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Membresías activas</p>
                <h3 className="text-3xl font-bold text-zinc-900 mt-1">
                  {activeMemberships}
                </h3>
              </div>
              <BadgeDollarSign className="w-8 h-8 text-emerald-500" />
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Sala Fénix</p>
                <h3 className="text-3xl font-bold text-zinc-900 mt-1">
                  {fenixUsers}
                </h3>
              </div>
              <Sparkles className="w-8 h-8 text-blue-500" />
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Sala Fénix 2.0</p>
                <h3 className="text-3xl font-bold text-zinc-900 mt-1">
                  {fenixProUsers}
                </h3>
              </div>
              <Crown className="w-8 h-8 text-purple-500" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-5 bg-zinc-200/60 mb-8 p-1 rounded-2xl">
            <TabsTrigger
              value="videos"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Video className="w-4 h-4 mr-2 hidden sm:block" />
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileEdit className="w-4 h-4 mr-2 hidden sm:block" />
              Contenido
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4 mr-2 hidden sm:block" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Settings className="w-4 h-4 mr-2 hidden sm:block" />
              Ajustes
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Shield className="w-4 h-4 mr-2 hidden sm:block" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-rose-500/80 mb-2">
                  Biblioteca
                </p>
                <h2 className="text-2xl font-bold text-zinc-900">
                  Gestión de Videos
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Total: {videos.length} videos
                </p>
              </div>
              <Button
                onClick={openNewVideo}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo video
              </Button>
            </div>

            {showVideoForm && (
              <Card className="border-rose-200 shadow-lg rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-rose-50 to-white border-b border-rose-100">
                  <div>
                    <CardTitle className="text-xl text-zinc-900">
                      {editingVideo ? "Editar video" : "Crear nuevo video"}
                    </CardTitle>
                    <CardDescription>
                      Completá los datos del contenido que querés subir al portal.
                    </CardDescription>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowVideoForm(false);
                      setVideoError("");
                    }}
                    className="rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-5 p-6">
                  {videoError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {videoError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Módulo 1: Introducción"
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>URL del video</Label>
                      <Input
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtu.be/... o enlace embebido"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      placeholder="Breve descripción del contenido"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Categoría / Módulo</Label>
                      <Input
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value)}
                        placeholder="Módulo 1"
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Orden</Label>
                      <Input
                        type="number"
                        value={videoOrder}
                        onChange={(e) => setVideoOrder(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Membresía requerida</Label>
                      <Select
                        value={videoMembership}
                        onValueChange={setVideoMembership}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fenix">Sala Fénix</SelectItem>
                          <SelectItem value="fenix_pro">
                            Sala Fénix 2.0
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleSaveVideo}
                      disabled={videoSaving}
                      className="bg-rose-600 text-white hover:bg-rose-700 rounded-xl"
                    >
                      {videoSaving
                        ? "Guardando..."
                        : editingVideo
                        ? "Guardar cambios"
                        : "Crear video"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowVideoForm(false);
                        setVideoError("");
                      }}
                      className="rounded-xl"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-100 text-zinc-600 font-medium">
                      <tr>
                        <th className="px-4 py-3">Título</th>
                        <th className="px-4 py-3 hidden md:table-cell">
                          Categoría
                        </th>
                        <th className="px-4 py-3 hidden md:table-cell">
                          Membresía
                        </th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {videos.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-zinc-500"
                          >
                            No hay videos todavía. Crea el primero.
                          </td>
                        </tr>
                      ) : (
                        videos.map((v) => (
                          <tr
                            key={v.id}
                            className="hover:bg-zinc-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <span className="font-medium text-zinc-900">
                                {v.title}
                              </span>
                              {v.description && (
                                <p className="text-zinc-500 text-xs mt-0.5 truncate max-w-xs">
                                  {v.description}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-zinc-600 capitalize">
                              {v.category}
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  v.membershipRequired === "fenix_pro"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {v.membershipRequired === "fenix_pro"
                                  ? "Fénix 2.0"
                                  : "Fénix"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  v.active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {v.active ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleToggleVideoActive(v)}
                                  title={v.active ? "Desactivar" : "Activar"}
                                >
                                  {v.active ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openEditVideo(v)}
                                  title="Editar"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-600 hover:bg-red-50 border-red-200"
                                  onClick={() => handleDeleteVideo(v)}
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="border-zinc-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Textos Principales</CardTitle>
                <CardDescription>
                  Modifica los textos que aparecen en la página de inicio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título Hero (Principal)</Label>
                  <Input
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    className="max-w-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo Hero</Label>
                  <Input
                    value={siteSubtitle}
                    onChange={(e) => setSiteSubtitle(e.target.value)}
                    className="max-w-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Planes y Precios</CardTitle>
                <CardDescription>
                  Actualiza los costos de las membresías
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Precio Sala Fénix (USD/mes)</Label>
                  <Input
                    type="number"
                    value={priceFenix}
                    onChange={(e) => setPriceFenix(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio Sala Fénix 2.0 (USD/6 meses)</Label>
                  <Input
                    type="number"
                    value={priceFenixPro}
                    onChange={(e) => setPriceFenixPro(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSaveContent}
              className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
            >
              Guardar Cambios de Contenido
            </Button>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-zinc-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Total registrados: {users.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-zinc-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-600 font-medium">
                        <tr>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Estado</th>
                          <th className="px-4 py-3">Membresía</th>
                          <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        {users.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-zinc-500"
                            >
                              No hay usuarios registrados todavía.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr
                              key={user.id}
                              className="hover:bg-zinc-50 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-zinc-900">
                                {user.email}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    user.disabled
                                      ? "bg-red-100 text-red-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {user.disabled ? "Desactivado" : "Activo"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      user.membershipActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-zinc-100 text-zinc-500"
                                    }`}
                                  >
                                    {user.membershipActive
                                      ? user.membershipType === "fenix_pro"
                                        ? "Fénix 2.0"
                                        : "Fénix"
                                      : "Sin membresía"}
                                  </span>

                                  {user.membershipActive && (
                                    <Select
                                      value={user.membershipType || "fenix"}
                                      onValueChange={(val) =>
                                        handleChangeMembershipType(user, val)
                                      }
                                    >
                                      <SelectTrigger className="w-28 h-7 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="fenix">
                                          Fénix
                                        </SelectItem>
                                        <SelectItem value="fenix_pro">
                                          Fénix 2.0
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleMembership(user)}
                                    className="text-xs"
                                  >
                                    {user.membershipActive
                                      ? "Quitar membresía"
                                      : "Dar membresía"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleToggleUser(user)}
                                    title={
                                      user.disabled ? "Activar" : "Desactivar"
                                    }
                                  >
                                    {user.disabled ? (
                                      <Eye className="w-4 h-4" />
                                    ) : (
                                      <EyeOff className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-red-600 hover:bg-red-50 border-red-200"
                                    onClick={() => handleDeleteUser(user)}
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-zinc-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>Enlaces y datos del sitio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram (contacto)</Label>
                  <Input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@tu.cuenta"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email de Soporte</Label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
                <CardDescription>
                  Enlaces que aparecen en el pie de página.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <Label>Instagram (URL completa)</Label>
                  <Input
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    placeholder="https://instagram.com/tu.cuenta"
                  />
                </div>
                <div className="space-y-2">
                  <Label>TikTok (URL completa)</Label>
                  <Input
                    value={socialTiktok}
                    onChange={(e) => setSocialTiktok(e.target.value)}
                    placeholder="https://tiktok.com/@tu.cuenta"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Canal de YouTube (URL completa)</Label>
                  <Input
                    value={socialYoutube}
                    onChange={(e) => setSocialYoutube(e.target.value)}
                    placeholder="https://youtube.com/@tu.canal"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Links de Pago (Mercado Pago)</CardTitle>
                <CardDescription>
                  Pegá aquí los links de pago generados en Mercado Pago.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <Label>Link de Pago — Sala Fénix ($99 USD)</Label>
                  <Input
                    value={payLinkFenix}
                    onChange={(e) => setPayLinkFenix(e.target.value)}
                    placeholder="https://www.mercadopago.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link de Pago — Sala Fénix 2.0 ($1499 USD)</Label>
                  <Input
                    value={payLinkFenixPro}
                    onChange={(e) => setPayLinkFenixPro(e.target.value)}
                    placeholder="https://www.mercadopago.com/..."
                  />
                </div>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 mt-4 rounded-xl"
                >
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-red-200 shadow-sm rounded-2xl">
              <CardHeader className="bg-red-50/50 border-b border-red-100 rounded-t-2xl">
                <CardTitle className="text-red-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Seguridad de la Cuenta
                </CardTitle>
                <CardDescription>
                  Cambiá la contraseña de acceso al panel de administrador
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 max-w-md">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nueva Contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full rounded-xl"
                  >
                    Actualizar Contraseña
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}