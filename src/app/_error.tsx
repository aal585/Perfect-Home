import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Error({ statusCode }: { statusCode?: number }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage after error
    router.push("/");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </h1>
      <p className="text-lg">Redirecting you to the homepage...</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res: any; err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
