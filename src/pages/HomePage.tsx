import { BenefitStrip } from "@/sections/home/BenefitStrip";
import { CategoryGrid } from "@/sections/home/CategoryGrid";
import { CustomProjectBanner } from "@/sections/home/CustomProjectBanner";
import { FeaturedProjects } from "@/sections/home/FeaturedProjects";
import { HeroSection } from "@/sections/home/HeroSection";
import { HowItWorks } from "@/sections/home/HowItWorks";
import { TrustSection } from "@/sections/home/TrustSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitStrip />
      <CategoryGrid />
      <FeaturedProjects />
      <CustomProjectBanner />
      <HowItWorks />
      <TrustSection />
    </>
  );
}
