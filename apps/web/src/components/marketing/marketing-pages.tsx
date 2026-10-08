import Link from "next/link";
import Image from "next/image";
import neighborhoodImage from "../../../public/images/neighborhood-fiber.png";
import officeImage from "../../../public/images/local-office.png";
import { Button } from "@jmwired/ui/components/button";
import { ArrowRight, ArrowUpRight, Check, FileImage, MessageSquare, Wifi } from "lucide-react";

function WorkspaceLink() {
  return (
    <Button size="touch" nativeButton={false} role="link" render={<Link href="/organization" />}>
      Open workspace
      <ArrowUpRight />
    </Button>
  );
}
function PageIntro({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8">
      <h1 className="max-w-4xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <WorkspaceLink />
        {children}
      </div>
    </section>
  );
}
function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized
      width={1536}
      height={1024}
      sizes="(min-width: 1280px) 1216px, 100vw"
      className="w-full border bg-muted object-contain"
    />
  );
}
function Closing({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 border-t px-5 py-12 lg:px-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {children && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{children}</p>
        )}
      </div>
      <WorkspaceLink />
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:gap-12 md:py-16 lg:px-8">
        <div>
          <p className="mb-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Wifi className="size-4" />
            For the providers connecting our neighborhoods
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight lg:text-5xl xl:text-6xl">
            Local internet.
            <br />
            One workspace.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Bring your customers, billing, and support together. Give every connection a place to
            call home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WorkspaceLink />
            <Button
              variant="outline"
              size="touch"
              nativeButton={false}
              role="link"
              render={<Link href="/portal" />}
            >
              View customer portal
              <ArrowRight />
            </Button>
          </div>
        </div>
        <figure className="relative">
          <Image
            src={neighborhoodImage}
            alt="A fiber technician working above a Philippine neighborhood"
            fetchPriority="high"
            loading="eager"
            sizes="(min-width: 1280px) 584px, (min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
          <figcaption className="mt-3 text-xs text-muted-foreground">
            The last mile is personal. Your tools should be, too.
          </figcaption>
        </figure>
      </section>
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 lg:px-8">
          <p className="text-sm">
            <span className="font-medium">Know your customers.</span>
            <span className="mt-2 block text-muted-foreground">
              Plans, usage, billing dates, and account history.
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Keep the conversation.</span>
            <span className="mt-2 block text-muted-foreground">
              Support requests with context, from first reply to resolution.
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Keep everyone informed.</span>
            <span className="mt-2 block text-muted-foreground">
              Updates for a neighborhood, an account, or a whole organization.
            </span>
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          A clear view of the work ahead.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Start with what needs attention: payment proofs waiting for review, customers coming up
          for billing, and conversations that need a reply.
        </p>
        <div className="mt-8">
          <ProductImage
            src="/images/organization-workspace.png"
            alt="JMWired operations overview showing active customers, collections, payment reviews and support requests"
          />
        </div>
        <Link
          href="/platform"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          Explore the platform
          <ArrowRight className="size-4" />
        </Link>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 border-t px-5 py-14 md:grid-cols-[1fr_2fr] lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            From payment
            <br />
            to peace of mind.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Keep the familiar QR payment workflow. Make the records easier to follow.
          </p>
          <Link
            href="/billing"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            See billing
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ol className="grid gap-0 divide-y border-y">
          <li className="flex items-start gap-5 py-5">
            <span className="font-mono text-sm text-muted-foreground">01</span>
            <div>
              <h3 className="font-medium">A bill arrives in the portal.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your customer sees the amount, due date, and payment instructions.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-5 py-5">
            <span className="font-mono text-sm text-muted-foreground">02</span>
            <div>
              <h3 className="font-medium">They attach their payment proof.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The screenshot and transaction reference stay with the payment record.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-5 py-5">
            <span className="font-mono text-sm text-muted-foreground">03</span>
            <div>
              <h3 className="font-medium">Your team reviews and confirms.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The customer can follow the status without another message.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <Closing title="One workspace. A closer connection.">
        Explore the operator workspace and see the same account from your customer’s side.
      </Closing>
    </>
  );
}

export function PlatformPage() {
  return (
    <>
      <PageIntro
        title="The whole business, within reach."
        description="Customer accounts, payment records, support conversations, and network updates share one organized workspace."
      />
      <section className="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
        <ProductImage
          src="/images/organization-workspace.png"
          alt="JMWired admin dashboard with collections and payments awaiting review"
        />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Start with the next action.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              See active customers, collections for the month, payment reviews, and open tickets.
              Move directly from the overview to the record that needs your attention.
            </p>
          </div>
          <dl className="divide-y border-y">
            <div className="flex justify-between gap-4 py-4 text-sm">
              <dt className="text-muted-foreground">Customer register</dt>
              <dd>Account and connection history</dd>
            </div>
            <div className="flex justify-between gap-4 py-4 text-sm">
              <dt className="text-muted-foreground">Payment review</dt>
              <dd>Proof, reference, and status</dd>
            </div>
            <div className="flex justify-between gap-4 py-4 text-sm">
              <dt className="text-muted-foreground">Support inbox</dt>
              <dd>A conversation with context</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            A workspace for each service area.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Manage another location without mixing its customer list, collections, or support inbox
            with the first. Invite the people who work there and keep their responsibilities clear.
          </p>
          <Link
            href="/multi-location"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            Explore organizations
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <Closing title="See the records behind the overview." />
    </>
  );
}

export function BillingPage() {
  return (
    <>
      <PageIntro
        title="Familiar payments. Clearer records."
        description="Collect through your own QR codes. Keep every screenshot, reference, and review attached to the right account."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 md:grid-cols-[3fr_2fr] lg:px-8">
        <ProductImage
          src="/images/payment-review.png"
          alt="Payment proof review with transaction reference, screenshot and approval actions"
        />
        <div className="self-center">
          <FileImage className="mb-5 size-7 text-muted-foreground" />
          <h2 className="text-2xl font-semibold tracking-tight">A payment has a paper trail.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Customers upload their screenshots directly from the portal. Your team checks the
            reference and transfer, then approves the payment or explains what needs correcting.
          </p>
          <p className="mt-5 border-l-2 border-primary pl-4 text-sm leading-relaxed">
            Approving the proof updates the bill and payment history together.
          </p>
        </div>
      </section>
      <section className="border-y bg-muted/30">
        <ol className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            ["Bill", "The plan, monthly amount, and billing day belong to the customer account."],
            ["Pay", "The customer scans the organization’s collection QR in their payment app."],
            ["Submit", "A transaction reference and payment screenshot go into the portal."],
            ["Review", "Staff verify the transfer and confirm or return the proof for correction."],
          ].map(([title, text], index) => (
            <li key={title}>
              <p className="font-mono text-xs text-muted-foreground">0{index + 1}</p>
              <h2 className="mt-3 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Less searching when billing day arrives.
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            "Filter paid, unpaid, and pending payments.",
            "See each customer’s upcoming billing day.",
            "Record cash collected by your staff.",
            "Review past payments and submitted proof.",
          ].map((text) => (
            <li key={text} className="flex items-start gap-3 text-sm">
              <Check className="size-4 shrink-0 text-success" />
              {text}
            </li>
          ))}
        </ul>
      </section>
      <Closing title="Bring your billing records together." />
    </>
  );
}

export function CustomerPortalPage() {
  return (
    <>
      <PageIntro
        title="A home for every customer account."
        description="Let customers check usage, follow payments, get service updates, and ask for help in one place."
      >
        <Button
          variant="outline"
          size="touch"
          nativeButton={false}
          role="link"
          render={<Link href="/portal" />}
        >
          View customer portal
          <ArrowRight />
        </Button>
      </PageIntro>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 md:grid-cols-[2fr_3fr] lg:px-8">
        <div className="self-center">
          <h2 className="text-3xl font-semibold tracking-tight">The answer is already there.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            How much is my bill? Did my payment go through? Is there maintenance in my area? Put the
            details people ask for right where they can find them.
          </p>
          <nav aria-label="Customer portal features" className="mt-7 grid divide-y border-y">
            <Link
              href="/portal/bills"
              className="flex items-center justify-between py-4 text-sm hover:underline"
            >
              Bills & payment history
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/portal/support"
              className="flex items-center justify-between py-4 text-sm hover:underline"
            >
              Requests & conversation history
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/portal/updates"
              className="flex items-center justify-between py-4 text-sm hover:underline"
            >
              Maintenance & announcements
              <ArrowUpRight className="size-4" />
            </Link>
          </nav>
        </div>
        <ProductImage
          src="/images/customer-account.png"
          alt="A customer account showing the internet plan, current bill, data usage, and maintenance update"
        />
      </section>
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            Updates that belong to their connection.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A neighborhood-wide maintenance notice reaches the area. An account-specific update
            stays with that customer. Customers can choose billing reminders and service alerts in
            their account settings.
          </p>
        </div>
      </section>
      <Closing title="Make managing an account feel easy." />
    </>
  );
}

export function SupportPage() {
  return (
    <>
      <PageIntro
        title="Keep the context. Help faster."
        description="A shared inbox connects each problem to its customer, conversation history, and current ticket status."
      />
      <section className="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
        <ProductImage
          src="/images/support-inbox.png"
          alt="JMWired support inbox showing tickets, customer conversation, status and reply assistance"
        />
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <MessageSquare className="mb-4 size-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">
              One conversation, from report to resolution.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Customers submit connection problems and billing questions. Your team replies in the
              same conversation, changes the status, and keeps a record customers can revisit.
            </p>
          </div>
          <div className="border-l pl-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              A little help with the next reply.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Review a conversation summary, prepare a suggested response, then edit or send it.
              Your team stays in control of what the customer receives.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            When the whole area needs an answer.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Publish an outage update or scheduled maintenance notice to the affected customers.
            Resolve the alert when service returns, with the history still available in the portal.
          </p>
          <Link
            href="/customer-portal"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            See the customer’s view
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <Closing title="Get closer to the conversation." />
    </>
  );
}

export function MultiLocationPage() {
  return (
    <>
      <PageIntro
        title="Another area. Its own workspace."
        description="Create an organization for each branch or service area, with its own customers, team, payments, and conversations."
      />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-14 md:grid-cols-2 lg:px-8">
        <div className="divide-y border-y">
          <div className="py-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              The right records, in the right place.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Switch organizations to move between service areas. Payment reviews, customer lists,
              support requests, and announcements follow the workspace you select.
            </p>
          </div>
          <div className="py-6">
            <h2 className="text-2xl font-semibold tracking-tight">A team for each location.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Invite owners, admins, and members into an organization. Keep platform administration
              separate from the people managing day-to-day customer operations.
            </p>
          </div>
        </div>
        <figure>
          <Image
            src={officeImage}
            alt="A local internet provider team working together in their office"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
          <figcaption className="mt-3 text-xs text-muted-foreground">
            Different locations. The same care for every customer.
          </figcaption>
        </figure>
      </section>
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            A clear division of responsibility.
          </h2>
          <dl className="mt-7 grid gap-8 sm:grid-cols-3">
            <div>
              <dt className="font-medium">Organization owner</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Manages a workspace and its team.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Organization team</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Handles customer accounts, payments, and support.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Platform admin</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Oversees organizations and platform-level users.
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <Closing title="Give your next location room to grow." />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageIntro
        title="Built around the last mile."
        description="Local internet providers know their communities. Their tools should help them stay close to the people they connect."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 md:grid-cols-[3fr_2fr] lg:px-8">
        <Image
          src={officeImage}
          alt="An internet provider owner and colleague in a neighborhood office"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="self-center">
          <h2 className="text-3xl font-semibold tracking-tight">The work behind the connection.</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              A reliable connection takes more than a cable. Someone keeps the account up to date,
              checks the payment screenshot, replies to the outage report, and tells the
              neighborhood when maintenance is coming.
            </p>
            <p>
              JMWired brings that work into one place, with a straightforward workspace for the
              provider and a clear portal for the customer.
            </p>
            <p>
              It starts with the workflows small providers already use: monthly plans, QR payments,
              personal support, and service areas that grow one neighborhood at a time.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl border-t px-5 py-12 lg:px-8">
        <h2 className="max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
          Make the next customer conversation easier than the last.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          That’s the purpose behind the customer records, payment history, support inbox, and
          announcements.
        </p>
      </section>
      <Closing title="Explore both sides of the connection." />
    </>
  );
}
