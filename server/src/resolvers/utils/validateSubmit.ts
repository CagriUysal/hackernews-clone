import { URL } from "url";

export default function validateSubmit({
  title,
  link,
}: {
  title: string;
  link: string;
}): void {
  if (title === "") {
    throw Error("That's not a valid title.");
  }
  if (!isValidHttpUrl(link)) {
    throw Error("That's not a valid URL.");
  }
}

function isValidHttpUrl(str: string) {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
