export default function HomePage() {
  return (
      <main className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-blue-600">Next.js Dev Showcase</h1>
          <p className="text-lg text-gray-600 mb-6">
            Fast, flexible, and optimized – built with Next.js, Redis, and modern API patterns.
          </p>
          <a
              href="/showcase"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Explore Showcase
          </a>
        </section>

        <section className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
              title="Powerful API"
              description="Structured REST endpoints with support for bulk and single operations."
              icon="🛠️"
          />
          <FeatureCard
              title="Redis Integration"
              description="Blazing fast cache layer using Redis – seamless and persistent."
              icon="⚡"
          />
          <FeatureCard
              title="Dynamic Routing"
              description="Next.js App Router with nested layouts and clean URLs."
              icon="🌐"
          />
          <FeatureCard
              title="Pagination & Search"
              description="Smart pagination and filtering mechanisms for large datasets."
              icon="🔍"
          />
          <FeatureCard
              title="Modular Service Layer"
              description="Separation of concerns with reusable service logic (like userService.ts)."
              icon="📦"
          />
          <FeatureCard
              title="Secure & Extensible"
              description="Input validation, rate limiting and JWT-ready endpoints."
              icon="🔒"
          />
        </section>

        <footer className="mt-24 text-center text-sm text-gray-500">
          Built with ❤️ using Next.js 14, TypeScript & Redis
        </footer>
      </main>
  );
}

function FeatureCard({
                       title,
                       description,
                       icon,
                     }: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
  );
}
