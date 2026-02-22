import { useState, useCallback } from 'react';
import { Upload, ClipboardList, FileJson, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useImport } from '../../hooks/useImport';

interface ImportModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 1 | 2 | 3;

export function ImportModal({ onClose, onSuccess }: ImportModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const { parse, commit, reset, rows, loading, error } = useImport();

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const ext = file.name.split('.').pop()?.toLowerCase();
      let format: 'csv' | 'json' | 'xlsx' | 'txt' = 'txt';
      if (ext === 'csv') format = 'csv';
      else if (ext === 'json') format = 'json';
      else if (ext === 'xlsx' || ext === 'xls') format = 'xlsx';
      else format = 'txt';

      const raw =
        format === 'xlsx'
          ? await file.arrayBuffer()
          : await file.text();
      const result = await parse(raw, format);
      if (result.length > 0) setStep(2);
      e.target.value = '';
    },
    [parse]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text');
      if (!text.trim()) return;
      processText(text);
    },
    [parse]
  );

  const processText = async (text: string) => {
    if (!text.trim()) return;
    let format: 'csv' | 'json' | 'txt' = 'txt';
    const trimmed = text.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) format = 'json';
    else if (trimmed.includes(',') || trimmed.includes('\t') || trimmed.includes('\n')) format = 'csv';

    const result = await parse(text, format);
    if (result.length > 0) setStep(2);
  };

  const handleManualSubmit = () => {
    processText(pastedText);
  };

  const handleCommit = useCallback(() => {
    commit();
    onSuccess?.();
    onClose();
  }, [commit, onSuccess, onClose]);

  const newCount = rows.filter((r) => r.status === 'NEW').length;
  const dupCount = rows.filter((r) => r.status === 'DUP').length;
  const conflictCount = rows.filter((r) => r.status === 'CONFLICT').length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b shrink-0 py-4 px-4 sm:px-6">
          <CardTitle className="text-lg">Importar tarjetas</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="min-h-[44px] min-w-[44px] touch-manipulation">
            Cerrar
          </Button>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 pb-6 px-4 sm:px-6 overflow-auto flex-1">
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-zinc-500 text-sm font-medium">
                  {pasteMode ? 'Opción 2: Pegar contenido' : 'Opción 1: Cargar archivo'}
                </p>
                <button
                  onClick={() => setPasteMode(!pasteMode)}
                  className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full transition-all"
                >
                  {pasteMode ? <Upload className="w-3.5 h-3.5" /> : <ClipboardList className="w-3.5 h-3.5" />}
                  {pasteMode ? 'Cambiar a archivo' : 'Pegar texto'}
                </button>
              </div>

              {!pasteMode ? (
                <div
                  className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 sm:p-12 text-center hover:border-indigo-400 transition-all cursor-pointer group min-h-[220px] flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20"
                  onPaste={handlePaste}
                  tabIndex={0}
                >
                  <input
                    type="file"
                    accept=".csv,.json,.xlsx,.xls,.txt"
                    onChange={handleFile}
                    className="hidden"
                    id="import-file"
                  />
                  <label htmlFor="import-file" className="cursor-pointer block w-full">
                    <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                      Arrastra o busca un archivo
                    </p>
                    <p className="mt-2 text-sm text-zinc-500 max-w-[200px] mx-auto">
                      Formatos compatibles: CSV, JSON, XLSX o TXT
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder='Pega aquí tu JSON (ej: [{"word": "pala", "translation": "shovel"}]) o CSV...'
                      className="w-full h-48 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono transition-all resize-none shadow-inner"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <FileJson className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>
                  <Button
                    onClick={handleManualSubmit}
                    disabled={!pastedText.trim() || loading}
                    className="w-full h-12 bg-indigo-600 text-white font-bold shadow-md hover:bg-indigo-700"
                  >
                    Procesar texto
                  </Button>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                  <p className="text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
                    <X className="w-4 h-4" /> {error}
                  </p>
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center gap-3 text-zinc-500 py-4">
                  <div className="w-4 h-4 border-2 border-zinc-300 border-t-indigo-600 rounded-full animate-spin" />
                  <span className="text-sm font-medium">Procesando datos...</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && rows.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              <p className="text-zinc-500 text-sm">
                Paso 2: Vista previa • {rows.length} filas
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-sm">
                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {newCount} NEW
                </span>
                <span className="px-2 py-1 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                  {dupCount} DUP
                </span>
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                  {conflictCount} CONFLICT
                </span>
              </div>
              <div className="max-h-48 sm:max-h-60 overflow-auto border rounded-xl -mx-1 sm:mx-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm min-w-[400px]">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 sticky top-0">
                      <tr>
                        <th className="text-left p-2 sm:p-3">Word</th>
                        <th className="text-left p-2 sm:p-3">Translation</th>
                        <th className="text-left p-2 sm:p-3 w-20">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 50).map((row) => (
                        <tr
                          key={row.id}
                          className="border-t border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="p-2 sm:p-3">
                            {row.raw.word || row.raw.palabra || '-'}
                          </td>
                          <td className="p-2 sm:p-3">
                            {row.raw.translation || row.raw.traduccion || '-'}
                          </td>
                          <td className="p-2 sm:p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${row.status === 'NEW'
                                ? 'bg-emerald-100 text-emerald-700'
                                : row.status === 'DUP'
                                  ? 'bg-zinc-100 text-zinc-600'
                                  : 'bg-amber-100 text-amber-700'
                                }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length > 50 && (
                  <p className="p-3 text-center text-zinc-500 text-sm">
                    ... y {rows.length - 50} más
                  </p>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button variant="secondary" onClick={() => { reset(); setStep(1); }} className="min-h-[44px] touch-manipulation">
                  Volver
                </Button>
                <Button onClick={handleCommit} className="min-h-[44px] touch-manipulation">
                  Importar {newCount + conflictCount} tarjetas
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
