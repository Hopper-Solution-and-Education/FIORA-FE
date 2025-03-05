export default function Hero() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-16 xl:py-24 bg-gradient-to-br from-blue-100 via-white to-purple-100 place-items-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none">
            Simplify Your Financial Landscape with Powerful Insights
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl">
            Effortlessly understand and manage your finances. Our platform delivers powerful
            insights to simplify your financial landscape and empower your financial decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
