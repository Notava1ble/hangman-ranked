const Page = async ({ params }: { params: Promise<{ user: string }> }) => {
  const { user } = await params;
  return <div>Profile Page for {user}</div>;
};
export default Page;
