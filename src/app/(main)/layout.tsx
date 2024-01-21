import Header from "@/components/Header/Header";
import TokenService from "@/services/token";
import Link from "next/link";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the currently logged in user from the database
  const userToken = await TokenService.decodeToken();

  return (
    <>
      <Header userToken={userToken} />

      <main className="container mx-auto max-w-screen-2xl ">{children}</main>

      <footer className="max-w-screen-2xl w-full mx-auto p-4 flex flex-col justify-center items-center">
        <hr className="border-none w-full h-[1px] bg-gradient-to-r from-white via-slate-200 to-white mb-6" />
        <Link href="/" className="flex items-center text-teal-500 group">
          <span className="mr-2">&copy;</span>
          QuillHub, {new Date().getFullYear()}
        </Link>
      </footer>
    </>
  );
}
