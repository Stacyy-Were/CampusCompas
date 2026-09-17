import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Institution } from "../lib/types";
import InstitutionCard from "../components/InstitutionCard";
import Navbar from "../components/Navbar";

const placeholderInstitutions: Institution[] = [
  {
    id: "placeholder-1",
    name: "Nairobi City University",
    type: "University",
    county: "Nairobi",
    location: "Westlands",
    fee_min: 62000,
    fee_max: 180000,
    facilities: ["Hostel", "Library", "Wifi", "Sports"],
    description:
      "A vibrant urban campus known for business, technology, and innovation-focused programmes designed for modern careers.",
    image_url:
      "https://images.unsplash.com/photo-1562771382-9e0d7c7d0f4d?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-01-15T09:00:00.000Z",
  },
  {
    id: "placeholder-2",
    name: "Greenfield Technical Institute",
    type: "TVET Institution",
    county: "Kiambu",
    location: "Thika",
    fee_min: 34000,
    fee_max: 98000,
    facilities: ["Workshop", "Laboratory", "Library", "Hostel"],
    description:
      "A practical learning hub helping students build industry-ready technical, engineering, and entrepreneurial skills.",
    image_url:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-02-10T09:00:00.000Z",
  },
];

export default function Institutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase) {
        setInstitutions(placeholderInstitutions);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("institutions")
        .select("*")
        .eq("verified", true)
        .order("created_at", { ascending: false });

      setInstitutions(data && data.length > 0 ? data : placeholderInstitutions);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white md:px-16">
      <Navbar />
      <h1 className="font-mono text-3xl md:text-5xl">Institutions</h1>
      <p className="mt-2 max-w-md font-mono text-xs text-white/60">
        Browse every verified institution in the system.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {institutions.map((inst) => (
          <InstitutionCard key={inst.id} institution={inst} />
        ))}
      </div>

      {!loading && institutions.length === 0 && (
        <p className="mt-10 font-mono text-xs text-white/40">No verified institutions yet.</p>
      )}
    </main>
  );
}
