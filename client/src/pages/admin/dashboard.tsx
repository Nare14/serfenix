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
  BadgeDollarSign,
  ArrowUp,
  ArrowDown,
  PlayCircle,
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

function normalizeVideoPreviewUrl(url: string) {
  const clean = url.trim();
  if (!clean) return "";

  if (clean.includes("youtube.com/embed/")) return clean;

  if (clean.includes("youtu.be/")) {
    const id = clean.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : clean;
  }

  if (clean.includes("youtube.com/watch")) {
    try {
      const parsed = new URL(clean);
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : clean;
    } catch {
      return clean;
    }
  }

  if (clean.includes("vimeo.com/") && !clean.includes("player.vimeo.com")) {
    const parts = clean.split("vimeo.com/");
    const id = parts[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : clean;
  }

  return clean;
}

function getLocalViews(videoId: number) {
  try {
    const raw = localStorage.getItem("mockVideoViews");
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Number(parsed?.[videoId] || 0);
  } catch {
    return 0;
  }
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState("videos");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [siteTitle, setSiteTitle] = useState("");
  const [siteSubtitle, setSiteSubtitle] = useState("");
  const [salaFenixDescription, setSalaFenixDescription] = useState("");
  const [salaFenixItems, setSalaFenixItems] = useState("");
  const [priceFenixPro, setPriceFenixPro] = useState("1999");
  const [fenixProMonths, setFenixProMonths] = useState("6");

  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");

  const [payLinkFenixProPaypal, setPayLinkFenixProPaypal] = useState("");
  const [payLinkFenixProInstagram, setPayLinkFenixProInstagram] = useState("");

  const [settingsSaving, setSettingsSaving] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);

  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoCategory, setVideoCategory] = useState("general");
  const [videoOrder, setVideoOrder] = useState("0");
  const [videoMembership, setVideoMembership] = useState("fenix_pro");
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoError, setVideoError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "true") {
      setLocation("/admin");
      return;
    }
    loadData();
  }, [setLocation]);

  const showSaved = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const loadData = async () => {
    try {
      const [u, v, s] = await Promise.all([
        fetchUsers(),
        fetchAdminVideos(),
        fetchSettings(),
      ]);

      const sortedVideos = [...v].sort(
        (a: VideoItem, b: VideoItem) => a.sortOrder - b.sortOrder
      );

      setUsers(u);
      setVideos(sortedVideos);

      setSiteTitle(s.siteTitle || "Tu poder habita dentro de ti");
      setSiteSubtitle(s.siteSubtitle || "Bienvenido a tu renacer");
      setSalaFenixDescription(s.salaFenixDescription || "");
      setSalaFenixItems(
        s.salaFenixItems ||
          [
            "Mentoría semanal en VIVO con Sofi exclusiva Sala Fénix 2.0",
            "WhatsApp ilimitado 1:1 conmigo",
            "Descubrí tu propósito de vida",
            "Aprenderás a armar una rutina equilibrada y estratégica de tu vida en todas las áreas",
            "Reprogramá tu subconsciente y sintonizá con la vida que Dios tiene para vos",
            "Creá tu marca personal",
          ].join("\n")
      );
      setPriceFenixPro(s.priceFenixPro || "1999");
      setFenixProMonths(s.fenixProMonths || "6");

      setWhatsapp(s.contactWhatsapp || "");
      setInstagram(s.contactInstagram || "");
      setContactEmail(s.contactEmail || "");

      setSocialInstagram(s.socialInstagram || "");
      setSocialTiktok(s.socialTiktok || "");
      setSocialYoutube(s.socialYoutube || "");

      setPayLinkFenixProPaypal(s.payLinkFenixProPaypal || "");
      setPayLinkFenixProInstagram(s.payLinkFenixProInstagram || "");
    } catch (error) {
      console.error("Error cargando dashboard:", error);
      showSaved("Error al cargar videos o datos del panel");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setLocation("/admin");
  };

  const handleSaveContent = async () => {
    try {
      setContentSaving(true);

      await saveSettings({
        siteTitle: siteTitle.trim(),
        siteSubtitle: siteSubtitle.trim(),
        salaFenixDescription: salaFenixDescription.trim(),
        salaFenixItems: salaFenixItems.trim(),
        priceFenixPro: priceFenixPro.trim(),
        fenixProMonths: fenixProMonths.trim(),
      });

      await loadData();
      showSaved("Contenido guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar contenido:", error);
      showSaved("Error al guardar el contenido");
    } finally {
      setContentSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsSaving(true);

      const payload = {
        contactWhatsapp: whatsapp.trim(),
        contactInstagram: instagram.trim(),
        contactEmail: contactEmail.trim(),
        socialInstagram: socialInstagram.trim(),
        socialTiktok: socialTiktok.trim(),
        socialYoutube: socialYoutube.trim(),
        payLinkFenixProPaypal: payLinkFenixProPaypal.trim(),
        payLinkFenixProInstagram: payLinkFenixProInstagram.trim(),
      };

      await saveSettings(payload);
      await loadData();
      showSaved("Configuración guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      showSaved("Error al guardar la configuración");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return;

    try {
      await adminChangePassword(newPassword);
      setNewPassword("");
      showSaved("Contraseña actualizada");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      showSaved("No se pudo actualizar la contraseña");
    }
  };

  const handleToggleUser = async (user: UserItem) => {
    try {
      await updateUser(user.id, { disabled: !user.disabled });
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, disabled: !u.disabled } : u
        )
      );
    } catch (error) {
      console.error(error);
      showSaved("No se pudo actualizar el usuario");
    }
  };

  const handleToggleMembership = async (user: UserItem) => {
    try {
      const newStatus = !user.membershipActive;

      await updateUser(user.id, {
        membershipActive: newStatus,
        membershipType: newStatus ? "fenix_pro" : null,
      });

      setUsers(
        users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                membershipActive: newStatus,
                membershipType: newStatus ? "fenix_pro" : null,
              }
            : u
        )
      );
    } catch (error) {
      console.error(error);
      showSaved("No se pudo actualizar la membresía");
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`¿Eliminar al usuario ${user.email}?`)) return;

    try {
      await apiDeleteUser(user.id);
      setUsers(users.filter((u) => u.id !== user.id));
      showSaved("Usuario eliminado");
    } catch (error) {
      console.error(error);
      showSaved("No se pudo eliminar el usuario");
    }
  };

  const openNewVideo = () => {
    setEditingVideo(null);
    setVideoTitle("");
    setVideoUrl("");
    setVideoDesc("");
    setVideoCategory("general");
    setVideoOrder(String(videos.length));
    setVideoMembership("fenix_pro");
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
    setVideoMembership(
      v.membershipRequired === "fenix_pro" ? "fenix_pro" : "fenix_pro"
    );
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

    if (!videoMembership) {
      setVideoError("Seleccioná la sala para este video.");
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
        membershipRequired: "fenix_pro",
        active: true,
      };

      if (editingVideo) {
        const updated = await updateVideo(editingVideo.id, data);
        setVideos(
          videos
            .map((v) => (v.id === editingVideo.id ? updated : v))
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
        showSaved("Video actualizado");
      } else {
        const created = await createVideo(data);
        setVideos(
          [...videos, created].sort((a, b) => a.sortOrder - b.sortOrder)
        );
        showSaved("Video creado exitosamente");
      }

      setShowVideoForm(false);
      setEditingVideo(null);
      setVideoTitle("");
      setVideoUrl("");
      setVideoDesc("");
      setVideoCategory("general");
      setVideoOrder("0");
      setVideoMembership("fenix_pro");
    } catch (error) {
      console.error(error);
      setVideoError(
        "No se pudo guardar el video en el servidor. Verificá la API e intentá otra vez."
      );
    } finally {
      setVideoSaving(false);
    }
  };

  const handleToggleVideoActive = async (v: VideoItem) => {
    try {
      const updated = await updateVideo(v.id, { active: !v.active });
      setVideos(videos.map((x) => (x.id === v.id ? updated : x)));
      showSaved("Estado del video actualizado");
    } catch (error) {
      console.error(error);
      showSaved("No se pudo actualizar el estado del video");
    }
  };

  const handleDeleteVideo = async (v: VideoItem) => {
    if (!confirm(`¿Eliminar el video "${v.title}"?`)) return;

    try {
      await apiDeleteVideo(v.id);
      setVideos(videos.filter((x) => x.id !== v.id));
      showSaved("Video eliminado");
    } catch (error) {
      console.error(error);
      showSaved("No se pudo eliminar el video");
    }
  };

  const handleMoveVideo = async (index: number, direction: "up" | "down") => {
    const newVideos = [...videos];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newVideos.length) return;

    const current = newVideos[index];
    const target = newVideos[swapIndex];

    const currentOrder = current.sortOrder;
    const targetOrder = target.sortOrder;

    newVideos[index] = { ...target, sortOrder: currentOrder };
    newVideos[swapIndex] = { ...current, sortOrder: targetOrder };

    const sorted = [...newVideos].sort((a, b) => a.sortOrder - b.sortOrder);

    try {
      await updateVideo(current.id, { sortOrder: targetOrder });
      await updateVideo(target.id, { sortOrder: currentOrder });
      setVideos(sorted);
      showSaved("Orden actualizado");
    } catch (error) {
      console.error(error);
      showSaved("No se pudo actualizar el orden");
    }
  };

  const totalUsers = users.length;
  const activeMemberships = users.filter((u) => u.membershipActive).length;
  const fenixProUsers = users.filter(
    (u) => u.membershipActive && u.membershipType === "fenix_pro"
  ).length;
  const activeVideos = videos.filter((v) => v.active).length;

  const previewUrl = normalizeVideoPreviewUrl(videoUrl);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex flex-col md:flex-row"
    >
      <aside className="w-full md:w-80 bg-gradient-to-b from-rose-950 via-red-900 to-rose-900 text-rose-100 flex flex-col shrink-0 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-200/80 mb-2">
            SabiduriaFenix
          </p>
          <h2 className="text-3xl font-serif font-bold text-white">
            Fénix Admin
          </h2>
          <p className="text-sm text-rose-100/70 mt-2">
            Gestioná usuarios, videos, pagos y configuración del sitio.
          </p>
        </div>

        <div className="px-4 py-6">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-2xl font-medium border border-white/10 backdrop-blur-sm mb-4">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </div>

          <TabsList className="flex flex-col gap-2 h-auto bg-transparent p-0">
            <TabsTrigger
              value="videos"
              className="w-full justify-start rounded-2xl px-4 py-3 text-left text-rose-100/80 hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-rose-900 data-[state=active]:shadow-sm"
            >
              <Video className="w-4 h-4 mr-3" />
              Videos
            </TabsTrigger>

            <TabsTrigger
              value="content"
              className="w-full justify-start rounded-2xl px-4 py-3 text-left text-rose-100/80 hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-rose-900 data-[state=active]:shadow-sm"
            >
              <FileEdit className="w-4 h-4 mr-3" />
              Contenido
            </TabsTrigger>

            <TabsTrigger
              value="users"
              className="w-full justify-start rounded-2xl px-4 py-3 text-left text-rose-100/80 hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-rose-900 data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4 mr-3" />
              Usuarios
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="w-full justify-start rounded-2xl px-4 py-3 text-left text-rose-100/80 hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-rose-900 data-[state=active]:shadow-sm"
            >
              <Settings className="w-4 h-4 mr-3" />
              Ajustes
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="w-full justify-start rounded-2xl px-4 py-3 text-left text-rose-100/80 hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-rose-900 data-[state=active]:shadow-sm"
            >
              <Shield className="w-4 h-4 mr-3" />
              Seguridad
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 mt-auto border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-rose-100/80 hover:text-white hover:bg-white/10 rounded-2xl"
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-700 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-rose-900/60 mt-2">
              Administrá SabiduriaFenix desde un solo lugar.
            </p>
          </div>

          {savedMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl flex items-center text-sm font-medium shadow-sm">
              <Check className="w-4 h-4 mr-2" />
              {savedMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <Card className="border-rose-100 bg-white/90 shadow-md rounded-3xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-rose-900/60 text-sm">Usuarios registrados</p>
                <h3 className="text-3xl font-bold text-rose-950 mt-1">
                  {totalUsers}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-100 bg-white/90 shadow-md rounded-3xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-rose-900/60 text-sm">Membresías activas</p>
                <h3 className="text-3xl font-bold text-rose-950 mt-1">
                  {activeMemberships}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <BadgeDollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-100 bg-white/90 shadow-md rounded-3xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-rose-900/60 text-sm">Sala Fénix 2.0</p>
                <h3 className="text-3xl font-bold text-rose-950 mt-1">
                  {fenixProUsers}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <Crown className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-100 bg-white/90 shadow-md rounded-3xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-rose-900/60 text-sm">Videos activos</p>
                <h3 className="text-3xl font-bold text-rose-950 mt-1">
                  {activeVideos}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-rose-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <TabsContent value="videos" className="space-y-6 mt-0">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-md">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-rose-500/80 mb-2">
                Biblioteca
              </p>
              <h2 className="text-2xl font-bold text-rose-950">
                Gestión de Videos
              </h2>
              <p className="text-rose-900/60 text-sm mt-1">
                Total: {videos.length} videos
              </p>
            </div>
            <Button
              onClick={openNewVideo}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo video
            </Button>
          </div>

          {showVideoForm && (
            <Card className="border-rose-200 shadow-lg rounded-3xl overflow-hidden bg-white/95">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-rose-100 via-pink-50 to-white border-b border-rose-100">
                <div>
                  <CardTitle className="text-xl text-rose-950">
                    {editingVideo ? "Editar video" : "Crear nuevo video"}
                  </CardTitle>
                  <CardDescription className="text-rose-900/60">
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
                  className="rounded-full hover:bg-rose-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {videoError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {videoError}
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-950">Título</Label>
                        <Input
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="Módulo 1: Introducción"
                          className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-rose-950">URL del video</Label>
                        <Input
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://youtu.be/... o embed"
                          className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-950">Descripción</Label>
                      <Input
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        placeholder="Breve descripción del contenido"
                        className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-950">
                          Categoría / Módulo
                        </Label>
                        <Input
                          value={videoCategory}
                          onChange={(e) => setVideoCategory(e.target.value)}
                          placeholder="Módulo 1"
                          className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-rose-950">Orden</Label>
                        <Input
                          type="number"
                          value={videoOrder}
                          onChange={(e) => setVideoOrder(e.target.value)}
                          className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-rose-950">Mostrar en sala</Label>

                        <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                          <label className="flex items-center gap-3 text-sm text-rose-900 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={videoMembership === "fenix_pro"}
                              onChange={(e) =>
                                setVideoMembership(
                                  e.target.checked ? "fenix_pro" : ""
                                )
                              }
                              className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-400"
                            />
                            Sala Fénix 2.0
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={handleSaveVideo}
                        disabled={videoSaving}
                        className="bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 rounded-2xl"
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
                        className="rounded-2xl border-rose-200 text-rose-800 hover:bg-rose-50"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-rose-900">
                      <PlayCircle className="w-5 h-5 text-rose-600" />
                      <span className="font-medium">Preview del video</span>
                    </div>

                    <div className="rounded-3xl overflow-hidden border border-rose-200 bg-rose-50 min-h-[260px] flex items-center justify-center">
                      {previewUrl ? (
                        <iframe
                          src={previewUrl}
                          title="Preview del video"
                          className="w-full aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="text-center px-6 text-rose-900/50">
                          Pegá una URL para ver la vista previa acá.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-rose-100 shadow-md rounded-3xl overflow-hidden bg-white/95">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-rose-50 text-rose-900/70 font-medium">
                    <tr>
                      <th className="px-4 py-3">Título</th>
                      <th className="px-4 py-3 hidden md:table-cell">
                        Categoría
                      </th>
                      <th className="px-4 py-3 hidden md:table-cell">
                        Membresía
                      </th>
                      <th className="px-4 py-3 hidden md:table-cell">Vistas</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-right">Orden</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100 bg-white">
                    {videos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-rose-900/50"
                        >
                          No hay videos todavía. Crea el primero.
                        </td>
                      </tr>
                    ) : (
                      videos.map((v, index) => (
                        <tr
                          key={v.id}
                          className="hover:bg-rose-50/60 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-rose-950">
                              {v.title}
                            </span>
                            {v.description && (
                              <p className="text-rose-900/50 text-xs mt-0.5 truncate max-w-xs">
                                {v.description}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-rose-900/60 capitalize">
                            {v.category}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Fénix 2.0
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-rose-900/60">
                            {getLocalViews(v.id)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                v.active
                                  ? "bg-emerald-100 text-emerald-700"
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
                                className="border-rose-200 hover:bg-rose-50"
                                onClick={() => handleMoveVideo(index, "up")}
                                disabled={index === 0}
                                title="Subir"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-rose-200 hover:bg-rose-50"
                                onClick={() => handleMoveVideo(index, "down")}
                                disabled={index === videos.length - 1}
                                title="Bajar"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleToggleVideoActive(v)}
                                title={v.active ? "Desactivar" : "Activar"}
                                className="border-rose-200 hover:bg-rose-50"
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
                                className="border-rose-200 hover:bg-rose-50"
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

        <TabsContent value="content" className="space-y-6 mt-0">
          <Card className="border-rose-100 shadow-md rounded-3xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-rose-950">
                Textos Principales
              </CardTitle>
              <CardDescription className="text-rose-900/60">
                Modifica los textos que aparecen en la página de inicio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-rose-950">Título Hero (Principal)</Label>
                <Input
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="max-w-xl rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-rose-950">Subtítulo Hero</Label>
                <Input
                  value={siteSubtitle}
                  onChange={(e) => setSiteSubtitle(e.target.value)}
                  className="max-w-xl rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-rose-950">
                  Descripción superior de Sala Fénix 2.0
                </Label>
                <textarea
                  value={salaFenixDescription}
                  onChange={(e) => setSalaFenixDescription(e.target.value)}
                  placeholder="Texto corto que aparece arriba de la card de Sala Fénix 2.0"
                  className="w-full max-w-3xl min-h-[120px] rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-rose-950 outline-none focus:ring-2 focus:ring-rose-400"
                />
                <p className="text-xs text-rose-900/50">
                  Este texto corresponde al bloque superior, no a la lista de
                  beneficios.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-rose-950">
                  Ítems / beneficios de Sala Fénix 2.0
                </Label>
                <textarea
                  value={salaFenixItems}
                  onChange={(e) => setSalaFenixItems(e.target.value)}
                  placeholder={`Escribí un beneficio por línea.\nEjemplo:\nMentoría semanal en VIVO con Sofi exclusiva Sala Fénix 2.0\nWhatsApp ilimitado 1:1 conmigo`}
                  className="w-full max-w-3xl min-h-[220px] rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-rose-950 outline-none focus:ring-2 focus:ring-rose-400 whitespace-pre-wrap"
                />
                <p className="text-xs text-rose-900/50">
                  Cada línea se mostrará como un ítem con check en la card de
                  Sala Fénix 2.0.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-100 shadow-md rounded-3xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-rose-950">
                Precio de la Membresía
              </CardTitle>
              <CardDescription className="text-rose-900/60">
                Actualiza el costo y la duración de Sala Fénix 2.0
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-rose-950">
                  Duración Sala Fénix 2.0 (meses)
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={fenixProMonths}
                  onChange={(e) => setFenixProMonths(e.target.value)}
                  placeholder="Ej: 6"
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-rose-950">
                  Precio Sala Fénix 2.0 (USD/{fenixProMonths || "6"} meses)
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={priceFenixPro}
                  onChange={(e) => setPriceFenixPro(e.target.value)}
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="button"
            onClick={handleSaveContent}
            disabled={contentSaving}
            className="bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 rounded-2xl shadow-sm"
          >
            {contentSaving ? "Guardando..." : "Guardar Cambios de Contenido"}
          </Button>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-0">
          <Card className="border-rose-100 shadow-md rounded-3xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-rose-950">
                Gestión de Usuarios
              </CardTitle>
              <CardDescription className="text-rose-900/60">
                Total registrados: {users.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-rose-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-rose-50 text-rose-900/70 font-medium">
                      <tr>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Membresía</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100 bg-white">
                      {users.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-rose-900/50"
                          >
                            No hay usuarios registrados todavía.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-rose-50/60 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-rose-950">
                              {user.email}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                  user.disabled
                                    ? "bg-red-100 text-red-700"
                                    : "bg-emerald-100 text-emerald-700"
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
                                      ? "bg-red-100 text-red-700"
                                      : "bg-zinc-100 text-zinc-500"
                                  }`}
                                >
                                  {user.membershipActive
                                    ? "Sala Fénix 2.0"
                                    : "Sin membresía"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleMembership(user)}
                                  className="text-xs border-rose-200 text-rose-800 hover:bg-rose-50"
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
                                  className="border-rose-200 hover:bg-rose-50"
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

        <TabsContent value="settings" className="space-y-6 mt-0">
          <Card className="border-rose-100 shadow-md rounded-3xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-rose-950">
                Información de Contacto
              </CardTitle>
              <CardDescription className="text-rose-900/60">
                Enlaces y datos del sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label className="text-rose-950">WhatsApp</Label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-rose-950">Instagram (contacto)</Label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@tu.cuenta"
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-rose-950">Email de Soporte</Label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-100 shadow-md rounded-3xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-rose-950">Redes Sociales</CardTitle>
              <CardDescription className="text-rose-900/60">
                Enlaces que aparecen en el pie de página.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label className="text-rose-950">
                  Instagram (URL completa)
                </Label>
                <Input
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  placeholder="https://instagram.com/tu.cuenta"
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-rose-950">TikTok (URL completa)</Label>
                <Input
                  value={socialTiktok}
                  onChange={(e) => setSocialTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@tu.cuenta"
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-rose-950">
                  Canal de YouTube (URL completa)
                </Label>
                <Input
                  value={socialYoutube}
                  onChange={(e) => setSocialYoutube(e.target.value)}
                  placeholder="https://youtube.com/@tu.canal"
                  className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-100 shadow-md rounded-3xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-rose-950">Links de Pago</CardTitle>
              <CardDescription className="text-rose-900/60">
                Configurá las opciones de pago de Sala Fénix 2.0
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 max-w-2xl">
              <div className="space-y-4 rounded-2xl border border-rose-100 p-5 bg-rose-50/40">
                <h4 className="text-lg font-semibold text-rose-950">
                  Sala Fénix 2.0
                </h4>

                <div className="space-y-2">
                  <Label className="text-rose-950">PayPal</Label>
                  <Input
                    value={payLinkFenixProPaypal}
                    onChange={(e) => setPayLinkFenixProPaypal(e.target.value)}
                    placeholder="https://www.paypal.com/..."
                    className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-rose-950">
                    Instagram / otro medio
                  </Label>
                  <Input
                    value={payLinkFenixProInstagram}
                    onChange={(e) =>
                      setPayLinkFenixProInstagram(e.target.value)
                    }
                    placeholder="https://instagram.com/..."
                    className="rounded-xl border-rose-200 focus-visible:ring-rose-400"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                className="bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 mt-2 rounded-2xl shadow-sm"
              >
                {settingsSaving ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-0">
          <Card className="border-red-200 shadow-md rounded-3xl bg-white/95">
            <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 rounded-t-3xl">
              <CardTitle className="text-red-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Seguridad de la Cuenta
              </CardTitle>
              <CardDescription className="text-red-900/70">
                Cambiá la contraseña de acceso al panel de administrador
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 max-w-md">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-rose-950">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pr-10 rounded-xl border-rose-200 focus-visible:ring-rose-400"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-rose-500 hover:text-rose-700 transition-colors"
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
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                >
                  Actualizar Contraseña
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </main>
    </Tabs>
  );
}
