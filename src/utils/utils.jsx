function fixMojibake(text) {
  try {
    return text
      .replace(/Ã©/g, "é")
      .replace(/Ã¨/g, "è")
      .replace(/Ã /g, "à")
      .replace(/Ã¢/g, "â")
      .replace(/Ã´/g, "ô")
      .replace(/Ã¹/g, "ù")
      .replace(/â‚¬/g, "€")
      .replace(/â€œ/g, "“")
      .replace(/â€/g, "”")
      .replace(/ðŸ([\s\S]{2})/g, (m) => {
        try {
          return decodeURIComponent(escape(m));
        } catch {
          return "📢";
        }
      });
  } catch {
    return text;
  }
}



export function decodeBase64(str) {
  try {
    if (!str || typeof str !== "string") return "Error decode";

    const binary = atob(str);

    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    const text = new TextDecoder("utf-8").decode(bytes);

    return fixMojibake(text);
  } catch {
    return "Error decode";
  }
}