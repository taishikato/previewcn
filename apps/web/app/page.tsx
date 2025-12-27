import { DemoVideo } from "@/components/demo-video";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />
      <DemoVideo />
      <SocialProof />
    </main>
  );
}
