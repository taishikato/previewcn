import { ClientTweetCard } from "@/components/ui/client-tweet-card";

export function SocialProof() {
  return (
    <section className="flex flex-col items-center gap-8 px-4 py-16">
      <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
        What people are saying
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <ClientTweetCard id="2001339628746662345" />
        <ClientTweetCard id="2001066897912279419" />
      </div>
    </section>
  );
}
