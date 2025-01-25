import DateSetter from "./DateSetter";

interface DateComponentProps {
    selectedDate: Date | null;
    heading: string;
    onDateChange: (date: Date | null) => void;
    handleDateChange: (date: Date | null) => void;
  }

// function DatesComponent({heading, selectedDate, onDateChange, handleDateChange}:DateComponentProps) {
function DatesComponent({selectedDate, handleDateChange}:DateComponentProps) {
    const startHeading = "Start Date:";
    const deadlineHeading = "Deadline:"
  return (
    <div>
        <DateSetter
            heading={startHeading}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            handleDateChange={handleDateChange}
          />
        <DateSetter
            heading={deadlineHeading}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            handleDateChange={handleDateChange}
          />
      
    </div>
  )
}

export default DatesComponent
