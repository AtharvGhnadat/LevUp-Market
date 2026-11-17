/**
 * WCAG 2.1 Relative Luminance and Contrast Ratio Calculator
 */

function sRgbToLinear(c) {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * sRgbToLinear(r) + 0.7152 * sRgbToLinear(g) + 0.0722 * sRgbToLinear(b);
}

function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Brand Colors
const colors = {
  Mineral: "#F1F2EC",
  Alloy: "#203735",
  AlloyDeep: "#152423",
  AlloyText: "#182C2A",
  Volt: "#E56B3F",
  VoltAction: "#B95B21", // Deep Volt / Terracotta for White Text Buttons
  VoltActionHover: "#A44E1A",
  VoltTextOnMineral: "#A44E1A", // Darkened Volt for text on Mineral canvas
  White: "#FFFFFF",
  MutedOnMineral: "#556765", // Accessible secondary text on Mineral
  Line: "#DCE1DC",
};

console.log("=== LEVUP WCAG 2.1 CONTRAST VERIFICATION ===");
const pairs = [
  { fg: "Volt", bg: "Alloy", desc: "Volt text on Alloy dark surface" },
  { fg: "Volt", bg: "Mineral", desc: "Volt text on Mineral light canvas" },
  { fg: "VoltTextOnMineral", bg: "Mineral", desc: "VoltTextOnMineral on Mineral" },
  { fg: "White", bg: "Volt", desc: "White text on standard Volt button" },
  { fg: "White", bg: "VoltAction", desc: "White text on VoltAction button" },
  { fg: "Alloy", bg: "Volt", desc: "Alloy text on standard Volt button" },
  { fg: "AlloyDeep", bg: "Volt", desc: "AlloyDeep text on standard Volt button" },
  { fg: "Alloy", bg: "Mineral", desc: "Primary text (Alloy) on Mineral canvas" },
  { fg: "AlloyText", bg: "Mineral", desc: "Primary text (AlloyText) on Mineral canvas" },
  { fg: "MutedOnMineral", bg: "Mineral", desc: "Secondary/Muted text on Mineral canvas" },
  { fg: "White", bg: "Alloy", desc: "White text on Alloy surface" },
  { fg: "Mineral", bg: "Alloy", desc: "Mineral text on Alloy surface" },
];

for (const { fg, bg, desc } of pairs) {
  const fgHex = colors[fg];
  const bgHex = colors[bg];
  const ratio = getContrast(fgHex, bgHex);
  const aaNormal =
    ratio >= 4.5 ? "PASS (AA Normal & Large)" : ratio >= 3.0 ? "PASS (AA Large only)" : "FAIL";
  const aaa = ratio >= 7.0 ? "PASS (AAA)" : "FAIL";
  console.log(
    `${desc.padEnd(46)} | ${fgHex} on ${bgHex} | Ratio: ${ratio.toFixed(2)}:1 | AA: ${aaNormal}`,
  );
}
