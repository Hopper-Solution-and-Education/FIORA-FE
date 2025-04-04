export default async function Layout({ children }: { children: React.ReactNode }) {
  return <section className="p-4 md:px-6">{children}</section>;
}
