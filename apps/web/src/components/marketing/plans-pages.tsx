"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@jmwired/ui/components/button";
import { ArrowRight, Check, ShieldCheck, Wifi, Zap, Building2, HelpCircle } from "lucide-react";
import { PageIntro, Closing } from "@/components/marketing/marketing-pages";
import {
  residentialPlans,
  businessPlans,
  planFaqs,
  type PlanTier,
} from "@/lib/plans-data";
import { money } from "@/lib/mock-data";

export function PlansPage() {
  const [category, setCategory] = useState<"residential" | "business">("residential");
  const plans = category === "residential" ? residentialPlans : businessPlans;

  return (
    <>
      <PageIntro
        title="High-speed fiber. Real community pricing."
        description="Reliable, symmetric fiber internet with zero data caps, free standard installation, and dedicated local support."
      >
        <Button
          variant="outline"
          size="touch"
          nativeButton={false}
          role="link"
          render={<Link href="/coverage" />}
        >
          Check area coverage
          <ArrowRight />
        </Button>
      </PageIntro>

      {/* Category toggle */}
      <section className="mx-auto max-w-7xl px-5 pb-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Choose your bandwidth</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select residential home plans or dedicated commercial fiber for businesses.
            </p>
          </div>
          <div className="inline-flex border bg-muted/40 p-1">
            <Button
              variant={category === "residential" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCategory("residential")}
            >
              <Wifi />
              Residential Fiber
            </Button>
            <Button
              variant={category === "business" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCategory("business")}
            >
              <Building2 />
              Business & Enterprise
            </Button>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan: PlanTier) => {
            const isFeatured = plan.badge === "Most popular";
            return (
              <div
                key={plan.id}
                className={
                  isFeatured
                    ? "relative flex flex-col justify-between border-2 border-primary bg-card p-6 shadow-sm"
                    : "relative flex flex-col justify-between border bg-card p-6 shadow-sm"
                }
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span
                        className={
                          isFeatured
                            ? "border border-primary bg-primary/10 px-2 py-0.5 text-xs font-medium text-foreground"
                            : "border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold tracking-tight">
                        {money(plan.price)}
                      </span>
                      <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{plan.tagline}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  {/* Speed Highlight Banner */}
                  <div className="mt-6 flex items-center justify-between border bg-muted/30 p-3">
                    <div className="flex items-center gap-2">
                      <Zap className="size-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Symmetric speed</span>
                    </div>
                    <span className="font-mono text-sm font-semibold">{plan.speed} Mbps</span>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      What&apos;s included
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed">
                          <Check className="size-4 shrink-0 text-success" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t">
                  <p className="mb-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Ideal for: </span>
                    {plan.idealFor}
                  </p>
                  <Button
                    variant={isFeatured ? "default" : "outline"}
                    size="touch"
                    nativeButton={false}
                    role="link"
                    className="w-full justify-between"
                    render={<Link href={plan.ctaHref} />}
                  >
                    {plan.ctaText}
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inclusions Feature Grid */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Standard with every JMWired connection
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No hidden modem rental fees, no fine-print data caps, and no waiting weeks for out-of-town technicians.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border bg-card p-5">
              <Zap className="mb-3 size-5 text-muted-foreground" />
              <h3 className="font-medium">Truly Unlimited Data</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Zero data caps or Fair Usage Policy (FUP) throttling. Stream, download, and game at full speed all month long.
              </p>
            </div>
            <div className="border bg-card p-5">
              <Wifi className="mb-3 size-5 text-muted-foreground" />
              <h3 className="font-medium">Wi-Fi ONU Gateway</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                High-performance optical network unit with dual-band Wi-Fi provided on standard 12-month agreement.
              </p>
            </div>
            <div className="border bg-card p-5">
              <ShieldCheck className="mb-3 size-5 text-muted-foreground" />
              <h3 className="font-medium">Subscriber Portal</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Track current dues, submit GCash and Maya transaction screenshots, and view local maintenance alerts 24/7.
              </p>
            </div>
            <div className="border bg-card p-5">
              <Building2 className="mb-3 size-5 text-muted-foreground" />
              <h3 className="font-medium">Local Linemen Dispatch</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Our technicians are stationed directly in your municipality for rapid drop cable repair and optical testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Specs Comparison Table */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Detailed plan specifications
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Compare technical allocations and commitments across our residential tiers.
        </p>

        <div className="mt-8 overflow-x-auto border">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/40 font-medium text-foreground">
              <tr>
                <th className="p-4">Feature / Specification</th>
                {residentialPlans.map((plan) => (
                  <th key={plan.id} className="p-4 font-semibold">
                    {plan.name} ({plan.speed} Mbps)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-muted-foreground">
              <tr>
                <td className="p-4 font-medium text-foreground">Monthly subscription fee</td>
                {residentialPlans.map((plan) => (
                  <td key={plan.id} className="p-4 font-mono font-medium text-foreground">
                    {money(plan.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Download / Upload speed</td>
                {residentialPlans.map((plan) => (
                  <td key={plan.id} className="p-4">
                    {plan.specs.downloadSpeed} symmetric
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Monthly data allowance</td>
                {residentialPlans.map((plan) => (
                  <td key={plan.id} className="p-4">
                    {plan.specs.dataCap}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Hardware included</td>
                {residentialPlans.map((plan) => (
                  <td key={plan.id} className="p-4">
                    {plan.specs.routerIncluded}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Lock-in agreement</td>
                {residentialPlans.map((plan) => (
                  <td key={plan.id} className="p-4">
                    {plan.specs.lockInPeriod}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Technical support SLA</td>
                {residentialPlans.map((plan) => (
                  <td key={plan.id} className="p-4">
                    {plan.specs.supportSla}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Action</td>
                {residentialPlans.map((plan) => (
                  <td key={plan.id} className="p-4">
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      role="link"
                      render={<Link href={plan.ctaHref} />}
                    >
                      Apply
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <HelpCircle className="size-4" />
            Frequently Asked Questions
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Questions about our plans & installation
          </h2>
          <div className="mt-8 divide-y border-y">
            {planFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium outline-none hover:text-primary">
                  <span className="text-base">{faq.question}</span>
                  <span className="ml-4 font-mono text-xs text-muted-foreground group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Closing title="Ready to connect your home or office?">
        Check if your barangay is ready for installation or apply directly with your local branch.
      </Closing>
    </>
  );
}
