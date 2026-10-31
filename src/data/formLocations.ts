export interface StateOption {
  value: string;
  label: string;
}

/** States served by the business; Michigan first and selected by default. */
export const stateOptions: StateOption[] = [
  { value: "MI", label: "Michigan" },
  { value: "IN", label: "Indiana" },
  { value: "OH", label: "Ohio" },
];

/** State pre-selected on both forms. */
export const defaultState = "MI";
