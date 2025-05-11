import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Wallet } from "lucide-react"

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Find What You Need",
      description: "Browse through thousands of listings from verified students and landlords.",
      icon: Search,
      color: "bg-blue-500/10 text-blue-500",
      gradient: "from-blue-500/5 to-blue-500/20",
    },
    {
      title: "Connect Directly",
      description: "Message sellers or landlords directly through our secure messaging system.",
      icon: MessageSquare,
      color: "bg-green-500/10 text-green-500",
      gradient: "from-green-500/5 to-green-500/20",
    },
    {
      title: "Complete Your Transaction",
      description: "Meet up, view rooms, and complete your purchase or booking safely.",
      icon: Wallet,
      color: "bg-purple-500/10 text-purple-500",
      gradient: "from-purple-500/5 to-purple-500/20",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />
      <div className="absolute top-40 -left-20 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <Badge className="mb-4 px-4 py-1 text-base bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Campus Market makes it easy to buy, sell, and find accommodation in just a few simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -m-1 p-1 blur-xl z-0" />
              <Card className="h-full border-none shadow-lg relative z-10 bg-gradient-to-br group-hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-6 text-center relative z-10">
                  <div
                    className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${step.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
