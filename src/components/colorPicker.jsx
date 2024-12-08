"use client";
import { HexColorPicker } from "react-colorful";

const ColorPicker = ({ initialColor, setInitialColor, initialBGColor }) => {
  return (
    <HexColorPicker
      color={initialColor ? initialColor : initialBGColor}
      onChange={(e) => {
        if (initialColor) {
          setInitialColor((prev) => {
            return { ...prev, font_color: e };
          });
        } else {
          setInitialColor((prev) => {
            return { ...prev, bg_color: e };
          });
        }
      }}
    />
  );
};
export default ColorPicker;
