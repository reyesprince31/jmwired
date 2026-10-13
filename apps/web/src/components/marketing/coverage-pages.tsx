"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@jmwired/ui/components/button";
import {
  ArrowRight,
  Building2,
  Clock,
  Compass,
  MapPin,
  Phone,
  Radio,
  Search,
} from "lucide-react";
import { PageIntro, Closing } from "@/components/marketing/marketing-pages";
import {
  coverageAreas,
  branchOffices,
  installationWorkflow,
  type CoverageArea,
} from "@/lib/coverage-data";

export function CoveragePage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expanding" | "survey">("all");

  const filteredAreas = useMemo(() => {
    return coverageAreas.filter((area: CoverageArea) => {
      const matchesStatus = statusFilter === "all" || area.status === statusFilter;
      const q = query.trim().toLowerCase();
      if (!q) return matchesStatus;

      const matchesSearch =
        area.name.toLowerCase().includes(q) ||
        area.municipality.toLowerCase().includes(q) ||
        area.streets.some((street) => street.toLowerCase().includes(q)) ||
        area.notes.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [query, statusFilter]);

  return (
    <>
      <PageIntro
        title="Connected where you live."
        description="Check if high-speed fiber is active in your barangay, locate your local branch office, or express interest for upcoming expansions."
      >
        <Button
          variant="outline"
          size="touch"
          nativeButton={false}
          role="link"
          render={<Link href="/plans" />}
        >
          View internet plans
          <ArrowRight />
        </Button>
      </PageIntro>

      {/* Coverage Checker Controls */}
      <section className="mx-auto max-w-7xl px-5 pb-6 lg:px-8">
        <div className="border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Barangay coverage directory</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Search your barangay, street name, or purok to check optical port availability.
              </p>
            </div>
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All areas ({coverageAreas.length})
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active fiber
              </Button>
              <Button
                variant={statusFilter === "expanding" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("expanding")}
              >
                Rolling out
              </Button>
              <Button
                variant={statusFilter === "survey" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("survey")}
              >
                Demand survey
              </Button>
            </div>
          </div>

          <div className="relative mt-5">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by barangay, purok, or street (e.g. Mabini, Rizal, Purok 3)..."
              aria-label="Search coverage areas"
              className="h-11 w-full border bg-background pl-10 pr-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      </section>

      {/* Area Results Grid */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {filteredAreas.length === 0 ? (
          <div className="border border-dashed p-12 text-center">
            <Compass className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">No matching service areas found</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              We couldn&apos;t find an active zone matching &ldquo;{query}&rdquo;. You can submit an area survey request below.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredAreas.map((area: CoverageArea) => {
              const isActive = area.status === "active";
              const isExpanding = area.status === "expanding";

              return (
                <div
                  key={area.id}
                  className="flex flex-col justify-between border bg-card p-6 shadow-sm"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {area.municipality}
                      </span>
                      <span
                        className={
                          isActive
                            ? "inline-flex items-center gap-1.5 border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success"
                            : isExpanding
                              ? "inline-flex items-center gap-1.5 border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning"
                              : "inline-flex items-center gap-1.5 border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        }
                      >
                        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                        {area.statusLabel}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{area.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {area.notes}
                    </p>

                    <div className="mt-5 border-t pt-4">
                      <p className="text-xs font-medium text-foreground">
                        Covered streets &amp; landmarks:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {area.streets.map((street) => (
                          <span
                            key={street}
                            className="border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {street}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
                      <span>Serving branch:</span>
                      <span className="font-medium text-foreground">{area.branchName}</span>
                    </div>
                    <div className="mb-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
                      <span>Installation timeline:</span>
                      <span className="font-medium text-foreground">{area.estInstallTime}</span>
                    </div>

                    {isActive ? (
                      <Button
                        size="touch"
                        nativeButton={false}
                        role="link"
                        className="w-full justify-between"
                        render={<Link href={`/join/${area.branchOrgId}`} />}
                      >
                        Apply for connection in {area.name.replace("Barangay ", "")}
                        <ArrowRight />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="touch"
                        nativeButton={false}
                        role="link"
                        className="w-full justify-between"
                        render={<Link href="/shop/inquiry?product=coverage-pre-registration" />}
                      >
                        Pre-register address for rollout
                        <ArrowRight />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Local Branch Offices Directory */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Building2 className="size-4" />
              Neighborhood Presence
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Local branch offices &amp; service centers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Visit our customer counters for in-person bill payments, optical router pickups, or local lineman consultations.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {branchOffices.map((office) => (
              <div key={office.id} className="border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{office.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                      {office.address}
                    </p>
                  </div>
                  <span className="font-mono text-xs uppercase text-muted-foreground border bg-muted px-2 py-0.5">
                    {office.area}
                  </span>
                </div>

                <p className="mt-3 border-l-2 border-primary pl-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Landmark: </span>
                  {office.landmark}
                </p>

                <div className="mt-5 space-y-2 border-t pt-4 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" />
                    <span>{office.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5 shrink-0" />
                    <span className="font-medium text-foreground">{office.phone}</span>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <p className="text-xs font-medium text-foreground">Available services:</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {office.services.map((service) => (
                      <li key={service} className="flex items-center gap-2">
                        <span className="size-1 rounded-full bg-muted-foreground" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    role="link"
                    className="w-full justify-between"
                    render={<Link href={`/join/${office.orgId}`} />}
                  >
                    Open {office.area} application form
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Lineman Hotline Banner */}
          <div className="mt-8 border bg-card p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center border bg-muted">
                <Radio className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">24/7 Fiber Emergency &amp; Lineman Dispatch</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Accidental line cuts, storm fallen utility wires, or sudden Red LOS indicator lights.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold">Hotline: 0917-555-0199</span>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                role="link"
                render={<Link href="/support" />}
              >
                Support inbox
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How Installation Works */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          From line survey to high-speed connection
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          How our field technicians bring fiber straight to your desk or living room.
        </p>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {installationWorkflow.map((item) => (
            <li key={item.step} className="border bg-card p-5">
              <p className="font-mono text-xs text-muted-foreground">{item.step}</p>
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Closing title="Connect your barangay with JMWired.">
        Explore our residential fiber packages or get in touch with our operations team.
      </Closing>
    </>
  );
}
