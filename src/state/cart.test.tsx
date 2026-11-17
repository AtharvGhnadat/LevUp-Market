import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { CartProvider, useCart } from "./cart";

describe("Cart Context & State", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it("starts with an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.count).toBe(0);
    expect(result.current.items).toEqual([]);
  });

  it("adds an item to the cart and updates count", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add("esp32-smart-irrigation", "ESP32 Smart Irrigation System", {
        packageName: "Standard",
        packagePrice: 649900,
      });
    });

    expect(result.current.count).toBe(1);
    expect(result.current.has("esp32-smart-irrigation")).toBe(true);
    expect(result.current.items[0].title).toBe("ESP32 Smart Irrigation System");
  });

  it("updates existing item configuration instead of duplicating", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add("esp32-smart-irrigation", "ESP32 Smart Irrigation System", {
        packageName: "Basic",
      });
    });

    act(() => {
      result.current.add("esp32-smart-irrigation", "ESP32 Smart Irrigation System", {
        packageName: "Premium",
      });
    });

    expect(result.current.count).toBe(1);
    expect(result.current.items[0].configuration?.packageName).toBe("Premium");
  });

  it("removes an item by slug", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add("esp32-smart-irrigation", "ESP32 Smart Irrigation System");
      result.current.add("ai-object-detection-yolo", "AI Object Detection");
    });

    expect(result.current.count).toBe(2);

    act(() => {
      result.current.remove("esp32-smart-irrigation");
    });

    expect(result.current.count).toBe(1);
    expect(result.current.has("esp32-smart-irrigation")).toBe(false);
    expect(result.current.has("ai-object-detection-yolo")).toBe(true);
  });
});
