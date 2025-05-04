
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import FeaturedContent from "@/components/FeaturedContent";
import SearchSection from "@/components/SearchSection";
import Hero from "@/components/Hero";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Hero />
        <SearchSection />
        <section className="container py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Solving Agricultural Challenges</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform connects farmers with the resources, services and markets they need to thrive,
              eliminating inefficiencies and creating value for everyone in the agricultural ecosystem.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-1 flex flex-col space-y-3 rounded-lg border p-6">
              <div>
                <div className="inline-block rounded-lg bg-primary/10 p-2.5">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="12" x2="12" y1="2" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium">Direct Trading Platform</h3>
              <p className="text-muted-foreground">
                Connect directly with buyers and sellers, eliminating middlemen and increasing farmer profits while ensuring better prices for consumers.
              </p>
              <Button
                className="mt-4 gap-2"
                variant="outline"
                onClick={() => navigate("/commodity-trading")}
              >
                Access Trading Platform <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-1 flex flex-col space-y-3 rounded-lg border p-6">
              <div>
                <div className="inline-block rounded-lg bg-primary/10 p-2.5">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.2-4 2-5 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.5.5-4 2-4.5 1-.35 1.5-.5 2-.5.17 0 .34.03.5.08" />
                    <path d="M12 12c-1.1 0-2 .9-2 2a2 2 0 0 0 4 0 2 2 0 0 0-2-2Z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium">Supply Chain Solutions</h3>
              <p className="text-muted-foreground">
                Tackle common agricultural challenges like post-harvest losses, logistics, and market access with practical, proven solutions.
              </p>
              <Button
                className="mt-4 gap-2"
                variant="outline"
                onClick={() => navigate("/supply-chain-problems")}
              >
                Explore Solutions <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-1 flex flex-col space-y-3 rounded-lg border p-6">
              <div>
                <div className="inline-block rounded-lg bg-primary/10 p-2.5">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium">Service Provider Network</h3>
              <p className="text-muted-foreground">
                Find nearby agricultural service providers including transporters, storage facilities, and quality control services on our interactive map.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="mt-4 gap-2"
                  variant="outline"
                  onClick={() => navigate("/service-providers")}
                >
                  Provider Directory <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  className="mt-4 gap-2"
                  variant="ghost"
                  onClick={() => navigate("/logistics-solutions-map")}
                >
                  <MapPin className="h-4 w-4" /> Solutions Map
                </Button>
              </div>
            </div>
            <div className="col-span-1 flex flex-col space-y-3 rounded-lg border p-6">
              <div>
                <div className="inline-block rounded-lg bg-primary/10 p-2.5">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 22V8a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
                    <path d="M6 10h12" />
                    <path d="M6 14h12" />
                    <path d="M6 18h12" />
                    <path d="M10 6h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium">Real-Time Market Data</h3>
              <p className="text-muted-foreground">
                Make informed decisions with up-to-date agricultural market information, price trends, and demand forecasts.
              </p>
              <Button
                className="mt-4 gap-2"
                variant="outline"
                onClick={() => navigate("/kilimo-ams-data")}
              >
                View Market Data <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-1 flex flex-col space-y-3 rounded-lg border p-6">
              <div>
                <div className="inline-block rounded-lg bg-primary/10 p-2.5">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium">Market Analysis</h3>
              <p className="text-muted-foreground">
                Identify opportunities and trends with market demand analysis, helping you make better planting and selling decisions.
              </p>
              <Button
                className="mt-4 gap-2"
                variant="outline"
                onClick={() => navigate("/market-demand-hotspot")}
              >
                View Market Analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-1 flex flex-col space-y-3 rounded-lg border p-6">
              <div>
                <div className="inline-block rounded-lg bg-primary/10 p-2.5">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium">Success Stories</h3>
              <p className="text-muted-foreground">
                Learn from other farmers who have successfully overcome agricultural challenges with practical, replicable solutions.
              </p>
              <Button
                className="mt-4 gap-2"
                variant="outline"
                onClick={() => navigate("/farmer-success-stories")}
              >
                See Success Stories <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <FeaturedContent />
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
