import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Download, RotateCcw, Database, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ImportModal } from '../components/import/ImportModal';
import {
  exportFullBackup,
  exportGroupBackup,
  getStorageSizeBytes,
  loadDatabase,
} from '../lib/storage';
import { revertImport, normalizeImportRows, commitImport } from '../services/importService';
// Removed static import of SEED_VOCABULARIO_ICFES to optimize bundle size
import { STORAGE_SIZE_WARNING_MB } from '../types';

export function Importar() {
  const [showImport, setShowImport] = useState(false);
  const [loadingSeed, setLoadingSeed] = useState(false);
  const db = loadDatabase();
  const lastImport = Object.values(db.imports).sort(
    (a, b) => b.timestamp - a.timestamp
  )[0];
  const sizeMB = (getStorageSizeBytes() / (1024 * 1024)).toFixed(2);
  const showSizeWarning = getStorageSizeBytes() > STORAGE_SIZE_WARNING_MB * 1024 * 1024;

  const handleExportAll = () => {
    const blob = new Blob([exportFullBackup()], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icfes-srs-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGroups = () => {
    const groupIds = Object.keys(db.groups);
    if (groupIds.length === 0) {
      alert('No hay grupos para exportar');
      return;
    }
    const blob = new Blob([exportGroupBackup(groupIds)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icfes-srs-groups-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRevert = () => {
    if (!lastImport?.canRevert) return;
    if (confirm('¿Revertir la última importación?')) {
      revertImport(lastImport.id);
      window.location.reload();
    }
  };

  const handleLoadSeed = async () => {
    if (!confirm('¿Cargar vocabulario ICFES de prueba? Se agregarán ~130 tarjetas en 12 grupos.')) return;
    setLoadingSeed(true);
    try {
      const { SEED_VOCABULARIO_ICFES } = await import('../data/seedVocabularioIcfes');
      const parseResult = {
        rows: SEED_VOCABULARIO_ICFES.map((r: any) => ({
          word: r.word,
          translation: r.translation,
          definition: r.definition ?? '',
          example: r.example ?? '',
          category: r.category ?? '',
          group: r.group ?? '',
        })),
        headers: ['word', 'translation', 'definition', 'example', 'category', 'group'],
        errors: [] as string[],
      };
      const importRows = normalizeImportRows(parseResult);
      if (importRows.length === 0) {
        alert('No se encontraron filas válidas para importar.');
        return;
      }
      const log = commitImport(importRows);
      alert(`Importación completada: ${log.importedCount} tarjetas agregadas.`);
      window.location.reload();
    } catch (e) {
      alert('Error al cargar datos: ' + (e as Error).message);
      console.error(e);
    } finally {
      setLoadingSeed(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Importar / Exportar
        </h1>
        <p className="text-zinc-500 mt-1">
          Gestiona tu base de datos de vocabulario
        </p>
      </div>

      <Card className="glass shadow-premium border-none rounded-3xl overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/5 dark:to-violet-500/5">
          <div className="space-y-2 text-center sm:text-left">
            <CardTitle className="text-xl font-bold">Vocabulario ICFES</CardTitle>
            <p className="text-sm text-zinc-500">
              Carga ~130 tarjetas prediseñadas: Preguntas Wh, Conectores, Verbos y más.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleLoadSeed}
            disabled={loadingSeed}
            className="min-h-[52px] px-6 bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-md w-full sm:w-auto font-bold"
          >
            <Database className="w-4 h-4 mr-2" />
            {loadingSeed ? 'Cargando...' : 'Cargar pack inicial'}
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="glass shadow-premium border-none rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" />
              Importar
            </CardTitle>
            <p className="text-sm text-zinc-500 mt-1">
              Soporta CSV, JSON, XLSX y portapapeles.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => setShowImport(true)} className="h-12 w-full bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm font-medium">
              Abrir importador
            </Button>
            <Link to="/nueva-tarjeta" className="w-full">
              <Button variant="secondary" className="h-12 w-full bg-zinc-100 dark:bg-zinc-800 border-none font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Nueva manual
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass shadow-premium border-none rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-500" />
              Respaldar
            </CardTitle>
            <p className="text-sm text-zinc-500 mt-1">
              No pierdas tu progreso. Haz un backup.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="secondary" onClick={handleExportAll} className="w-full h-12 bg-white dark:bg-zinc-800 border-none shadow-sm flex items-center justify-center font-medium">
              <Download className="w-4 h-4 mr-2" />
              Exportar todo (JSON)
            </Button>
            <Button variant="ghost" onClick={handleExportGroups} className="w-full h-12 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">
              Exportar por grupos
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {lastImport?.canRevert && (
          <Card className="glass shadow-premium border-none rounded-2xl border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Deshacer importación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500 mb-3">
                Fecha: {new Date(lastImport.timestamp).toLocaleString()}
              </p>
              <Button variant="ghost" onClick={handleRevert} className="h-10 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                Revertir cambios
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="glass shadow-premium border-none rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Estado de memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Almacenamiento local</span>
              <span className={`text-sm font-bold ${showSizeWarning ? 'text-rose-500' : 'text-emerald-500'}`}>
                {sizeMB} MB / 5.00 MB
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${showSizeWarning ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min((parseFloat(sizeMB) / 5) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
