import { Lightbulb, Palette, Code, TestTube, Package } from "lucide-react"

const steps = [
  {
    icon: Lightbulb,
    title: "Idea",
    description: "We analyze your requirements and brainstorm innovative solutions",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Palette,
    title: "Design",
    description: "Create stunning UI/UX designs that captivate your users",
    color: "from-pink-500 to-purple-500",
  },
  {
    icon: Code,
    title: "Build",
    description: "Develop robust, scalable solutions using cutting-edge technologies",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TestTube,
    title: "Test",
    description: "Rigorous testing ensures quality, performance, and reliability",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Package,
    title: "Deliver",
    description: "Deploy and deliver your project with full documentation and support",
    color: "from-indigo-500 to-purple-500",
  },
]

export function ProcessSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How We Build &{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Deliver Projects
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our proven 5-step process ensures exceptional results every time
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 via-purple-500 via-blue-500 via-green-500 to-indigo-500 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative text-center group">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-800 border-2 border-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white z-10 group-hover:border-blue-500 transition-colors">
                    {index + 1}
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 pt-12 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
