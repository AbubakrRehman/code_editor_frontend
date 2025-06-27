import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();
    const [retrying, setRetrying] = useState(false);

    let title = "Something went wrong";
    let message = "An unexpected error occurred.";

    if (isRouteErrorResponse(error)) {
        title = `${error.status} – ${error.statusText}`;
        message = error.data?.message || "The requested page couldn't be loaded.";
    } else if (error instanceof Error) {
        message = error.message;
    }

    // Optional: Retry logic – reloads the current route
    const handleRetry = async () => {
        setRetrying(true);
        // force revalidation by navigating to the same path
        navigate(0); // refresh current route
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-700 mb-3">{title}</h1>
            <p className="text-gray-700 mb-6">{message}</p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button className="hover:cursor-pointer" 
                    onClick={handleRetry}
                    disabled={retrying}
                >
                    {retrying ? "Retrying..." : "Retry"}
                </Button>

                <Button className="hover:cursor-pointer" 
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
              

                 <Button className="hover:cursor-pointer" 
                    onClick={() => navigate("/")}
                >
                    Go Home
                </Button>
            </div>
        </div>
    );
}
