const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
export const formatPrice = (n) => euros.format(n);
