import { formatPrice } from "../utils/format.js";

export default function Price({ value }) {
  return <span>{value == null ? "Prix inconnu" : formatPrice(value)}</span>;
}
