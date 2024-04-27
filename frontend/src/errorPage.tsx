import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    let error: any
    error = useRouteError();
    console.error(error as string);

    return (
        <div className="flex justify-center min-h-screen items-center flex-col gap-10">
            <h1 className="font-bold text-4xl">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}