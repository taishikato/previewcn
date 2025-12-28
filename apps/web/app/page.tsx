import { DemoVideo } from "@/components/demo-video";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { TriggerHint } from "@/components/trigger-hint";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />
      <DemoVideo />
      <SocialProof />
      <Footer />
      <TriggerHint />
    </main>
  );
}
