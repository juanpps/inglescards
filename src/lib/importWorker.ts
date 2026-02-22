/**
 * Web Worker para parseo de importación
 * Evita bloquear el UI durante el procesamiento
 */

export type ImportMessage =
  | { type: 'parse'; payload: { raw: string; format: 'csv' | 'json' | 'txt' } }
  | { type: 'parse-xlsx'; payload: { buffer: ArrayBuffer } };

export interface ParsedRow {
  word?: string;
  translation?: string;
  example?: string;
  category?: string;
  difficulty?: string;
  group?: string;
  groups?: string;
  source?: string;
  [key: string]: string | undefined;
}

export interface ParseResult {
  rows: ParsedRow[];
  headers: string[];
  errors: string[];
}

function parseCSV(raw: string): ParseResult {
  const errors: string[] = [];
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { rows: [], headers: [], errors: ['Archivo vacío'] };
  const headers = parseCSVLine(lines[0]);
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: ParsedRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim() ?? '';
    });
    if (row.word || row.translation) rows.push(row);
  }
  return { rows, headers, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if ((ch === ',' && !inQuotes) || ch === '\t') {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result.map((s) => s.replace(/^"|"$/g, '').trim());
}

function parseJSON(raw: string): ParseResult {
  const errors: string[] = [];
  try {
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : data.cards ?? data.items ?? [data];
    const rows: ParsedRow[] = arr.map((r: Record<string, unknown>) => {
      const row: ParsedRow = {};
      for (const [k, v] of Object.entries(r)) {
        row[k] = String(v ?? '').trim();
      }
      return row;
    });
    const headers = rows[0] ? Object.keys(rows[0]) : [];
    return { rows, headers, errors };
  } catch (e) {
    errors.push(`JSON inválido: ${(e as Error).message}`);
    return { rows: [], headers: [], errors };
  }
}

function parseTXT(raw: string): ParseResult {
  const errors: string[] = [];
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  const rows: ParsedRow[] = [];
  const sep = raw.includes('\t') ? '\t' : /[,;|]/.test(raw) ? /[,;|]/ : '-';
  const headers = ['word', 'translation', 'example', 'category', 'group'];
  for (const line of lines) {
    const parts = typeof sep === 'string'
      ? line.split(sep)
      : line.split(sep as RegExp).flat();
    if (parts.length >= 2) {
      rows.push({
        word: parts[0]?.trim(),
        translation: parts[1]?.trim(),
        example: parts[2]?.trim(),
        category: parts[3]?.trim(),
        group: parts[4]?.trim(),
      });
    }
  }
  return { rows, headers, errors };
}

self.onmessage = (e: MessageEvent<ImportMessage>) => {
  const msg = e.data;
  if (msg.type === 'parse') {
    const { raw, format } = msg.payload;
    let result: ParseResult;
    if (format === 'csv') result = parseCSV(raw);
    else if (format === 'json') result = parseJSON(raw);
    else result = parseTXT(raw);
    self.postMessage({ type: 'parsed', result });
  }
};
