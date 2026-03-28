interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="mb-8 space-y-3 sm:mb-10 lg:mb-12">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h1>
      <p className="max-w-2xl text-base leading-7 text-cyan-50/90 sm:text-lg">{subtitle}</p>
    </section>
  );
}