import React, { useState } from "react";
import { Trophy, User, ShieldCheck } from "lucide-react";

type Role = "mahasiswa" | "admin";

interface LoginPayload {
  role: Role;
  name?: string;
  email?: string;
  prodi?: string;
  phone?: string;
}

interface LoginPageProps {
  onLogin: (payload: LoginPayload) => void;
}

function initialsFromName(name?: string) {
  if (!name) return "--";
  return name
    .split(" ")
    .map((p) => p[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prodi, setProdi] = useState("");
  const [phone, setPhone] = useState("");
  const isValid = name.trim() !== "" && email.trim() !== "";

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-border">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Masuk ke LombaKu
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Masukkan data singkat Anda sebelum memilih peran.
          </p>
        </div>

        <div className="space-y-4 mb-4">
          <label className="text-sm text-muted-foreground">Nama</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none"
          />

          <label className="text-sm text-muted-foreground">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@contoh.com"
            className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none"
          />

          <label className="text-sm text-muted-foreground">Prodi</label>
          <input
            value={prodi}
            onChange={(e) => setProdi(e.target.value)}
            placeholder="Contoh: Informatika"
            className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none"
          />

          <label className="text-sm text-muted-foreground">
            Kontak / Telepon
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+62 8xx-xxxx-xxxx"
            className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none"
          />
        </div>

        <div className="space-y-3">
          <button
            disabled={!isValid}
            onClick={() =>
              onLogin({
                role: "mahasiswa",
                name: name || undefined,
                email: email || undefined,
                prodi: prodi || undefined,
                phone: phone || undefined,
              })
            }
            className={`w-full flex items-center gap-4 p-4 border border-border rounded-xl transition-all ${isValid ? "hover:border-primary hover:bg-secondary" : "opacity-50 cursor-not-allowed"}`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground">
                Login sebagai Mahasiswa
              </div>
              <div className="text-xs text-muted-foreground">
                Cari tim, kalender lomba, & ajukan lomba
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {initialsFromName(name)}
            </div>
          </button>

          <button
            disabled={!isValid}
            onClick={() =>
              onLogin({
                role: "admin",
                name: name || undefined,
                email: email || undefined,
                prodi: prodi || undefined,
                phone: phone || undefined,
              })
            }
            className={`w-full flex items-center gap-4 p-4 border border-border rounded-xl transition-all ${isValid ? "hover:border-primary hover:bg-secondary" : "opacity-50 cursor-not-allowed"}`}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground">
                Login sebagai Admin
              </div>
              <div className="text-xs text-muted-foreground">
                Kelola pengajuan lomba & operasional
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {initialsFromName(name)}
            </div>
          </button>
        </div>
        {!isValid && (
          <p className="mt-3 text-xs text-amber-600">
            Isi Nama dan Email terlebih dahulu untuk bisa login.
          </p>
        )}
      </div>
    </div>
  );
}
