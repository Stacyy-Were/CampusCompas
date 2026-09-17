import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { Institution } from "../lib/types";
import InstitutionCard from "../components/InstitutionCard";
import Navbar from "../components/Navbar";

const TYPES = [
  "University",
  "College",
  "TVET",
  "High School",
  "STEM Academy",
  "International School",
  "Technical Institute",
];

const COUNTY_OPTIONS = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Kajiado",
  "Machakos",
  "Uasin Gishu",
  "Eldoret",
  "Meru",
  "Kakamega",
  "Nyeri",
];

const FACILITIES = [
  "Hostel",
  "Library",
  "Sports",
  "Wifi",
  "Cafeteria",
  "Laboratory",
  "Clinic",
  "Transport",
  "Student Lounge",
  "Career Services",
  "Computer Lab",
  "Accommodation",
];

const QUICK_FILTERS = [
  { label: "Budget ≤ 100k", feeMax: 100000 },
  { label: "Nairobi", county: "Nairobi" },
  { label: "TVET", type: "TVET" },
  { label: "Hostel", facility: "Hostel" },
  { label: "STEM", type: "STEM Academy" },
];

const placeholderInstitutions: Institution[] = [
  {
    id: "placeholder-1",
    name: "Nairobi City University",
    type: "University",
    county: "Nairobi",
    location: "Westlands",
    fee_min: 62000,
    fee_max: 180000,
    facilities: ["Hostel", "Library", "Wifi", "Sports", "Career Services", "Student Lounge"],
    description:
      "A modern urban campus focused on business, technology, and innovation and recognised for its strong industry links, student support and city-centre access.",
    image_url:
      "https://images.unsplash.com/photo-1562771382-9e0d7c7d0f4d?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-01-15T09:00:00.000Z",
  },
  {
    id: "placeholder-2",
    name: "Greenfield Technical Institute",
    type: "TVET",
    county: "Kiambu",
    location: "Thika",
    fee_min: 34000,
    fee_max: 98000,
    facilities: ["Workshop", "Laboratory", "Library", "Hostel", "Transport"],
    description:
      "A practical training-focused institution helping students gain applied skills in engineering, business and technical trades with strong employer pipelines.",
    image_url:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-02-10T09:00:00.000Z",
  },
  {
    id: "placeholder-3",
    name: "Riverview Academy",
    type: "High School",
    county: "Nakuru",
    location: "Nakuru Town",
    fee_min: 45000,
    fee_max: 125000,
    facilities: ["Library", "Sports", "Cafeteria", "Science Lab", "Transport"],
    description:
      "A nurturing school environment with strong academics, extracurricular development and a strong track record in university placement and student leadership.",
    image_url:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-03-08T09:00:00.000Z",
  },
  {
    id: "placeholder-4",
    name: "Stellar STEM Academy",
    type: "STEM Academy",
    county: "Kajiado",
    location: "Kitengela",
    fee_min: 75000,
    fee_max: 210000,
    facilities: ["Computer Lab", "Laboratory", "Research Hub", "Hostel", "Career Services"],
    description:
      "A science and innovation-focused academy built for students pursuing engineering, software, robotics and future-tech careers.",
    image_url:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-04-18T09:00:00.000Z",
  },
  {
    id: "placeholder-5",
    name: "Coastline College",
    type: "College",
    county: "Mombasa",
    location: "Mombasa Island",
    fee_min: 52000,
    fee_max: 140000,
    facilities: ["Library", "Wifi", "Student Lounge", "Accommodation", "Clinic"],
    description:
      "A coastal learning hub with diploma and certificate pathways in business, hospitality and applied sciences designed for practical, local impact.",
    image_url:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-05-11T09:00:00.000Z",
  },
  {
    id: "placeholder-6",
    name: "Lakeview International School",
    type: "International School",
    county: "Kisumu",
    location: "Kisumu Central",
    fee_min: 110000,
    fee_max: 260000,
    facilities: ["Library", "Sports", "Arts Studio", "Hostel", "Transport", "Cafeteria"],
    description:
      "An international-focused school offering a broad curriculum, global exposure and student-centred learning in a dynamic lakeside community.",
    image_url:
      "https://images.unsplash.com/photo-1517486800575-0dd88c060810?auto=format&fit=crop&w=900&q=80",
    verified: true,
    created_at: "2024-06-03T09:00:00.000Z",
  },
];

const matchesFilters = (institution: Institution, filters: Record<string, string | number | string[]>) => {
  const searchTerm = String(filters.searchTerm ?? "").trim().toLowerCase();
  const type = String(filters.type ?? "").trim();
  const county = String(filters.county ?? "").trim();
  const feeMax = Number(filters.feeMax ?? 0);
  const facilityList = Array.isArray(filters.facilities) ? filters.facilities : [];

  if (searchTerm) {
    const haystack = [
      institution.name,
      institution.type,
      institution.location,
      institution.county,
      institution.description ?? "",
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(searchTerm)) {
      return false;
    }
  }

  if (type && institution.type !== type) return false;
  if (county && !institution.county.toLowerCase().includes(county.toLowerCase())) return false;
  if (feeMax > 0 && institution.fee_max > feeMax) return false;
  if (facilityList.length > 0 && !facilityList.every((facility) => institution.facilities.includes(facility))) {
    return false;
  }

  return true;
};

export default function FindInstitution() {
  const [type, setType] = useState("");
  const [county, setCounty] = useState("");
  const [feeMax, setFeeMax] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Institution[]>(placeholderInstitutions);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const loadInitialResults = async () => {
      if (!supabase) {
        setResults(placeholderInstitutions);
        return;
      }

      const { data } = await supabase.from("institutions").select("*").eq("verified", true);
      setResults(data && data.length > 0 ? (data as Institution[]) : placeholderInstitutions);
    };

    void loadInitialResults();
  }, []);

  const toggleFacility = (f: string) => {
    setFacilities((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const resetFilters = () => {
    setType("");
    setCounty("");
    setFeeMax("");
    setFacilities([]);
    setSearchTerm("");
    setResults(placeholderInstitutions);
    setSearched(false);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    const baseResults = supabase
      ? await (async () => {
          let query = supabase.from("institutions").select("*").eq("verified", true);

          if (type) query = query.eq("type", type);
          if (county) query = query.ilike("county", `%${county}%`);
          if (feeMax) query = query.lte("fee_max", Number(feeMax));
          if (facilities.length > 0) query = query.contains("facilities", facilities);

          const { data } = await query;
          return (data as Institution[]) ?? placeholderInstitutions;
        })()
      : placeholderInstitutions;

    const filtered = baseResults.filter((institution) =>
      matchesFilters(institution, {
        searchTerm,
        type,
        county,
        feeMax,
        facilities,
      }),
    );

    setResults(filtered);
    setLoading(false);
  };

  const quickApply = (filter: { label: string; feeMax?: number; county?: string; type?: string; facility?: string }) => {
    if (filter.feeMax) {
      setFeeMax(String(filter.feeMax));
    }
    if (filter.county) {
      setCounty(filter.county);
    }
    if (filter.type) {
      setType(filter.type);
    }
    if (filter.facility) {
      setFacilities((prev) => (prev.includes(filter.facility!) ? prev : [...prev, filter.facility!]));
    }
  };

  return (
    <main className="min-h-screen bg-[#040b09] px-6 py-24 text-white md:px-12 lg:px-16">
      <Navbar />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_35%),linear-gradient(135deg,#07130f_0%,#0a1513_32%,#090d0d_100%)] p-6 md:p-10"
      >
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-300/80">
            Search smarter
          </p>
          <h1 className="mt-4 font-mono text-3xl md:text-5xl">Find the right institution for your future.</h1>
          <p className="mt-4 max-w-xl font-mono text-sm leading-7 text-white/65">
            Compare institutions by level, budget, location and amenities so you can choose a school that matches your goals, lifestyle and long-term plan.
          </p>
        </div>

        <div className="relative mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Verified schools</p>
            <p className="mt-3 font-mono text-3xl text-white">{placeholderInstitutions.length}+</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Counties covered</p>
            <p className="mt-3 font-mono text-3xl text-white">12</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Budget range</p>
            <p className="mt-3 font-mono text-3xl text-white">KES 34k–260k</p>
          </div>
        </div>
      </motion.section>

      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
        onSubmit={handleSearch}
        className="mt-10 rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm md:p-7"
      >
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">Search</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="School, course, area or keyword"
              className="mt-2 block w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/35 outline-none transition focus:border-emerald-300/60"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">Institution type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-emerald-300/60"
            >
              <option value="">Any type</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">County</label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-emerald-300/60"
            >
              <option value="">Any county</option>
              {COUNTY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">Max annual fee</label>
            <input
              type="number"
              value={feeMax}
              onChange={(e) => setFeeMax(e.target.value)}
              placeholder="KES/year"
              className="mt-2 block w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/35 outline-none transition focus:border-emerald-300/60"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">Facilities</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {FACILITIES.map((facility) => (
              <button
                type="button"
                key={facility}
                onClick={() => toggleFacility(facility)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  facilities.includes(facility)
                    ? "border-emerald-300 bg-emerald-300 text-black"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30"
                }`}
              >
                {facility}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => quickApply(filter)}
                className="rounded-full border border-emerald-300/30 bg-emerald-300/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-200 transition hover:border-emerald-300/60"
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="font-mono text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-black transition hover:scale-[1.02]"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </motion.form>

      {(searched || results.length > 0) && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-12"
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">Results</p>
              <h2 className="mt-2 font-mono text-2xl md:text-3xl text-white">
                {results.length} match{results.length === 1 ? "" : "es"}
              </h2>
            </div>
            <p className="font-mono text-xs text-white/50">
              {type || county || feeMax || facilities.length > 0 ? "Filtered for your preferences" : "Showing top matches"}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center">
              <p className="font-mono text-base text-white">No institutions match your current search.</p>
              <p className="mt-2 font-mono text-xs text-white/55">
                Try widening your budget or removing a few filters to discover more options.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((institution) => (
                <motion.div
                  key={institution.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full"
                >
                  <InstitutionCard institution={institution} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}
    </main>
  );
}
