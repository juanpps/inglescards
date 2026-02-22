/**
 * Hook para importación con Worker y XLSX
 */

import { useCallback, useState } from 'react';
import type { ParseResult, ParsedRow } from '../lib/importWorker';
import {
  normalizeImportRows,
  commitImport,
  type ImportRow,
} from '../services/importService';

export type ImportFormat = 'csv' | 'json' | 'xlsx' | 'txt';

export function useImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);

  const parse = useCallback(
    async (raw: string | ArrayBuffer, format: ImportFormat): Promise<ImportRow[]> => {
      setLoading(true);
      setError(null);
      setRows([]);
      setParseResult(null);
      try {
        let result: ParseResult;
        if (format === 'xlsx') {
          const XLSX = await import('xlsx');
          const wb = XLSX.read(new Uint8Array(raw as ArrayBuffer), {
            type: 'array',
          });
          const sheets = wb.SheetNames.map((n) => wb.Sheets[n]);
          const first = sheets[0];
          if (!first) throw new Error('El archivo Excel no tiene hojas');
          const arr = XLSX.utils.sheet_to_json<Record<string, unknown>>(first);
          const headers = arr[0] ? Object.keys(arr[0]) : [];
          result = {
            rows: arr.map((r) => {
              const row: ParsedRow = {};
              for (const [k, v] of Object.entries(r)) {
                row[k] = v != null ? String(v).trim() : undefined;
              }
              return row;
            }),
            headers,
            errors: [],
          };
        } else {
          const text = typeof raw === 'string' ? raw : new TextDecoder().decode(raw);
          result = await parseWithWorker(text, format);
        }
        setParseResult(result);
        const importRows = normalizeImportRows(result);
        setRows(importRows);
        return importRows;
      } catch (e) {
        const msg = (e as Error).message;
        setError(msg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const commit = useCallback(
    (conflictResolution?: Record<string, 'keep' | 'overwrite' | 'merge'>) => {
      return commitImport(rows, conflictResolution);
    },
    [rows]
  );

  const reset = useCallback(() => {
    setRows([]);
    setParseResult(null);
    setError(null);
  }, []);

  return { parse, commit, reset, rows, parseResult, loading, error };
}

async function parseWithWorker(
  raw: string,
  format: 'csv' | 'json' | 'txt'
): Promise<ParseResult> {
  const worker = new Worker(
    new URL('../lib/importWorker.ts', import.meta.url),
    { type: 'module' }
  );
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data.type === 'parsed') {
        worker.terminate();
        resolve(e.data.result);
      }
    };
    worker.onerror = () => {
      worker.terminate();
      reject(new Error('Error en el worker de importación'));
    };
    worker.postMessage({ type: 'parse', payload: { raw, format } });
  });
}
