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
});
