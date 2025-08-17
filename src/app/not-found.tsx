import Container from "@/components/Container";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <Container className="flex-col-center gap-6">
        <h1 className="sr-only">Page not found</h1>
        <span aria-hidden="true" role="img" className="font-bold text-9xl">
          :(
        </span>
        <p className="text-lg">
          The page you are requesting doesn&apos;t exist.
        </p>
      </Container>
    </>
  );
}
