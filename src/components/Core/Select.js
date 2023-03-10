import React from "react";
import { withTheme } from "styled-components";

import Select from "react-select";

const defaultOptions = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const getCustomStyles = (theme, accentColor, bg, border, indicator) => {
  return {
    dropdownIndicator: () => {
      return {
        display: !indicator && "none",
      };
    },
    indicatorSeparator: () => {},
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isSelected ? theme.colors[accentColor] : theme.colors.dark,
        textAlign: "left",
        backgroundColor: bg,
      };
    },
    control: (provided, state) => {
      return {
        ...provided,
        border: !border
          ? "none"
          : state.menuIsOpen || state.isFocused
          ? `1px solid ${theme.colors[accentColor]} !important`
          : `1px solid ${theme.colors.border} !important`,
        borderRadius: 5,
        padding: "0.25rem 1rem",
        width: "100%",
        height: "auto",
        minHeight: "50px",
        outline: "none",
        boxShadow: "none",
        textAlign: "left",
        backgroundColor: bg,
      };
    },
  };
};

const SelectStyled = (
  {
    theme,
    bg = "#fff",
    border = true,
    accentColor = "success",
    name = "item",
    indicator = true,
    options = options,

    ...rest
  },
  props
) => {
  return (
    <Select
      styles={getCustomStyles(theme, accentColor, bg, border, indicator)}
      // defaultValue={options[0]}
      name={name}
      options={options}
      instanceId="inId"
      isMulti={props.isMulti}
      value={props.value}
      // zIndex={1000}
      {...rest}
    />
  );
};

export default withTheme(SelectStyled);
