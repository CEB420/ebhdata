import { API_BASE } from "./data";

export const LANGS = ["python", "r", "javascript", "curl"] as const;
export type Lang = (typeof LANGS)[number];
export const LANG_LABEL: Record<Lang, string> = { python: "Python", r: "R", javascript: "JavaScript", curl: "cURL" };

type Params = Record<string, string | number>;

function query(params: Params) {
  const q = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
  return q ? `?${q}` : "";
}

function pyValue(v: string | number) {
  return typeof v === "number" ? String(v) : `"${v}"`;
}

/** A ready-to-paste request for `path` in the given language, with the API Key filled in. */
export function snippet(lang: Lang, path: string, params: Params, key: string) {
  const url = `${API_BASE}${path}`;
  const entries = Object.entries(params);
  switch (lang) {
    case "python": {
      const p = entries.length ? `    params={${entries.map(([k, v]) => `"${k}": ${pyValue(v)}`).join(", ")}},\n` : "";
      return `import requests\n\nr = requests.get(\n    "${url}",\n${p}    headers={"Authorization": "Bearer ${key}"},\n)\nprint(r.json())`;
    }
    case "r": {
      const p = entries.length ? `  req_url_query(${entries.map(([k, v]) => `${k} = ${pyValue(v)}`).join(", ")}) |>\n` : "";
      return `library(httr2)\n\nrequest("${url}") |>\n${p}  req_auth_bearer_token("${key}") |>\n  req_perform() |>\n  resp_body_json()`;
    }
    case "javascript":
      return `const res = await fetch(\n  "${url}${query(params)}",\n  { headers: { Authorization: "Bearer ${key}" } }\n);\nconsole.log(await res.json());`;
    case "curl":
      return `curl "${url}${query(params)}" \\\n  -H "Authorization: Bearer ${key}"`;
  }
}
