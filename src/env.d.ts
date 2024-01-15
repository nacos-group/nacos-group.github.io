/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly STRAPI_URL: string;
	readonly YUQUE_TOKEN: string;
}