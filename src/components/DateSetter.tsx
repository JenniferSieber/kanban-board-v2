import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../icons/CalendarIcon";

interface DateSetterProps {
  selectedDate: Date | null;
  heading: string;
  handleDateChange: (date: Date | null) => void;
  onDateChange: (date: Date | null) => void;
}

function DateSetter({ heading, selectedDate, onDateChange }: DateSetterProps) {
  return (
    <div className="date-setter flex flex-col items-end">
      <label className="flex font-semibold text-rose-900 items-center gap-1"> 
        <CalendarIcon />
        <span>{heading}</span>
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="MMMM d, yyyy"
        className="border rounded-md outline-none border-none flex place-items-end cursor-pointer"
        placeholderText="Pick a date"
      />
    </div>
  );
}

export default DateSetter;


