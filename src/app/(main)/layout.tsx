import Navbar from "@/components/Navbar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
export default Layout;
