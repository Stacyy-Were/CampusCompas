import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import InstitutionCard from "../components/InstitutionCard";
import { Institution, School } from "../lib/types";

export default function AdminPanel() {
  const [pendingSchools, setPendingSchools] = useState<School[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    if (!supabase) {
      setPendingSchools([]);
      setInstitutions([]);
      setLoading(false);
      return;
    }

    const [{ data: pending }, { data: all }] = await Promise.all([
      supabase
        .from("schools")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase.from("institutions").select("*").order("created_at", { ascending: false }),
    ]);
    setPendingSchools(pending ?? []);
    setInstitutions(all ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (school: School) => {
    if (!supabase) return;

    const { data: institution, error } = await supabase
      .from("institutions")
      .insert({
        name: school.name,
        type: school.type,
        county: school.county,
        location: school.location,
        fee_min: school.fee_min,
        fee_max: school.fee_max,
        facilities: school.facilities,
        description: school.description,
        verified: true,
      })
      .select()
      .single();

    if (!error && institution) {
      await supabase
        .from("schools")
        .update({ status: "approved", institution_id: institution.id })
        .eq("id", school.id);
      load();
    }
  };

  const reject = async (id: string) => {
    if (!supabase) return;
    await supabase.from("schools").update({ status: "rejected" }).eq("id", id);
    load();
  };

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white md:px-16">
      <h1 className="font-mono text-3xl md:text-5xl">Admin Panel</h1>

      <section className="mt-12">
        <h2 className="font-mono text-lg text-white/80">Pending Verifications</h2>
        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="font-mono text-xs text-white/40">Loading...</p>
          ) : pendingSchools.length ? (
            pendingSchools.map((school) => (
              <div
                key={school.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-mono text-sm">{school.name}</p>
                  <p className="font-mono text-xs text-white/50">
                    {school.contact_email} · {school.type} · {school.location}, {school.county}
                  </p>
                  {school.license_file_path && (
                    <p className="mt-1 font-mono text-xs text-white/40">
                      License on file: {school.license_file_path}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(school)}
                    className="rounded-full bg-white px-4 py-2 font-mono text-xs text-black transition hover:scale-105"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(school.id)}
                    className="rounded-full border border-white/30 px-4 py-2 font-mono text-xs text-white transition hover:bg-white/10"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="font-mono text-xs text-white/40">No pending schools.</p>
          )}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-mono text-lg text-white/80">All Institutions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {institutions.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </section>
    </main>
  );
}
