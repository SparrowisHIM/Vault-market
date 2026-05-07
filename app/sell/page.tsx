import type { Metadata } from "next";
import {
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Camera,
  Check,
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";

export const metadata: Metadata = {
  title: "Sell",
  description: "Prepare graded trading cards for trusted seller intake on VaultMarket.",
};

const sellerHeldListings = mockListings.filter(
  (listing) => listing.vaultStatus === "seller_held",
);
const intakePendingListings = mockListings.filter(
  (listing) => listing.vaultStatus === "intake_pending",
);
const vaultEligibleValue = mockListings
  .filter((listing) => listing.verificationStatus !== "pending_review")
  .reduce((total, listing) => total + listing.priceCents, 0);
const leadIntakeAsset =
  intakePendingListings[0] ?? sellerHeldListings[0] ?? mockListings[0];

const intakeSteps = [
  {
    label: "Slab identity",
    detail: "Card title, set, year, grader, grade, and cert number.",
    icon: Fingerprint,
    status: "Aligned",
  },
  {
    label: "Photo checklist",
    detail: "Front, back, label, corners, surface, and slab edge coverage.",
    icon: Camera,
    status: "Ready",
  },
  {
    label: "Cert review",
    detail: "Cert details and visible label signals prepared for review.",
    icon: BadgeCheck,
    status: "Checked",
  },
  {
    label: "Listing route",
    detail: "Marketplace, auction, or vault-first routing selected by desk posture.",
    icon: Route,
    status: "Routed",
  },
  {
    label: "Custody path",
    detail: "Seller-held review or vault intake path shown before listing.",
    icon: Truck,
    status: "Staged",
  },
];

const acceptedGraders = ["PSA", "BGS", "CGC", "SGC"];
const gatedItems = [
  "Collector access clearance",
  "Inspection photo set",
  "Secure asset custody",
  "Consignment terms",
  "Payout profile",
];
const photoChecklist = ["Front", "Back", "Label", "Corners", "Surface", "Slab edges"];
const dossierCompleteness = [
  "6/6 photos staged",
  "Cert ready for review",
  "Custody path selected",
];

function pipelinePercent(index: number) {
  return Math.min(100, Math.max(14, Math.round(((index + 1) / intakeSteps.length) * 100)));
}

function Field({
  id,
  label,
  value,
  help,
}: {
  id: string;
  label: string;
  value: string;
  help?: string;
}) {
  const helpId = `${id}-help`;

  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-vault-steel"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        defaultValue={value}
        readOnly
        aria-describedby={help ? helpId : undefined}
        autoComplete="off"
        className="mt-2 h-11 w-full rounded-[6px] border border-[var(--border-soft)] bg-[rgba(17,19,15,0.045)] px-3 text-sm font-semibold text-vault-ink outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      />
      {help ? (
        <p id={helpId} className="mt-1 text-xs leading-5 text-vault-steel">
          {help}
        </p>
      ) : null}
    </div>
  );
}

function AccessButton({ label = "Seller access required" }: { label?: string }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      aria-describedby="sell-submit-note"
      title="Seller intake requires approved collector access."
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-[var(--border-soft)] bg-white/34 px-4 text-sm font-semibold text-vault-steel transition hover:bg-white/48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
    >
      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  fill,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  detail: string;
  fill: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[10px] border border-[rgba(17,19,15,0.12)] bg-[rgba(249,248,243,0.82)] p-4 shadow-[var(--shadow-slab)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-[rgba(255,254,249,0.92)] hover:shadow-[var(--shadow-slab-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-none text-vault-ink">{value}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/56 text-vault-registry">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.38),rgba(47,113,88,0.52),rgba(166,111,31,0.32))]"
          style={{ width: `${fill}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-5 text-vault-steel">{detail}</p>
    </div>
  );
}

export default function SellPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[12px] border border-[rgba(17,19,15,0.22)] shadow-[0_22px_70px_rgba(17,19,15,0.14)]">
          <div className="sell-intake-console relative overflow-hidden bg-[linear-gradient(135deg,rgba(13,15,12,0.98)_0%,rgba(24,30,26,0.99)_50%,rgba(13,15,12,0.98)_100%)] text-vault-paper">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,233,0.03)_1px,transparent_1px),linear-gradient(rgba(244,241,233,0.024)_1px,transparent_1px)] bg-[length:44px_44px]" />
            <div className="sell-intake-sweep pointer-events-none absolute inset-0" />
            <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.43fr)] lg:items-stretch">
              <div className="grid min-h-[23rem] gap-5 rounded-[10px] border border-white/10 bg-black/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5">
                    <ClipboardCheck className="h-4 w-4 text-[#a7ddc4]" aria-hidden="true" />
                    <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-vault-paper/62">
                      VaultMarket / Seller intake
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(130,199,169,0.22)] bg-[rgba(47,113,88,0.1)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#a7ddc4]">
                    <span className="sell-status-pulse h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                    Dossier staged
                  </span>
                </div>

                <div>
                  <h1 className="max-w-3xl text-3xl font-semibold leading-[1.03] text-vault-paper sm:text-5xl">
                    A guided intake dossier for serious graded-card sellers
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-vault-paper/64 sm:text-[0.95rem]">
                    Trusted sellers prepare high-value slabs for marketplace, auction,
                    or vault-first review through a controlled intake pipeline.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Intake asset
                    </p>
                    <p className="mt-2 truncate text-2xl font-semibold text-vault-paper">
                      {leadIntakeAsset.title}
                    </p>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Eligible value
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatCurrency(vaultEligibleValue)}
                    </p>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Pipeline status
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {intakeSteps.length}/5
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[10px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                      Intake pipeline
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-vault-paper">Guided review path</h2>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-[#a7ddc4]">
                    <FileCheck2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <ol className="grid gap-3">
                  {intakeSteps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <li key={step.label} className="grid grid-cols-[auto_1fr] gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-[#a7ddc4]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-vault-paper">{step.label}</span>
                            <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-vault-paper/44">
                              {step.status}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-vault-paper/48">
                            {step.detail}
                          </span>
                          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                            <span
                              className="sell-progress-flow block h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.55),rgba(130,199,169,0.76),rgba(47,113,88,0.58))]"
                              style={{ width: `${pipelinePercent(index)}%` }}
                            />
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Seller intake summary" className="grid gap-3 md:grid-cols-3">
          <SummaryCard
            icon={BriefcaseBusiness}
            label="Seller-held slabs"
            value={`${sellerHeldListings.length}`}
            detail="Cards currently prepared from seller custody."
            fill={62}
          />
          <SummaryCard
            icon={Boxes}
            label="Intake pending"
            value={`${intakePendingListings.length}`}
            detail="Cards waiting for final desk review."
            fill={38}
          />
          <SummaryCard
            icon={ShieldCheck}
            label="Eligible value"
            value={formatCurrency(vaultEligibleValue)}
            detail="Value tied to cards ready for trusted routing."
            fill={84}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <aside className="grid gap-5 self-start">
            <section className="overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)]">
              <div className="border-b border-[var(--border-soft)] bg-[linear-gradient(90deg,rgba(47,94,124,0.08),rgba(47,113,88,0.04),transparent)] px-4 py-4">
                <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                  Pipeline map
                </p>
                <h2 className="mt-1 text-lg font-semibold text-vault-ink">Intake path</h2>
                <p className="mt-1 text-sm leading-6 text-vault-steel">
                  Inspection-grade review flow for seller access, slab imagery, and staff routing.
                </p>
              </div>
              <ol className="grid gap-2 p-3">
                {intakeSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <li
                      key={step.label}
                      className="grid grid-cols-[auto_1fr] gap-3 rounded-[9px] border border-[var(--border-soft)] bg-white/[0.42] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)]"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/56 text-vault-registry">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold text-vault-ink">
                          {index + 1}. {step.label}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-vault-steel">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold text-vault-ink">Current intake rules</h2>
              <ul className="mt-4 grid gap-2 text-sm text-vault-steel">
                <li className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                  Graded trading cards only for this review flow.
                </li>
                <li className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                  Accepted graders: {acceptedGraders.join(", ")}.
                </li>
                <li className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                  High-value lots can route to marketplace, auction, or vault review.
                </li>
              </ul>
            </section>
          </aside>

          <section className="overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 border-b border-[var(--border-soft)] bg-[linear-gradient(90deg,rgba(47,94,124,0.08),rgba(47,113,88,0.04),transparent)] px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                  Intake dossier
                </p>
                <h2 className="mt-1 text-lg font-semibold text-vault-ink">Seller intake dossier</h2>
                <p className="mt-1 text-sm leading-6 text-vault-steel">
                  Read-only fields for a seller intake review.
                </p>
              </div>
              <span className="w-fit rounded-full border border-[var(--border-soft)] bg-white/50 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                Read-only dossier
              </span>
            </div>

            <form className="grid gap-5 p-4" aria-describedby="sell-submit-note">
              <section className="rounded-[9px] border border-[rgba(47,113,88,0.2)] bg-[linear-gradient(135deg,rgba(47,113,88,0.08),rgba(255,255,255,0.38))] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                      Dossier completeness
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-vault-ink">Ready for intake review</h3>
                  </div>
                  <span className="w-fit rounded-full border border-[rgba(47,113,88,0.24)] bg-[rgba(47,113,88,0.08)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#235844]">
                    Complete dossier
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
                  <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.48),rgba(47,113,88,0.68))]" />
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                  {dossierCompleteness.map((item) => (
                    <li key={item} className="flex items-center gap-2 rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-2.5 text-sm font-semibold text-vault-graphite">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#235844]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <fieldset className="grid gap-3 md:grid-cols-2">
                <legend className="mb-1 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Slab identity
                </legend>
                <Field id="card-title" label="Card title" value="1999 Pokemon Charizard Holo" />
                <Field id="card-set" label="Set and number" value="Base Set Unlimited / 4/102" />
                <Field id="grader" label="Grader" value="PSA" />
                <Field id="grade" label="Grade" value="9" />
                <Field
                  id="cert-number"
                  label="Cert number"
                  value="812849337"
                  help="Cert verification is reviewed during intake."
                />
                <Field
                  id="route"
                  label="Preferred route"
                  value="Vault review, then marketplace"
                />
              </fieldset>

              <section aria-labelledby="photo-checklist-heading" className="rounded-[9px] border border-[var(--border-soft)] bg-white/36 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 id="photo-checklist-heading" className="text-sm font-semibold text-vault-ink">
                      Photo checklist
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-vault-steel">
                      Required views for inspection-grade review.
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-[rgba(47,113,88,0.24)] bg-[rgba(47,113,88,0.08)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#235844]">
                    {photoChecklist.length}/6 staged
                  </span>
                </div>
                <ul className="mt-3 grid gap-3 md:grid-cols-3">
                  {photoChecklist.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3 text-sm font-semibold text-vault-graphite"
                    >
                      <span className="grid h-4 w-4 place-items-center rounded-[4px] border border-[rgba(47,113,88,0.34)] bg-[rgba(47,113,88,0.1)] text-[#235844]">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="routing-heading" className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[9px] border border-[var(--border-soft)] bg-white/36 p-4">
                  <h3 id="routing-heading" className="text-sm font-semibold text-vault-ink">
                    Listing route
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {["Marketplace", "Auction candidate", "Vault-first review"].map((item, index) => (
                      <div key={item} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                        <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-[var(--border-soft)] bg-white/58 font-mono text-[0.58rem] font-semibold text-vault-steel">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-vault-graphite">{item}</span>
                        <Sparkles className="h-3.5 w-3.5 text-vault-registry" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[9px] border border-[var(--border-soft)] bg-white/36 p-4">
                  <h3 className="text-sm font-semibold text-vault-ink">Custody path</h3>
                  <div className="mt-3 grid gap-2">
                    {["Seller-held review", "Vault intake review", "Desk routing"].map((item, index) => (
                      <div key={item} className="grid grid-cols-[auto_1fr] gap-3 rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-vault-registry" />
                        <span>
                          <span className="block text-sm font-semibold text-vault-graphite">{item}</span>
                          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
                            <span
                              className="block h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.45),rgba(47,113,88,0.5))]"
                              style={{ width: `${[42, 68, 92][index]}%` }}
                            />
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section aria-labelledby="requirements-heading" className="rounded-[9px] border border-[var(--border-soft)] bg-white/36 p-4">
                <h3 id="requirements-heading" className="text-sm font-semibold text-vault-ink">
                  Access-gated requirements
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {gatedItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-vault-steel">
                      <LockKeyhole className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="flex flex-col gap-3 rounded-[9px] border border-[rgba(17,19,15,0.18)] bg-[rgba(17,19,15,0.9)] p-4 text-vault-paper sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/50">
                    Submission gate
                  </p>
                  <p id="sell-submit-note" className="mt-1 text-sm leading-6 text-vault-paper/62">
                    Seller intake requires approved collector access. Review covers identity,
                    slab imagery, cert details, and listing route.
                  </p>
                </div>
                <AccessButton />
              </div>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}
