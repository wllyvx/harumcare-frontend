/// <reference types="astro/client" />
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
    interface Locals extends Runtime { }
}

interface Env {
    GOOGLE_CLIENT_ID: string;
    PUBLIC_GOOGLE_CLIENT_ID: string;
    PUBLIC_API_URL: string;
}
