import { useState } from "react";
import { X, Upload, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Competition } from "./data";

type Props = {
  competition: Competition;
  onClose: () => void;
  onSubmit: (formData: RegistrationData) => void;
};

export type RegistrationData = {
  competitionId: number;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderProdi?: string;
  leaderNpm?: string;
  members: {
    name: string;
    email: string;
    prodi: string;
    npm?: string;
  }[];
  fileLink?: string;
  additionalInfo?: string;
  submittedAt?: string;
};

export function RegistrationForm({ competition, onClose, onSubmit }: Props) {
  const isIndividual = competition.participants === "Individu";

  const maxMembers = isIndividual
    ? 1
    : competition.participants.includes("5")
      ? 5
      : competition.participants.includes("4")
        ? 4
        : competition.participants.includes("3")
          ? 3
          : competition.participants.includes("2")
            ? 2
            : 1;

  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderProdi, setLeaderProdi] = useState("");
  const [leaderNpm, setLeaderNpm] = useState("");
  const [members, setMembers] = useState<
    { name: string; email: string; prodi: string; npm?: string }[]
  >([]);
  const [fileLink, setFileLink] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(
    null,
  );

  const getRequiredFields = () => {
    if (isIndividual) {
      return [
        { key: "leaderName", label: "Nama Lengkap", value: leaderName },
        { key: "leaderEmail", label: "Email", value: leaderEmail },
        { key: "leaderPhone", label: "No. HP", value: leaderPhone },
        { key: "leaderProdi", label: "Program Studi", value: leaderProdi },
      ];
    } else {
      return [
        { key: "teamName", label: "Nama Tim", value: teamName },
        { key: "leaderName", label: "Nama Ketua", value: leaderName },
        { key: "leaderEmail", label: "Email Ketua", value: leaderEmail },
        { key: "leaderPhone", label: "No. HP Ketua", value: leaderPhone },
      ];
    }
  };

  const handleAddMember = () => {
    if (members.length < maxMembers - 1) {
      setMembers([...members, { name: "", email: "", prodi: "", npm: "" }]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = getRequiredFields();

    // Check required fields
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        newErrors[field.key] = `${field.label} wajib diisi`;
      }
    });

    // Validate email
    if (leaderEmail && !leaderEmail.includes("@")) {
      newErrors.leaderEmail = "Email tidak valid";
    }

    // For teams, check team size
    if (!isIndividual) {
      const totalMembers = 1 + members.filter((m) => m.name.trim()).length;
      const minMembers = maxMembers > 1 ? 2 : 1;
      if (totalMembers < minMembers) {
        newErrors.members = `Minimal ${minMembers} anggota tim (termasuk ketua)`;
      }

      // Validate member data
      members.forEach((member, idx) => {
        if (member.name.trim()) {
          if (!member.email.includes("@")) {
            newErrors[`member${idx}Email`] = "Email tidak valid";
          }
          if (!member.prodi.trim()) {
            newErrors[`member${idx}Prodi`] = "Prodi wajib diisi";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call to register with organizer
      setTimeout(() => {
        const registrationData: RegistrationData = {
          competitionId: competition.id,
          teamName: isIndividual ? leaderName : teamName,
          leaderName,
          leaderEmail,
          leaderPhone,
          leaderProdi: leaderProdi || undefined,
          leaderNpm: leaderNpm || undefined,
          members: members.filter((m) => m.name.trim()),
          fileLink: fileLink || undefined,
          additionalInfo: additionalInfo || undefined,
          submittedAt: new Date().toLocaleString("id-ID"),
        };

        setSubmittedData(registrationData);
        setSubmitSuccess(true);
        setIsSubmitting(false);

        // Call the parent handler
        onSubmit(registrationData);
      }, 1500);
    }
  };

  // Success Screen
  if (submitSuccess && submittedData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Pendaftaran Berhasil
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse" />
                <div className="relative w-full h-full flex items-center justify-center bg-emerald-500 rounded-full">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Data Anda Berhasil Didaftar
              </h3>
              <p className="text-muted-foreground">
                Pendaftaran untuk kompetisi {competition.title} telah dikirimkan
                ke penyelenggara
              </p>
            </div>

            {/* Confirmation Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Nomor Pendaftaran
                  </p>
                  <p className="text-xs text-blue-700 font-mono">
                    REG-{competition.id}-{Date.now()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    {isIndividual ? "Nama Peserta" : "Nama Tim"}
                  </p>
                  <p className="text-xs text-blue-700">
                    {submittedData.teamName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Email Terdaftar
                  </p>
                  <p className="text-xs text-blue-700">
                    {submittedData.leaderEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Waktu Pendaftaran
                  </p>
                  <p className="text-xs text-blue-700">
                    {submittedData.submittedAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Apa selanjutnya?</p>
                <p className="mt-1">
                  Panitia akan menghubungi Anda melalui email atau nomor HP yang
                  terdaftar untuk konfirmasi dan informasi lebih lanjut.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Daftar: {competition.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Batas pendaftaran:{" "}
              {new Date(competition.deadline).toLocaleDateString("id-ID")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">
                {isIndividual ? "Pendaftaran Individu" : "Informasi Tim"}
              </p>
              <p>
                {isIndividual
                  ? "Isi data diri Anda dengan akurat untuk mengikuti kompetisi ini."
                  : `Pendaftaran untuk tim ${maxMembers} orang. Sertakan data semua anggota tim dengan akurat.`}
              </p>
            </div>
          </div>

          {/* Team Name (Only for Teams) */}
          {!isIndividual && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Data Tim</h3>
              <input
                type="text"
                placeholder="Nama Tim"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.teamName && (
                <p className="text-xs text-red-600">{errors.teamName}</p>
              )}
            </div>
          )}

          {/* Participant/Leader Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {isIndividual ? "Data Diri" : "Data Ketua Tim"}
            </h3>
            <input
              type="text"
              placeholder={isIndividual ? "Nama Lengkap" : "Nama Ketua Tim"}
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.leaderName && (
              <p className="text-xs text-red-600">{errors.leaderName}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={leaderEmail}
              onChange={(e) => setLeaderEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.leaderEmail && (
              <p className="text-xs text-red-600">{errors.leaderEmail}</p>
            )}

            <input
              type="tel"
              placeholder="Nomor HP (Contoh: 08123456789)"
              value={leaderPhone}
              onChange={(e) => setLeaderPhone(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.leaderPhone && (
              <p className="text-xs text-red-600">{errors.leaderPhone}</p>
            )}

            <input
              type="text"
              placeholder="Program Studi"
              value={leaderProdi}
              onChange={(e) => setLeaderProdi(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.leaderProdi && (
              <p className="text-xs text-red-600">{errors.leaderProdi}</p>
            )}

            <input
              type="text"
              placeholder="NPM / Nomor Induk Mahasiswa (Opsional)"
              value={leaderNpm}
              onChange={(e) => setLeaderNpm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Team Members (Only for Teams) */}
          {!isIndividual && maxMembers > 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Anggota Tim</h3>
                {members.filter((m) => m.name.trim()).length <
                  maxMembers - 1 && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="text-sm text-primary hover:underline"
                  >
                    + Tambah Anggota
                  </button>
                )}
              </div>

              {errors.members && (
                <p className="text-xs text-red-600">{errors.members}</p>
              )}

              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border/50 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    className="absolute top-3 right-3 p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>

                  <p className="text-sm font-medium text-muted-foreground">
                    Anggota {idx + 2}
                  </p>

                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={member.name}
                    onChange={(e) =>
                      handleMemberChange(idx, "name", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) =>
                      handleMemberChange(idx, "email", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors[`member${idx}Email`] && (
                    <p className="text-xs text-red-600">
                      {errors[`member${idx}Email`]}
                    </p>
                  )}

                  <input
                    type="text"
                    placeholder="Program Studi"
                    value={member.prodi}
                    onChange={(e) =>
                      handleMemberChange(idx, "prodi", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors[`member${idx}Prodi`] && (
                    <p className="text-xs text-red-600">
                      {errors[`member${idx}Prodi`]}
                    </p>
                  )}

                  <input
                    type="text"
                    placeholder="NPM / Nomor Induk Mahasiswa (Opsional)"
                    value={member.npm || ""}
                    onChange={(e) =>
                      handleMemberChange(idx, "npm", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
            </div>
          )}

          {/* File Upload / Link */}
          {["Mobile", "UI/UX", "Desain", "Karya"].some((tag) =>
            competition.tags.includes(tag),
          ) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                File Karya (Opsional)
              </h3>
              <p className="text-sm text-muted-foreground">
                Sertakan link Google Drive, GitHub, Figma, atau portfolio Anda
              </p>
              <input
                type="url"
                placeholder="Link karya atau portfolio"
                value={fileLink}
                onChange={(e) => setFileLink(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              Informasi Tambahan (Opsional)
            </h3>
            <textarea
              placeholder="Catatan atau pertanyaan khusus..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
