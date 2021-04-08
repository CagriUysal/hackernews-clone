export default function validateSubmit({
  title,
  link,
  text,
}: {
  title: string;
  link: string;
  text: string;
}): void {
  if (title === "") {
    throw Error("That's not a valid title.");
  }

  if (link !== "" && !isValidUrl(link)) {
    throw Error("That's not a valid URL.");
  }
}

function isValidUrl(str) {
  // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator

  return !!pattern.test(str);
}
