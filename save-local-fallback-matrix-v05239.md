# AG Cute Blocks — TEST Local Save Fallback Compatibility Matrix V0.5.239

Scope: TEST only. PROD untouched.
Authority: authentic V0.4 snapshot/load contract + `save-local-fallback-preload-v05238.js` version 5.

## Historical compatibility locks

| Case | Legacy input | Expected validator/recovery result | Why |
|---|---|---|---|
| L01 | block has x/y/z but no id | ACCEPT | V0.4 `addBlock()` generates id when absent |
| L02 | object has type/x/z but no id | ACCEPT | V0.4 `addObject()` generates id when absent |
| L03 | object has type/x/z but no y | ACCEPT | V0.4 snapshot never persisted object y |
| L04 | object type=`crop` | ACCEPT | V0.4 loader remaps `crop` → `carrot` |
| L05 | object type=`fruitTree` | ACCEPT | V0.4 loader remaps `fruitTree` → `appleTree` |
| L06 | legacy player has finite x/z and missing y | ACCEPT | historical loader supplies y fallback |
| L07 | legacy player has finite x/y/z | ACCEPT | normal historical snapshot |

## Corruption rejection locks

| Case | Input | Expected |
|---|---|---|
| C01 | block x/y/z contains NaN/Infinity/non-numeric | REJECT |
| C02 | object x/z contains NaN/Infinity/non-numeric | REJECT |
| C03 | object type missing/empty/non-string | REJECT |
| C04 | blocks or objects is not an array | REJECT |
| C05 | blocks > 20,000 or objects > 10,000 | REJECT |
| C06 | legacy player x/z invalid | REJECT |
| C07 | legacy player y exists but is invalid | REJECT |

## Recovery behavior locks

| Case | Current | Legacy | Expected status |
|---|---|---|---|
| R01 | valid | any | `CURRENT_OK` |
| R02 | absent | valid historical | `MIGRATED_LEGACY` |
| R03 | invalid/corrupt | valid historical | backup current once + `RECOVERED_CORRUPT_CURRENT` |
| R04 | invalid/corrupt | invalid/absent | `CURRENT_INVALID_NO_LEGACY` |
| R05 | absent | invalid/absent | `NO_SAVE` |
| R06 | legacy write/readback fails | valid historical | `RECOVERY_WRITE_FAILED` |

## Non-regression rule

Do not tighten legacy validation beyond the authentic V0.4 loader contract without first proving that the historical loader rejected the same shape. In particular, never add mandatory `id` or object `y` fields to legacy validation.
