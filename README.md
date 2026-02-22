# ICFES-SRS

PWA offline-first para vocabulario enfocado en el examen del ICFES con repetición espaciada (SRS SM-2++).

## Características

- **SRS premium (SM-2++)**: Algoritmo de repetición espaciada mejorado
- **Sistema de grupos**: Organiza tarjetas en decks personalizados
- **Importación avanzada**: CSV, JSON, XLSX y pegado desde portapapeles
- **Persistencia localStorage**: Clave `icfes_srs_v1`
- **PWA**: Instalable y funcionamiento offline

## Estructura de datos

```json
{
  "meta": {},
  "cards": {},
  "groups": {},
  "imports": {},
  "settings": {},
  "stats": {}
}
```

## Formato de importación

Campos reconocidos: `word`, `translation`, `example`, `category`, `group`, `groups`

### CSV de ejemplo
```csv
word,translation,example,category,group
however,sin embargo,However she stayed.,connector,Conectores ICFES
therefore,por lo tanto,Therefore we left.,connector,Conectores ICFES
```

### JSON de ejemplo
```json
[
  { "word": "however", "translation": "sin embargo", "group": "Conectores" }
]
```

## Desarrollo

```bash
npm install
npm run dev
```

## Tests

```bash
npm run test
```

## Build

```bash
npm run build
npm run preview
```
