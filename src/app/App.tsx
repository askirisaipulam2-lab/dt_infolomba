import { useState } from "react";
import {
  Trophy,
  CalendarDays,
  Users,
  PlusCircle,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  LayoutDashboard, // Import ikon baru untuk dashboard mahasiswa
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from "./components/ui/dialog";
import { HomePage } from "./components/HomePage";
import { CalendarPage } from "./components/CalendarPage";
import { DetailPage } from "./components/DetailPage";
import { TeamFinderPage } from "./components/TeamFinderPage";
import { SubmitPage } from "./components/SubmitPage";
import { AdminPage } from "./components/AdminPage";
import {
  Competition,
  competitions as initialCompetitions,
} from "./components/data";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import { NotificationPage } from "./components/NotificationPage";

// IMPORT HALAMAN BARU YANG TELAH KITA BUAT
import { RegisterPage } from "./components/RegisterPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { DashboardPage } from "./components/DashboardPage"; // Pastikan file DashboardPage.tsx sudah dibuat

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  type: "info" | "success" | "warning";
  read: boolean;
}

// 1. TAMBAHKAN "dashboard" KE DALAM TIPE PAGE
type Page = "home" | "calendar" | "team" | "submit" | "admin" | "detail" | "dashboard";
type Role = "mahasiswa" | "admin";

interface UserState {
  role: Role;
  name: string;
  initials: string;
  description: string;
  email?: string;
  prodi?: string;
  phone?: string;
}

// 2. TAMBAHKAN MENU DASHBOARD KHUSUS MAHASISWA KE NAVIGASI
const ALL_NAV_ITEMS = [
  { id: "home", label: "Beranda", icon: Trophy, roles: ["mahasiswa", "admin"] },
  {
    id: "calendar",
    label: "Kalender",
    icon: CalendarDays,
    roles: ["mahasiswa", "admin"],
  },
  { id: "team", label: "Cari Tim", icon: Users, roles: ["mahasiswa"] },
  {
    id: "dashboard",
    label: "Status SKPI",
    icon: LayoutDashboard,
    roles: ["mahasiswa"],
  },
  {
    id: "submit",
    label: "Ajukan Lomba",
    icon: PlusCircle,
    roles: ["mahasiswa"],
  },
  {
    id: "submit",
    label: "Tambahkan Lomba",
    icon: PlusCircle,
    roles: ["admin"],
  },
  { id: "admin", label: "Admin Panel", icon: ShieldCheck, roles: ["admin"] },
] as const;

export default function App() {
  const [user, setUser] = useState<UserState | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  
  // STATE BARU: Untuk melacak sub-halaman auth ('login' | 'register' | 'forgot')
  const [authScreen, setAuthScreen] = useState<"login" | "register" | "forgot">("login");

  const [showNotifications, setShowNotifications] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [competitionsList, setCompetitionsList] =
    useState<Competition[]>(initialCompetitions);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Lomba Baru Ditambahkan",
      message:
        "Hackathon 2024 - Coding Competition telah ditambahkan ke platform.",
      timestamp: new Date(Date.now() - 3600000),
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "Deadline Mendekati",
      message:
        "Ajuan Anda untuk UI/UX Design Contest akan ditutup dalam 2 days.",
      timestamp: new Date(Date.now() - 7200000),
      type: "warning",
      read: false,
    },
    {
      id: 3,
      title: "Pendaftaran Tim Diterima",
      message:
        "Tim Anda telah diterima untuk mengikuti lomba 'Web Development Challenge'.",
      timestamp: new Date(Date.now() - 86400000),
      type: "success",
      read: true,
    },
  ]);

  const addCompetition = (
    newComp: Omit<Competition, "id" | "savedByUser" | "popular">,
  ) => {
    setCompetitionsList((prev) => [
      {
        ...newComp,
        id: Date.now(),
        savedByUser: false,
        popular: false,
      },
      ...prev,
    ]);
  };

  const handleLogin = (payload: {
    role: Role;
    name?: string;
    email?: string;
    prodi?: string;
    phone?: string;
  }) => {
    const name =
      payload.name ?? (payload.role === "admin" ? "Admin Portal" : "Ahmad K.");
    const initials = name
      .split(" ")
      .map((p) => p[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const description =
      payload.role === "admin" ? "Administrator" : "Informatika – UB";
    const email =
      payload.email ??
      (payload.role === "admin"
        ? "admin@lombaku.local"
        : "ahmad.k@example.com");
    const prodi =
      payload.prodi ?? (payload.role === "admin" ? "-" : "Informatika");
    const phone =
      payload.phone ?? (payload.role === "admin" ? "-" : "+62 812-3456-7890");

    setUser({
      role: payload.role,
      name,
      initials,
      description,
      email,
      prodi,
      phone,
    });
    setCurrentPage(payload.role === "admin" ? "admin" : "home");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
    setSelectedComp(null);
    setAuthScreen("login"); // Kembalikan default ke menu login saat logout
  };

  // BAGIAN CUSTOM ROUTING AUTENTIKASI KETIKA DATA USER BELUM ADA
  if (!user) {
    if (!showLogin) {
      return <LandingPage onStart={() => setShowLogin(true)} />;
    }

    // Navigasi Alur Halaman Autentikasi secara dinamis
    if (authScreen === "register") {
      return <RegisterPage onSwitchToLogin={() => setAuthScreen("login")} />;
    }

    if (authScreen === "forgot") {
      return <ForgotPasswordPage onSwitchToLogin={() => setAuthScreen("login")} />;
    }

    // Default menampilkan LoginPage dengan props navigasi tambahan
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setAuthScreen("register")}
        onSwitchToForgot={() => setAuthScreen("forgot")}
      />
    );
  }

  const navigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== "detail") setSelectedComp(null);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetail = (c: Competition) => {
    setSelectedComp(c);
    setCurrentPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isNavActive = (id: string) =>
    currentPage === id || (currentPage === "detail" && id === "home");

  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) =>
    (item.roles as readonly Role[]).includes(user.role),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <button
              onClick={() => navigate(user.role === "admin" ? "admin" : "home")}
              className="flex items-center gap-2.5 flex-none"
            >
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-foreground">LombaKu</span>
                <span className="text-xs text-muted-foreground block -mt-1">
                  {user.role === "admin"
                    ? "Admin Portal"
                    : "Platform Kompetisi Mahasiswa"}
                </span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 mx-auto">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => navigate(id as Page)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isNavActive(id)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 ml-auto">
              {user.role === "mahasiswa" && (
                <>
                  <button className="hidden md:flex w-9 h-9 rounded-xl border border-border items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="relative w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center"
                        style={{ fontSize: "9px" }}
                      >
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>
                </>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hidden md:flex items-center gap-2 pl-2 border-l border-border">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user.initials}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-foreground leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.description}
                      </p>
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                        {user.initials}
                      </div>
                      <div>
                        <DialogTitle>{user.name}</DialogTitle>
                        <DialogDescription>
                          {user.description}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="mt-4 space-y-3">
                    <p className="text-sm">
                      <strong>Role:</strong> {user.role}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {user.email ?? "-"}
                    </p>
                    <p className="text-sm">
                      <strong>Prodi:</strong> {user.prodi ?? "-"}
                    </p>
                    <p className="text-sm">
                      <strong>Kontak:</strong> {user.phone ?? "-"}
                    </p>
                    <p className="text-sm">
                      Berikut ringkasan profil singkat Anda.
                    </p>
                  </div>

                  <DialogFooter>
                    <div className="w-full flex justify-between">
                      <DialogClose>
                        <button className="px-3 py-2 rounded-lg bg-secondary">
                          Tutup
                        </button>
                      </DialogClose>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 rounded-lg bg-red-500 text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <button
                onClick={handleLogout}
                className="hidden md:flex w-9 h-9 rounded-xl border border-border items-center justify-center text-red-500 hover:bg-red-50 transition-colors ml-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground"
              >
                {mobileOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => navigate(id as Page)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all ${isNavActive(id) ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border mt-2 pt-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user.initials}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.description}
                      </p>
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                        {user.initials}
                      </div>
                      <div>
                        <DialogTitle>{user.name}</DialogTitle>
                        <DialogDescription>
                          {user.description}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="mt-4 space-y-3">
                    <p className="text-sm">
                      <strong>Role:</strong> {user.role}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {user.email ?? "-"}
                    </p>
                    <p className="text-sm">
                      <strong>Prodi:</strong> {user.prodi ?? "-"}
                    </p>
                    <p className="text-sm">
                      <strong>Kontak:</strong> {user.phone ?? "-"}
                    </p>
                    <p className="text-sm">
                      Berikut ringkasan profil singkat Anda.
                    </p>
                  </div>

                  <DialogFooter>
                    <div className="w-full flex justify-between">
                      <DialogClose>
                        <button className="px-3 py-2 rounded-lg bg-secondary">
                          Tutup
                        </button>
                      </DialogClose>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 rounded-lg bg-red-500 text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main>
        {currentPage === "home" && (
          <HomePage
            competitions={competitionsList}
            onCompetitionClick={openDetail}
          />
        )}
        {currentPage === "calendar" && (
          <CalendarPage
            competitions={competitionsList}
            onCompetitionClick={openDetail}
          />
        )}
        {currentPage === "detail" && selectedComp && (
          <DetailPage
            competition={selectedComp}
            onBack={() => navigate("home")}
          />
        )}
        {currentPage === "team" && <TeamFinderPage />}
        
        {/* 3. RENDER HALAMAN DASHBOARD BARU DI SINI */}
        {currentPage === "dashboard" && (
          <DashboardPage
            studentName={user.name}
            studentProdi={user.prodi ?? "Informatika"}
            onBackToHome={() => navigate("home")}
            onEditSubmission={(lombaId) => {
              // Arahkan ke halaman submit untuk edit berkas
              navigate("submit");
            }}
          />
        )}

        {currentPage === "submit" && (
          <SubmitPage userRole={user.role} onAddCompetition={addCompetition} />
        )}
        {currentPage === "admin" && <AdminPage />}
      </main>

      {/* Notification Page */}
      {showNotifications && (
        <NotificationPage
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAsRead={(id) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
            );
          }}
        />
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-2 pb-2 z-40">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = isNavActive(id);
            return (
              <button
                key={id}
                onClick={() => navigate(id as Page)}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="w-5 h-5" />
                <span
                  style={{ fontSize: "10px" }}
                  className={active ? "font-medium" : ""}
                >
                  {label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </div>
  );
}