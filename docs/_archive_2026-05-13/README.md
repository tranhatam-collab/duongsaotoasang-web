# Archive — 2026-05-13

Snapshot pre-Wave 1 cleanup. Các folder này chứa các bản copy/backup tích lũy từ giai đoạn audit ban đầu.

## Source of truth

**Mọi spec sống của project ở `docs/` root.** File trong thư mục archive này KHÔNG được edit. Nếu cần thông tin cũ, đọc nhưng đừng dùng làm reference cho dev/legal/operations.

## Folder content

| Folder | Origin | File | Status |
|---|---|---|---|
| `100/` | Working snapshot 2026-05-12 15:53 | `dsts-100-master-plan.md`, `dsts-bug-report.md` | Duplicate của file root |
| `files/` | Working snapshot 2026-05-12 15:09 | `dsts-100-master-plan.md`, `dsts-bug-report.md` | Duplicate của file root |
| `kehoach100:100/` | Working snapshot 2026-05-12 15:40 | `dsts-100-master-plan.md`, `dsts-bug-report.md` | Duplicate của file root |
| `nuoiduongnhunguocmow/` | Working snapshot 2026-05-13 01:49 | 4 file: `00_DSTS_MASTER_INDEX_2026.md`, `DSTS_SPRINT_0_GITHUB_ISSUES_AND_DOD.md`, `dsts-master-plan-v1.1-LOCKED.md`, `dsts-nuoi-duong-nhung-uoc-mo.md` (v1.0 cũ) | Backup; v1.0 NDNUM bị superseded bởi v1.1-REVIEWED ở root |

## Versions reference

- NDNUM source of truth hiện tại: `docs/dsts-nuoi-duong-nhung-uoc-mo-v1.1-REVIEWED.md` (Wave 3 sẽ lock thành v1.2)
- Master Plan source of truth hiện tại: `docs/dsts-master-plan-v1.2-DRAFT.md` (supersedes v1.1-LOCKED, pending re-lock)
- Master Index source of truth hiện tại: `docs/00_DSTS_MASTER_INDEX_2026.md` v1.2

## Khi nào xoá hẳn

Sau khi Wave 3 done + NDNUM v1.2-LOCKED + Master Plan re-lock v1.2-LOCKED, Founder có thể quyết định xoá `_archive_2026-05-13/` hoàn toàn. Trước đó, giữ làm safety net để rollback nếu cần.
