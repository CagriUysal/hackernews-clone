export default function validateComment(message: string): void {
  if (message.length === 0) {
    throw Error("Comment cannot be empty");
  }
}
