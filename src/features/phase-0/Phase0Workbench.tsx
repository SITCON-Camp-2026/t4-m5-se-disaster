import { useMemo, useState } from "react";
import { RecordCard } from "../../components/RecordCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Phase0JudgementCard } from "./Phase0JudgementCard";
import { createPhase0Judgement } from "./phase0-heuristics";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

type DraftMap = Record<string, Phase0JudgementDraft>;

function createInitialDrafts(records: Phase0MessyRecord[]): DraftMap {
  return Object.fromEntries(
    records
      .slice(0, 6)
      .map((record) => [record.id, createPhase0Judgement(record)]),
  );
}

export function Phase0Workbench({
  records,
  selectedRecordId,
  onSelect,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
}) {
  const initialDrafts = useMemo(() => createInitialDrafts(records), [records]);
  const [drafts, setDrafts] = useState<DraftMap>(initialDrafts);
  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ?? records[0];
  const selectedDraft = drafts[selectedRecord.id];
  const draftCount = Object.keys(drafts).length;
  const blockedDraftCount = Object.values(drafts).filter(
    (draft) => draft.unsafeToActDirectly,
  ).length;
  const humanReviewNoteCount = Object.values(drafts).filter((draft) =>
    draft.humanReviewNote?.trim(),
  ).length;

  function createDraft(record: Phase0MessyRecord) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [record.id]: currentDrafts[record.id] ?? createPhase0Judgement(record),
    }));
  }

  function updateDraft(draft: Phase0JudgementDraft) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [draft.messyRecordId]: draft,
    }));
  }

  function deleteDraft(recordId: string) {
    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[recordId];
      return nextDrafts;
    });
  }

  function resetDrafts() {
    setDrafts(createInitialDrafts(records));
  }

  return (
    <div className="workbench">
      <div className="workbench__intro">
        <p className="eyebrow">整理工作台</p>
        <h2>第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。</h2>
        <p>
          草稿只存在這個畫面狀態，不會寫回原始資訊，也不代表已確認。預設先建立 6
          筆保守草稿，方便小組開始人工檢查。
        </p>
      </div>

      <div className="workbench__layout">
        <aside className="workbench__queue" aria-label="選擇原始資訊">
          <div className="queue-summary">
            <strong>{draftCount} 筆草稿</strong>
            <span>{blockedDraftCount} 筆標示為不能直接變成任務</span>
          </div>
          {records.map((record) => (
            <button
              className={record.id === selectedRecord.id ? "active" : ""}
              key={record.id}
              type="button"
              onClick={() => onSelect(record.id)}
            >
              <span>{record.id}</span>
              <StatusBadge status={record.verificationStatus} />
              {drafts[record.id] ? (
                <small>已有草稿</small>
              ) : (
                <small>未建立</small>
              )}
            </button>
          ))}
        </aside>

        <div className="workbench__main">
          <RecordCard record={selectedRecord} />

          {selectedDraft ? (
            <Phase0JudgementCard
              judgement={selectedDraft}
              record={selectedRecord}
              onChange={updateDraft}
              onDelete={() => deleteDraft(selectedRecord.id)}
            />
          ) : (
            <article className="judgement-card empty-draft">
              <p className="eyebrow">尚未整理</p>
              <h3>{selectedRecord.id} 還沒有草稿</h3>
              <p>
                建立草稿後，請只寫原文可支持的資訊。若只是 agent
                推測，請放到人類修正或質疑欄位。
              </p>
              <button type="button" onClick={() => createDraft(selectedRecord)}>
                建立這筆草稿
              </button>
            </article>
          )}
        </div>

        <aside className="workbench__checklist">
          <h3>第一階段完成檢查</h3>
          <ul>
            <li>Starter 已載入 {records.length} 筆原始資訊</li>
            <li>目前有 {draftCount} 筆可編輯整理草稿</li>
            <li>{blockedDraftCount} 筆草稿標示為不能直接變成任務</li>
            <li>{humanReviewNoteCount} 筆草稿有人類修正或質疑紀錄</li>
            <li>
              把資料品質問題寫進 observations，並記錄 agent 哪裡不能直接相信
            </li>
          </ul>
          <div className="workbench__actions">
            <button type="button" onClick={() => createDraft(selectedRecord)}>
              建立目前草稿
            </button>
            <button type="button" onClick={resetDrafts}>
              重設為 6 筆保守草稿
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
