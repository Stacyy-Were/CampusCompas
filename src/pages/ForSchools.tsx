import { useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

const TYPES = [
  "Pre-Primary School",
  "Junior Secondary School (JSS)",
  "Senior Secondary School (SSS)",
  "Home Schooling Program",
  "Special Needs School",
  "Adult Education Center",
  "Online School",
  "University",
  "Law School",
  "College",
  "TVET Institution",
  "Technical Institute",
  "Community College",
  "Vocational Training Center",
  "Language School",
  "Art School",
  "Music School",
  "Sports Academy",
  "Montessori School",
  "Charter School",
  "Polytechnic Institute",
];
const FACILITIES = ["Hostel", "Library", "Sports", "Wifi", "Cafeteria", "Laboratory"];

export default function ForSchools() {
  const [form, setForm] = useState({
    name: "",
    contactEmail: "",
    password: "",
    type: "University",
    county: "",
    location: "",
    feeMin: "",
    feeMax: "",
    description: "",
  });
  const [facilities, setFacilities] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [feeStructureFile, setFeeStructureFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feeStatus, setFeeStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [feeMessage, setFeeMessage] = useState("");
  const [schoolId, setSchoolId] = useState<string | null>(null);

  const toggleFacility = (f: string) => {
    setFacilities((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!supabase) {
      setStatus("error");
      setMessage("Supabase is not configured yet.");
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.contactEmail,
      password: form.password,
    });

    if (signUpError || !signUpData.user) {
      setStatus("error");
      setMessage(signUpError?.message ?? "Could not create account.");
      return;
    }

    let licensePath: string | null = null;
    if (file) {
      const path = `${signUpData.user.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("licenses")
        .upload(path, file, { upsert: true });
      if (!uploadError) licensePath = path;
    }

    const { data: insertedSchool, error: insertError } = await supabase
      .from("schools")
      .insert({
        owner_id: signUpData.user.id,
        name: form.name,
        contact_email: form.contactEmail,
        type: form.type,
        county: form.county,
        location: form.location,
        fee_min: Number(form.feeMin) || 0,
        fee_max: Number(form.feeMax) || 0,
        facilities,
        description: form.description,
        license_file_path: licensePath,
        fee_structure_file_path: null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      setStatus("error");
      setMessage(insertError.message);
      return;
    }

    setSchoolId(insertedSchool?.id ?? null);
    setStatus("done");
    setMessage("Submitted. We'll review your license and notify you once verified. After approval, you can upload your fee structure here.");
  };

  const handleFeeStructureUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeeStatus("loading");
    setFeeMessage("");

    if (!supabase) {
      setFeeStatus("error");
      setFeeMessage("Supabase is not configured yet.");
      return;
    }

    if (!feeStructureFile) {
      setFeeStatus("error");
      setFeeMessage("Please select a fee structure document.");
      return;
    }

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      setFeeStatus("error");
      setFeeMessage("You need to be logged in to upload a fee structure.");
      return;
    }

    const path = `${userId}/fee-structure-${Date.now()}-${feeStructureFile.name}`;
    const { error: uploadError } = await supabase.storage.from("fee-structures").upload(path, feeStructureFile, {
      upsert: true,
    });

    if (uploadError) {
      setFeeStatus("error");
      setFeeMessage(uploadError.message);
      return;
    }

    const targetSchoolId = schoolId ?? (await supabase.from("schools").select("id").eq("owner_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle()).data?.id;

    if (!targetSchoolId) {
      setFeeStatus("error");
      setFeeMessage("Your school record could not be found. Please contact support.");
      return;
    }

    const { error: updateError } = await supabase
      .from("schools")
      .update({ fee_structure_file_path: path })
      .eq("id", targetSchoolId);

    if (updateError) {
      setFeeStatus("error");
      setFeeMessage(updateError.message);
      return;
    }

    setFeeStructureFile(null);
    setFeeStatus("done");
    setFeeMessage("Fee structure uploaded successfully.");
  };

  return (
    <main
      className="min-h-screen bg-black px-6 py-24 text-white md:px-16"
      style={{
        backgroundImage: "url('/kazetachinu050.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="pointer-events-none fixed inset-0 bg-black/65" />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-6xl">
        <section className="grid items-center gap-8 pb-12 pt-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-300/80">For schools</p>
            <h1 className="mt-5 max-w-xl font-mono text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
              Grow your school on Campus Compas
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              Register your institution, submit your verification details and showcase your campus once approved.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-mono text-white/70">
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-2">
                Verified listing
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">
                Student-friendly profile
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">
                Campus photo showcase
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/5 p-5 shadow-2xl shadow-emerald-900/20 backdrop-blur-md">
            <div className="rounded-[1.5rem] border border-emerald-300/30 bg-[#0a1b17] p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300/80">
                  Verification flow
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/70">
                  Step 1 of 2
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">1</p>
                  <p className="mt-2 font-mono text-lg text-white">Register your school</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 opacity-80">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">2</p>
                  <p className="mt-2 font-mono text-lg text-white">Upload photos and required documents after approval</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mt-6">
          {status === "done" ? (
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-emerald-300/30 bg-emerald-300/10 p-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">Submission received</p>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{message}</p>
              </div>

              <form onSubmit={handleFeeStructureUpload} className="rounded-[2rem] border border-white/15 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-md md:p-8">
                <div className="mb-4">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/80">Fee structure</p>
                  <h2 className="mt-2 font-mono text-2xl md:text-3xl">Upload fee structure after verification</h2>
                </div>

                <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-4">
                  <label className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                    Fee structure document (PDF or image)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setFeeStructureFile(e.target.files?.[0] ?? null)}
                    className="mt-3 block w-full font-mono text-xs text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-mono file:text-xs file:text-black"
                  />
                </div>

                {feeStatus === "error" && <p className="mt-4 font-mono text-xs text-red-400">{feeMessage}</p>}
                {feeStatus === "done" && <p className="mt-4 font-mono text-xs text-emerald-300">{feeMessage}</p>}

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={feeStatus === "loading"}
                    className="rounded-full bg-white px-6 py-3 font-mono text-sm text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {feeStatus === "loading" ? "Uploading..." : "Upload fee structure"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/15 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-md md:p-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/80">School profile</p>
                  <h2 className="mt-2 font-mono text-2xl md:text-3xl">Add your institution</h2>
                </div>
                <span className="rounded-full border border-white/15 bg-black/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                  secure
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  required
                  placeholder="Institution name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                />

                <div className="relative">
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="block w-full appearance-none rounded-2xl border border-emerald-300/30 bg-[linear-gradient(135deg,#0d291f_0%,#03140f_100%)] px-4 py-3 pr-10 font-mono text-sm text-white shadow-lg shadow-emerald-950/40 outline-none transition duration-200 hover:border-emerald-300/60 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#07130f] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-emerald-300">▾</span>
                </div>

                <input
                  required
                  type="email"
                  placeholder="Contact email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                />

                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                />

                <input
                  required
                  placeholder="County"
                  value={form.county}
                  onChange={(e) => setForm({ ...form, county: e.target.value })}
                  className="block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                />

                <input
                  required
                  placeholder="Location / town"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                />

                <input
                  required
                  type="number"
                  placeholder="Min fee (KES/year)"
                  value={form.feeMin}
                  onChange={(e) => setForm({ ...form, feeMin: e.target.value })}
                  className="block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                />

                <input
                  required
                  type="number"
                  placeholder="Max fee (KES/year)"
                  value={form.feeMax}
                  onChange={(e) => setForm({ ...form, feeMax: e.target.value })}
                  className="block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                />
              </div>

              <div className="mt-6">
                <label className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Facilities</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FACILITIES.map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleFacility(f)}
                      className={`rounded-full border px-3 py-2 font-mono text-xs transition ${
                        facilities.includes(f)
                          ? "border-emerald-300 bg-emerald-300 text-black"
                          : "border-white/15 bg-black/20 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">About your school</label>
                <textarea
                  placeholder="Detailed description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-3 block w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-300/60"
                  rows={4}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-black/20 p-4">
                <label className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                  License document (PDF or image)
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-3 block w-full font-mono text-xs text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-mono file:text-xs file:text-black"
                />
              </div>

              {status === "error" && <p className="mt-4 font-mono text-xs text-red-400">{message}</p>}

              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="max-w-md font-mono text-xs leading-6 text-white/60">
                  We review submissions before your school appears on the platform.
                </p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-white px-6 py-3 font-mono text-sm text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting..." : "Submit for verification"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
