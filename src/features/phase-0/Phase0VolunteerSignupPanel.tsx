import { useState } from "react";

type AnonymousSignupDraft = {
  alias: string;
  availability: string;
  skills: string[];
  constraints: string;
};

const skillOptions = [
  "清理協助",
  "物資整理",
  "交通支援",
  "水電專長",
  "現場紀錄",
];

const initialDraft: AnonymousSignupDraft = {
  alias: "",
  availability: "今天上午",
  skills: [],
  constraints: "",
};

export function Phase0VolunteerSignupPanel() {
  const [draft, setDraft] = useState<AnonymousSignupDraft>(initialDraft);
  const [savedDraft, setSavedDraft] = useState<AnonymousSignupDraft | null>(
    null,
  );

  function updateDraft(patch: Partial<AnonymousSignupDraft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...patch }));
  }

  function toggleSkill(skill: string) {
    setDraft((currentDraft) => {
      const skills = currentDraft.skills.includes(skill)
        ? currentDraft.skills.filter((currentSkill) => currentSkill !== skill)
        : [...currentDraft.skills, skill];

      return { ...currentDraft, skills };
    });
  }

  function saveAnonymousDraft() {
    setSavedDraft({
      ...draft,
      skills: [...draft.skills],
    });
  }

  function resetAnonymousDraft() {
    setDraft(initialDraft);
    setSavedDraft(null);
  }

  return (
    <div className="signup-panel">
      <div className="panel__header">
        <div>
          <h2>志工報名</h2>
          <p>這是匿名報名欄位草稿，不是真實報名表。</p>
        </div>
      </div>

      <section className="signup-notice">
        <p className="eyebrow">Phase 0 安全邊界</p>
        <h3>目前只能建立匿名報名草稿</h3>
        <p>
          請不要填入姓名、電話、地址或真實聯絡方式。這份草稿只保留在本次頁面狀態，
          不會送出、不會寫回資料檔，也不能代表正式報名成功。
        </p>
      </section>

      <section className="anonymous-signup-form" aria-label="匿名報名欄位">
        <label>
          <span>匿名代號</span>
          <input
            value={draft.alias}
            type="text"
            onChange={(event) => updateDraft({ alias: event.target.value })}
            placeholder="例如：A-07，不要填真名"
          />
        </label>

        <label>
          <span>可服務時段</span>
          <select
            value={draft.availability}
            onChange={(event) =>
              updateDraft({ availability: event.target.value })
            }
          >
            <option>今天上午</option>
            <option>今天下午</option>
            <option>今天晚上</option>
            <option>明天上午</option>
            <option>需要人工確認</option>
          </select>
        </label>

        <fieldset>
          <legend>可協助類型</legend>
          <div className="signup-skills">
            {skillOptions.map((skill) => (
              <label key={skill}>
                <input
                  checked={draft.skills.includes(skill)}
                  type="checkbox"
                  onChange={() => toggleSkill(skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="signup-textarea">
          <span>限制或需要人工確認的地方</span>
          <textarea
            value={draft.constraints}
            onChange={(event) =>
              updateDraft({ constraints: event.target.value })
            }
            placeholder="例如：需要確認集合點是否安全，不要填地址或電話"
          />
        </label>

        <div className="signup-actions">
          <button type="button" onClick={saveAnonymousDraft}>
            儲存匿名草稿
          </button>
          <button type="button" onClick={resetAnonymousDraft}>
            清空匿名草稿
          </button>
        </div>
      </section>

      <section className="signup-preview" aria-label="匿名草稿預覽">
        <h3>匿名草稿預覽</h3>
        {savedDraft ? (
          <dl>
            <div>
              <dt>匿名代號</dt>
              <dd>{savedDraft.alias || "未填寫"}</dd>
            </div>
            <div>
              <dt>可服務時段</dt>
              <dd>{savedDraft.availability}</dd>
            </div>
            <div>
              <dt>可協助類型</dt>
              <dd>
                {savedDraft.skills.length > 0
                  ? savedDraft.skills.join("、")
                  : "未選擇"}
              </dd>
            </div>
            <div>
              <dt>限制或待確認</dt>
              <dd>{savedDraft.constraints || "未填寫"}</dd>
            </div>
          </dl>
        ) : (
          <p>尚未儲存匿名草稿</p>
        )}
      </section>

      <section className="signup-checks">
        <h3>真的要設計報名前，需要先確認</h3>
        <ul>
          <li>
            哪些資訊已經由人工確認，不只是 `needs_review` 或 `unverified`。
          </li>
          <li>誰可以決定任務可以開放志工報名。</li>
          <li>是否需要收集個資，以及公開 demo 是否可以保存這些資料。</li>
          <li>志工看到的任務是否有清楚地點、時間、安全限制與取消方式。</li>
        </ul>
      </section>
    </div>
  );
}
