import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/app/App";

describe("App", () => {
  it("renders starter title", () => {
    render(<App />);
    expect(screen.getByText("災害資訊整理工作台")).toBeInTheDocument();
  });

  it("keeps the home page focused on phase 0 tabs", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "原始資訊" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "整理工作台" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "志工報名" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "通報" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "地點" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "志工任務" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "人員指派" }),
    ).not.toBeInTheDocument();
  });

  it("shows a safe volunteer signup entry without collecting real data", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "志工報名" }));

    expect(
      screen.getByRole("heading", { name: "志工報名" }),
    ).toBeInTheDocument();
    expect(screen.getByText("目前只能建立匿名報名草稿")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "送出報名" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("姓名")).not.toBeInTheDocument();
  });

  it("can save an anonymous volunteer signup draft", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "志工報名" }));
    fireEvent.change(screen.getByLabelText("匿名代號"), {
      target: { value: "A-07" },
    });
    fireEvent.click(screen.getByLabelText("物資整理"));
    fireEvent.change(screen.getByLabelText("限制或需要人工確認的地方"), {
      target: { value: "需要確認集合點是否安全" },
    });
    fireEvent.click(screen.getByRole("button", { name: "儲存匿名草稿" }));

    expect(screen.getByText("A-07")).toBeInTheDocument();
    expect(screen.getAllByText("物資整理").length).toBeGreaterThan(1);
    expect(
      screen.getAllByText("需要確認集合點是否安全").length,
    ).toBeGreaterThan(1);
    expect(
      screen.queryByRole("button", { name: "送出報名" }),
    ).not.toBeInTheDocument();
  });

  it("shows review states in the phase 0 workbench", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(
      screen.getByText(
        "第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("待人工確認").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未查核").length).toBeGreaterThan(0);
  });

  it("supports editable phase 0 drafts without changing review states", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("目前有 6 筆可編輯整理草稿")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "刪除這筆草稿" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("選擇原始資訊")).toHaveTextContent("已有草稿");
    expect(screen.queryByText("已確認")).not.toBeInTheDocument();
  });

  it("can delete and recreate a draft in the workbench", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));
    fireEvent.click(screen.getByRole("button", { name: "刪除這筆草稿" }));

    expect(screen.getByText("M-001 還沒有草稿")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "建立這筆草稿" }));

    expect(screen.getByText("M-001 的候選判斷")).toBeInTheDocument();
  });

  it("can save and delete a draft snapshot for the current page session", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("尚未儲存草稿快照")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "儲存目前草稿" }));

    expect(screen.getByText("草稿快照 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "還原" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "刪除" }));

    expect(screen.queryByText("草稿快照 1")).not.toBeInTheDocument();
    expect(screen.getByText("尚未儲存草稿快照")).toBeInTheDocument();
  });

  it("resets only the currently selected draft", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));
    fireEvent.change(screen.getByLabelText("人類修正 / 質疑 agent 的地方"), {
      target: { value: "這是人工測試備註" },
    });

    expect(
      screen.getByText("1 筆草稿有人類修正或質疑紀錄"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重設當前草稿" }));

    expect(
      screen.getByText("0 筆草稿有人類修正或質疑紀錄"),
    ).toBeInTheDocument();
    expect(screen.getByText("目前有 6 筆可編輯整理草稿")).toBeInTheDocument();
  });
});
