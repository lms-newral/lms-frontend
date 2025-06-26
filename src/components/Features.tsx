import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Interactive Courses",
      description:
        "Engage with multimedia content, quizzes, and assignments designed to enhance learning.",
      icon: "📚",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed analytics and progress reports.",
      icon: "📊",
    },
    {
      title: "Collaborative Learning",
      description:
        "Connect with peers, join discussions, and learn together in virtual classrooms.",
      icon: "👥",
    },
    {
      title: "Mobile Learning",
      description:
        "Access your courses anytime, anywhere with our responsive mobile platform.",
      icon: "📱",
    },
    {
      title: "Certification",
      description:
        "Earn certificates upon course completion to showcase your achievements.",
      icon: "🏆",
    },
    {
      title: "Expert Support",
      description:
        "Get help from instructors and support team whenever you need assistance.",
      icon: "🎓",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="block text-blue-600">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive learning platform provides all the tools and
            resources you need for an exceptional educational experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
            >
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
