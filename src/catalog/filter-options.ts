import { categories } from "@/data/categories";
import {
  catalogDeliveryLabels,
  deliverableLabels,
  difficultyLabels,
  projectTypeLabels,
} from "@/data/catalog-projects";

export const categoryOptions = categories.map((category) => ({
  value: category.slug,
  label: category.name,
}));

export const projectTypeOptions = Object.entries(projectTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

export const deliveryOptions = Object.entries(catalogDeliveryLabels).map(([value, label]) => ({
  value,
  label,
}));

export const technologyOptions = [
  "Python",
  "JavaScript / TypeScript",
  "Arduino",
  "ESP32",
  "Raspberry Pi",
  "MATLAB",
  "VHDL",
  "Other technologies",
].map((value) => ({ value, label: value }));

export const difficultyOptions = Object.entries(difficultyLabels).map(([value, label]) => ({
  value,
  label,
}));

export const deliverableOptions = Object.entries(deliverableLabels).map(([value, label]) => ({
  value,
  label,
}));
