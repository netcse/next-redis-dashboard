import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
            <section className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-4 text-blue-600">Next.js Dev Showcase</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Explore high-performance features powered by Next.js, Redis, and scalable API routing.
                </p>
            </section>

            <section className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                    title="1M Users Grid"
                    description="Paginated user list with Redis-backed performance."
                    href="/showcase/users-grid"
                    icon="📊"
                />
                {/* Future links can be added here like below: */}
                {/* <FeatureCard title="Analytics Dashboard" description="Visualize trends." href="/analytics" icon="📈" /> */}
                {/* <FeatureCard title="Settings" description="Configure system options." href="/settings" icon="⚙️" /> */}
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
                         href,
                     }: {
    title: string;
    description: string;
    icon: string;
    href: string;
}) {
    return (
        <Link href={href} className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </Link>
    );
}
