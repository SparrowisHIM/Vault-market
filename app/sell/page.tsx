import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Camera,
  Check,
  ClipboardCheck,
  LockKeyhole,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";

export const metadata: Metadata = {
  title: "Sell",
  description: "Preview trusted seller intake for graded trading cards on VaultMarket.",
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

const intakeSteps = [
  {
    label: "Identify slab",
    detail: "Grader, grade, cert number, title, set, year, and card number.",
    icon: BadgeCheck,
  },
  {
    label: "Photo review",
    detail: "Front, back, label, corners, surface, and slab condition images.",
    icon: Camera,
  },
  {
    label: "Desk routing",
    detail: "Choose fixed price, auction candidate, or vault-first review.",
    icon: ClipboardCheck,
  },
  {
    label: "Custody path",
    detail: "Seller-held listing now, or ship to vault before going live.",
    icon: Truck,
  },
];

const acceptedGraders = ["PSA", "BGS", "CGC", "SGC"];
const deferredItems = [
  "Account verification",
  "Image uploads",
  "Storage buckets",
  "Consignment agreements",
  "Payout rails",
];

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
        className="mt-2 h-11 w-full rounded-[6px] border border-[var(--border-soft)] bg-white/45 px-3 text-sm font-semibold text-vault-ink outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      />
      {help ? (
        <p id={helpId} className="mt-1 text-xs leading-5 text-vault-steel">
          {help}
        </p>
      ) : null}
    </div>
  );
}

function DisabledSubmit() {
  return (
    <button
      type="button"
      aria-disabled="true"
      aria-describedby="sell-submit-note"
      title="Submissions will be enabled after authentication, uploads, and backend review queues are ready."
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-[var(--border-soft)] bg-white/34 px-4 text-sm font-semibold text-vault-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
    >
      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      Submit later
    </button>
  );
}

export default function SellPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="grid gap-4 border-b border-[var(--border-soft)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
              VaultMarket / Seller intake
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-vault-ink sm:text-4xl">
              A submission desk for serious graded-card sellers
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-steel sm:text-base">
              A preview of how trusted sellers will prepare high-value slabs for
              marketplace, auction, or vault-first review without opening live submission yet.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/vault"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Review vault desk
            </Link>
            <DisabledSubmit />
          </div>
        </header>

        <section
          aria-label="Seller intake summary"
          className="grid gap-3 md:grid-cols-3"
        >
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <BriefcaseBusiness className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Seller-held examples
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">
              {sellerHeldListings.length}
            </p>
          </div>
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <Boxes className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Intake pending
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">
              {intakePendingListings.length}
            </p>
          </div>
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <ShieldCheck className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Eligible value
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">
              {formatCurrency(vaultEligibleValue)}
            </p>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <aside className="grid gap-5 self-start">
            <section className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                Intake path
              </h2>
              <p className="mt-1 text-sm leading-6 text-vault-steel">
                This is the review flow we are shaping before connecting auth, uploads,
                and staff queues.
              </p>
              <ol className="mt-4 grid gap-3">
                {intakeSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <li
                      key={step.label}
                      className="grid grid-cols-[auto_1fr] gap-3 rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/48 text-vault-registry">
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

            <section className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                Current intake rules
              </h2>
              <ul className="mt-4 grid gap-2 text-sm text-vault-steel">
                <li className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3">
                  Graded trading cards only for v1.
                </li>
                <li className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3">
                  Accepted graders: {acceptedGraders.join(", ")}.
                </li>
                <li className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3">
                  High-value lots can route to marketplace, auction, or vault review.
                </li>
              </ul>
            </section>
          </aside>

          <section className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 border-b border-[var(--border-soft)] pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                  Submission preview
                </h2>
                <p className="mt-1 text-sm leading-6 text-vault-steel">
                  Read-only example fields for the eventual seller intake form.
                </p>
              </div>
              <span className="w-fit rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                Preview only
              </span>
            </div>

            <form className="mt-4 grid gap-5" aria-describedby="sell-submit-note">
              <fieldset className="grid gap-3 md:grid-cols-2">
                <legend className="sr-only">Card identity</legend>
                <Field id="card-title" label="Card title" value="1999 Pokemon Charizard Holo" />
                <Field id="card-set" label="Set and number" value="Base Set Unlimited / 4/102" />
                <Field id="grader" label="Grader" value="PSA" />
                <Field id="grade" label="Grade" value="9" />
                <Field
                  id="cert-number"
                  label="Cert number"
                  value="812849337"
                  help="Cert lookup will be connected later."
                />
                <Field
                  id="route"
                  label="Preferred route"
                  value="Vault review, then marketplace"
                />
              </fieldset>

              <div>
                <p className="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Required photo set
                </p>
                <ul className="mt-3 grid gap-3 md:grid-cols-3">
                  {["Front", "Back", "Label", "Corners", "Surface", "Slab edges"].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3 text-sm font-semibold text-vault-graphite"
                    >
                      <span className="grid h-4 w-4 place-items-center rounded-[4px] border border-[rgba(47,113,88,0.34)] bg-[rgba(47,113,88,0.1)] text-[#235844]">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-4">
                <h3 className="text-sm font-semibold text-vault-ink">Deferred before launch</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {deferredItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-vault-steel">
                      <LockKeyhole className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--border-soft)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p id="sell-submit-note" className="text-sm leading-6 text-vault-steel">
                  This form does not submit yet. We will enable it after authentication,
                  image storage, and review queues are built.
                </p>
                <DisabledSubmit />
              </div>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}
