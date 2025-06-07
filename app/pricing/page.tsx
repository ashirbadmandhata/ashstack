import { Check, Star, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Basic",
    price: "₹2,399",
    originalPrice: "₹2,999",
    period: "/month",
    description: "Perfect for individuals and small projects",
    icon: Star,
    features: [
      "Access to 100+ digital assets",
      "Basic templates and UI kits",
      "Email support",
      "Standard license",
      "Monthly updates",
    ],
    color: "from-blue-500 to-cyan-500",
    popular: false,
    savings: "20% OFF",
  },
  {
    name: "Pro",
    price: "₹6,499",
    originalPrice: "₹7,999",
    period: "/month",
    description: "Ideal for growing businesses and teams",
    icon: Zap,
    features: [
      "Access to 500+ digital assets",
      "Premium templates and components",
      "Priority support",
      "Extended license",
      "Weekly updates",
      "Custom project requests (2/month)",
      "Source code access",
    ],
    color: "from-purple-500 to-pink-500",
    popular: true,
    savings: "19% OFF",
  },
  {
    name: "Lifetime",
    price: "₹41,249",
    originalPrice: "₹49,999",
    period: "one-time",
    description: "Complete access forever with exclusive benefits",
    icon: Crown,
    features: [
      "Unlimited access to all assets",
      "Exclusive premium content",
      "24/7 priority support",
      "Commercial license",
      "Daily updates",
      "Unlimited custom requests",
      "1-on-1 consultation calls",
      "Early access to new releases",
      "White-label rights",
    ],
    color: "from-yellow-500 to-orange-500",
    popular: false,
    savings: "17% OFF",
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Plan</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Unlock premium digital assets and custom development services with our flexible pricing options
          </p>
          <div className="inline-flex items-center px-6 py-3 glass-card rounded-full text-green-400 text-sm mb-8">
            🎉 Limited Time Offer - Save up to 20% on all plans!
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <Card
                key={index}
                className={`relative bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 ${
                  plan.popular ? "transform scale-105 border-purple-500 shadow-2xl shadow-purple-500/20" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}

                {plan.savings && (
                  <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                    {plan.savings}
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>

                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <div className="flex flex-col">
                        <span className="text-gray-400 ml-1">{plan.period}</span>
                        {plan.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">{plan.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    }`}
                  >
                    {plan.name === "Lifetime" ? "Get Lifetime Access" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">All plans include a 30-day money-back guarantee</p>
          <div className="flex justify-center gap-8 text-sm text-gray-500 flex-wrap">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 support</span>
            <span>✓ Secure payments</span>
          </div>
          <div className="mt-6 text-xs text-gray-600">
            * Prices are in Indian Rupees (INR). International customers may see different pricing based on location.
          </div>
        </div>
      </div>
    </main>
  )
}
