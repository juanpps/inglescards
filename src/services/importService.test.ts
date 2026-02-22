import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeImportRows,
  commitImport,
  revertImport,
  type ImportRow,
} from './importService';
import { loadDatabase } from '../lib/storage';

const STORAGE_KEY = 'icfes_srs_v1';

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      meta: { version: 1, lastModified: Date.now(), schemaVersion: '1.0' },
      cards: {},
      groups: {},
      imports: {},
      settings: {
        newCardsPerDay: 20,
        reviewCardsPerDay: 200,
        learnSteps: [1, 10],
        lapseSteps: [10],
        graduatingInterval: 1,
        easyInterval: 4,
        newInterval: 1,
        leechThreshold: 8,
        darkMode: false,
      },
      stats: { totalStudied: 0, totalCorrect: 0, streakDays: 0, byGroup: {} },
    })
  );
});

describe('normalizeImportRows', () => {
  it('detecta filas NEW para vocabulario nuevo', () => {
    const result = normalizeImportRows({
      rows: [
        { word: 'hello', translation: 'hola' },
        { palabra: 'goodbye', traduccion: 'adiós' },
      ],
      headers: ['word', 'translation'],
      errors: [],
    });
    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('NEW');
    expect(result[1].status).toBe('NEW');
    expect(result[0].raw.word).toBe('hello');
    expect(result[0].raw.translation).toBe('hola');
  });

  it('detecta duplicados cuando word+translation ya existen', () => {
    const db = loadDatabase();
    db.cards['id-1'] = {
      id: 'id-1',
      word: 'hello',
      translation: 'hola',
      groups: [],
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: 0,
      lapses: 0,
      streak: 0,
      state: 'new',
      priority: 1,
      createdAt: 0,
      updatedAt: 0,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

    const result = normalizeImportRows({
      rows: [{ word: 'hello', translation: 'hola' }],
      headers: ['word', 'translation'],
      errors: [],
    });
    expect(result[0].status).toBe('DUP');
  });

  it('detecta CONFLICT cuando hay cambios en ejemplo o grupos', () => {
    const db = loadDatabase();
    db.cards['id-1'] = {
      id: 'id-1',
      word: 'hello',
      translation: 'hola',
      example: 'old example',
      groups: [],
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: 0,
      lapses: 0,
      streak: 0,
      state: 'new',
      priority: 1,
      createdAt: 0,
      updatedAt: 0,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

    const result = normalizeImportRows({
      rows: [
        { word: 'hello', translation: 'hola', example: 'new example' },
      ],
      headers: ['word', 'translation', 'example'],
      errors: [],
    });
    expect(result[0].status).toBe('CONFLICT');
  });
});

describe('commitImport', () => {
  it('crea grupos automáticamente si se importa con group inexistente', () => {
    const rows: ImportRow[] = [
      {
        id: 'r1',
        raw: { word: 'however', translation: 'sin embargo', group: 'Conectores ICFES' },
        status: 'NEW',
        normalizedKey: 'however::sin embargo',
      },
    ];
    const log = commitImport(rows);
    const db = loadDatabase();
    expect(log.createdGroups.length).toBeGreaterThan(0);
    const group = Object.values(db.groups).find((g) => g.name === 'Conectores ICFES');
    expect(group).toBeDefined();
  });

  it('no borra cards al eliminar grupo - verificado en groupService', () => {
    // Este test verifica que el modelo permite grupos sin borrar cards
    // La eliminación de grupo quita la relación pero no borra la card
    const rows: ImportRow[] = [
      {
        id: 'r1',
        raw: { word: 'test', translation: 'prueba', group: 'G1' },
        status: 'NEW',
        normalizedKey: 'test::prueba',
      },
    ];
    commitImport(rows);
    const db = loadDatabase();
    const card = Object.values(db.cards)[0];
    expect(card).toBeDefined();
    expect(card.groups.length).toBeGreaterThan(0);
  });
});

describe('seed data format', () => {
  it('procesa correctamente filas con word, translation, example, category, group', () => {
    const parseResult = {
      rows: [
        {
          word: 'Where',
          translation: 'Donde',
          example: 'Where is the documentation?',
          category: 'wh-question',
          group: 'Preguntas Wh',
        },
      ],
      headers: ['word', 'translation', 'example', 'category', 'group'],
      errors: [] as string[],
    };
    const rows = normalizeImportRows(parseResult);
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe('NEW');
    expect(rows[0].raw.word).toBe('Where');
    expect(rows[0].raw.translation).toBe('Donde');
    expect(rows[0].raw.group).toBe('Preguntas Wh');

    const log = commitImport(rows);
    expect(log.importedCount).toBe(1);
    expect(log.createdGroups).toHaveLength(1);

    const db = loadDatabase();
    const card = Object.values(db.cards)[0];
    expect(card.word).toBe('Where');
    expect(card.translation).toBe('Donde');
    expect(card.example).toBe('Where is the documentation?');
    expect(card.category).toBe('wh-question');
    expect(card.groups).toHaveLength(1);
    expect(db.groups[card.groups[0]].cardIds).toContain(card.id);
  });
});

describe('revertImport', () => {
  it('restaura estado anterior al revertir importación', () => {
    const rows: ImportRow[] = [
      {
        id: 'r1',
        raw: { word: 'revert', translation: 'revertir' },
        status: 'NEW',
        normalizedKey: 'revert::revertir',
      },
    ];
    const log = commitImport(rows);
    expect(Object.keys(loadDatabase().cards)).toHaveLength(1);
    const ok = revertImport(log.id);
    expect(ok).toBe(true);
    expect(Object.keys(loadDatabase().cards)).toHaveLength(0);
  });
});
