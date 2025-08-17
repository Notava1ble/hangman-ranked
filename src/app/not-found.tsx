import Container from "@/components/Container";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <Container className="flex-col-center gap-6">
        <h1 className="font-bold text-9xl">: (</h1>
        <p className="text-lg">The page you are requesting doesnt exist.</p>
      </Container>
    </>
  );
}
