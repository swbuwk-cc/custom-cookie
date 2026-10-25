import { beautifyName } from "./utils/beautifyName";

export const appName = process.env.APP_NAME!;
export const displayName = beautifyName(appName);
export const imageStorageKey = `${appName}Image`;
