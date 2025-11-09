export async function hashSenha(senha) {
  const enc = new TextEncoder();
  const data = enc.encode(senha);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
