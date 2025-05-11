import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, Shield, Wallet } from "lucide-react"

export default function WhyChooseUsSection() {
  const features = [
    {
      title: "Verified Sellers",
      description: "All sellers are verified students from your university.",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500/5 to-green-500/20",
    },
    {
      title: "Trusted Landlords",
      description: "Blue-tick verified landlords and properties.",
      icon: Shield,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/5 to-blue-500/20",
    },
    {
      title: "Campus Proximity",
      description: "All accommodations are within walking distance.",
      icon: MapPin,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      gradient: "from-orange-500/5 to-orange-500/20",
    },
    {
      title: "Secure Payments",
      description: "Multiple secure payment options available.",
      icon: Wallet,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/5 to-purple-500/20",
    },
  ]

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-14 max-w-2xl mx-auto animate-fade-in">
          <Badge className="mb-4 px-4 py-1 text-base bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Why Campus Market
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">The Trusted Platform for Students</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students who trust Campus Market for their marketplace and accommodation needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
