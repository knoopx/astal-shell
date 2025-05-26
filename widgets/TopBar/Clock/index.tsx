import { subprocess } from "astal";
import niri from "../../../support/niri";
import Date from "./Date";

export default ({
  dateFormat = "<b>%a %d %b</b>"
}) => {
  return (
    <button
      css="background: transparent; margin: 0; padding: 0;"
      onClicked={() => {
        niri.toggleOverview();
        subprocess("gnome-calendar");
      }}
      child={<Date format={dateFormat} />}
    />
  );
};
