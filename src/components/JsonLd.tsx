// Contributed titles and summaries end up in here. JSON.stringify does not
// escape "<", so a recipe titled `Ladoo</script><script>...` would close this
// tag and run as script on a public page. Escaping it keeps the JSON valid and
// the tag unbreakable.
function safeJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}
