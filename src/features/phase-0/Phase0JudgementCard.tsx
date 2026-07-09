import { StatusBadge } from "../../components/StatusBadge";
import type {
  Phase0Confidence,
  Phase0JudgementDraft,
  Phase0MessyRecord,
  Phase0PossibleKind,
  Phase0SuggestedNextStep,
} from "./phase0-types";

const kindLabels: Record<Phase0JudgementDraft["possibleKind"], string> = {
  help_request_candidate: "求助候選",
  site_status_candidate: "地點狀態候選",
  task_candidate: "任務候選",
  assignment_candidate: "人員指派候選",
  announcement_candidate: "公告候選",
  unknown: "候選類型待判斷",
};

const confidenceLabels: Record<Phase0JudgementDraft["confidence"], string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const nextStepLabels: Record<
  Phase0JudgementDraft["suggestedNextStep"],
  string
> = {
  keep_raw: "先保留原始資訊",
  ask_for_more_info: "補問來源或現場資訊",
  send_to_human_review: "交給人工確認",
  create_candidate_report: "建立候選通報",
  create_site_update_suggestion: "建立地點更新建議",
  do_not_use_yet: "暫時不要使用",
};

export function Phase0JudgementCard({
  judgement,
  record,
  onChange,
  onDelete,
}: {
  judgement: Phase0JudgementDraft;
  record: Phase0MessyRecord;
  onChange: (judgement: Phase0JudgementDraft) => void;
  onDelete: () => void;
}) {
  function updateDraft(patch: Partial<Phase0JudgementDraft>) {
    onChange({ ...judgement, ...patch });
  }

  function listToText(items: string[]) {
    return items.join("\n");
  }

  function textToList(value: string) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return (
    <article className="judgement-card">
      <div className="judgement-card__header">
        <div>
          <p className="eyebrow">可編輯整理草稿</p>
          <h3>{record.id} 的候選判斷</h3>
        </div>
        <StatusBadge status={record.verificationStatus} />
      </div>

      <p>
        這是課堂中的暫存草稿，不是整理後資料。請只填入原文可支持的判斷，並把
        agent 推測或人類修正寫在備註裡。
      </p>

      <div className="draft-form">
        <label>
          <span>候選類型</span>
          <select
            value={judgement.possibleKind}
            onChange={(event) =>
              updateDraft({
                possibleKind: event.target.value as Phase0PossibleKind,
              })
            }
          >
            {Object.entries(kindLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>信心程度</span>
          <select
            value={judgement.confidence}
            onChange={(event) =>
              updateDraft({
                confidence: event.target.value as Phase0Confidence,
              })
            }
          >
            {Object.entries(confidenceLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>下一步</span>
          <select
            value={judgement.suggestedNextStep}
            onChange={(event) =>
              updateDraft({
                suggestedNextStep: event.target
                  .value as Phase0SuggestedNextStep,
              })
            }
          >
            {Object.entries(nextStepLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="draft-checkbox">
        <input
          checked={judgement.unsafeToActDirectly}
          type="checkbox"
          onChange={(event) =>
            updateDraft({ unsafeToActDirectly: event.target.checked })
          }
        />
        <span>這筆資訊目前不能直接變成志工任務</span>
      </label>

      <section>
        <label className="draft-textarea">
          <span>原文可支持的判斷依據，每行一點</span>
          <textarea
            value={listToText(judgement.evidence)}
            onChange={(event) =>
              updateDraft({ evidence: textToList(event.target.value) })
            }
          />
        </label>
      </section>

      <section>
        <label className="draft-textarea">
          <span>需要人工確認或不能直接使用的原因，每行一點</span>
          <textarea
            value={listToText(judgement.blockers)}
            onChange={(event) =>
              updateDraft({ blockers: textToList(event.target.value) })
            }
          />
        </label>
      </section>

      <section>
        <label className="draft-textarea">
          <span>人類修正 / 質疑 agent 的地方</span>
          <textarea
            value={judgement.humanReviewNote ?? ""}
            onChange={(event) =>
              updateDraft({ humanReviewNote: event.target.value })
            }
            placeholder="例如：agent 把來源說成已確認，但原文只有 needs_review。"
          />
        </label>
      </section>

      <button className="danger-button" type="button" onClick={onDelete}>
        刪除這筆草稿
      </button>
    </article>
  );
}
