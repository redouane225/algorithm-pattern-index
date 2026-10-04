export default async function IndexPage({
  params,
}: PageProps<"/[lang]">): Promise<React.JSX.Element> {
  const { lang } = await params;
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">{lang}</h1>
    </main>
  );
}
