/**
 * ShareService — manages the shared_packs collection in Firestore.
 *
 * Firestore schema: shared_packs/{packId}
 * {
 *   authorId, authorName, authorPhoto, name, description, tags[],
 *   cards: [{word, translation, definition, example, group}],
 *   downloadCount, createdAt
 * }
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    updateDoc,
    increment,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from 'firebase/auth';
import { loadDatabase } from '../lib/storage';
import { commitImport } from './importService';

const PACKS_COL = 'shared_packs';

export interface SharedPack {
    id: string;
    authorId: string;
    authorName: string;
    authorPhoto: string | null;
    name: string;
    description: string;
    tags: string[];
    cardCount: number;
    cards: PackCard[];
    downloadCount: number;
    createdAt: number;
}

export interface PackCard {
    word: string;
    translation: string;
    definition?: string;
    example?: string;
    group?: string;
}

export interface PublishPackOptions {
    name: string;
    description: string;
    tags: string[];
    groupId: string;
}

/**
 * Publish a group as a public pack.
 * Returns the new pack document ID.
 */
export async function publishPack(
    user: User,
    options: PublishPackOptions
): Promise<string> {
    const { name, description, tags, groupId } = options;
    const localDb = loadDatabase();
    const group = localDb.groups[groupId];
    if (!group) throw new Error('Grupo no encontrado.');

    const cards: PackCard[] = group.cardIds
        .map((cid) => localDb.cards[cid])
        .filter(Boolean)
        .map((c) => ({
            word: c.word,
            translation: c.translation,
            definition: c.definition ?? '',
            example: c.example ?? '',
            group: group.name,
        }));

    if (cards.length === 0) {
        throw new Error('El grupo no tiene tarjetas para compartir.');
    }

    const ref = await addDoc(collection(db, PACKS_COL), {
        authorId: user.uid,
        authorName: user.displayName ?? user.email ?? 'Estudiante',
        authorPhoto: user.photoURL ?? null,
        name: name.trim(),
        description: description.trim(),
        tags: tags.map((t) => t.toLowerCase().trim()),
        cards,
        cardCount: cards.length,
        downloadCount: 0,
        createdAt: Date.now(),
    });

    return ref.id;
}

/**
 * Fetch packs from Firestore with optional text/tag filter.
 */
export async function fetchPacks(options?: {
    search?: string;
    tag?: string;
    limitCount?: number;
    authorId?: string;
}): Promise<SharedPack[]> {
    const { tag, limitCount = 30, authorId } = options ?? {};

    let q = query(
        collection(db, PACKS_COL),
        orderBy('downloadCount', 'desc'),
        limit(limitCount)
    );

    if (tag) {
        q = query(
            collection(db, PACKS_COL),
            where('tags', 'array-contains', tag),
            orderBy('downloadCount', 'desc'),
            limit(limitCount)
        );
    }

    if (authorId) {
        q = query(
            collection(db, PACKS_COL),
            where('authorId', '==', authorId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
    }

    try {
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<SharedPack, 'id'>),
        }));
    } catch (err) {
        console.error('[ShareService] fetchPacks error', err);
        return [];
    }
}

/**
 * Download and import a pack into the local database.
 * Also increments downloadCount in Firestore.
 */
export async function importPack(packId: string): Promise<{
    importedCount: number;
    duplicateCount: number;
}> {
    const ref = doc(db, PACKS_COL, packId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Pack no encontrado.');

    const data = snap.data() as Omit<SharedPack, 'id'>;

    // Build ImportRow array compatible with commitImport
    const rows = data.cards.map((c) => ({
        id: crypto.randomUUID(),
        raw: {
            word: c.word,
            translation: c.translation,
            definition: c.definition ?? '',
            example: c.example ?? '',
            group: c.group ?? '',
        },
        status: 'NEW' as const,
        normalizedKey: `${c.word.toLowerCase().trim()}::${c.translation.toLowerCase().trim()}`,
    }));

    const log = commitImport(rows as any);

    // Increment download counter (fire & forget)
    updateDoc(ref, { downloadCount: increment(1) }).catch(() => { });

    return {
        importedCount: log.importedCount,
        duplicateCount: log.cardsSkipped.length,
    };
}

/** Delete your own pack */
export async function deletePack(packId: string): Promise<void> {
    await deleteDoc(doc(db, PACKS_COL, packId));
}
