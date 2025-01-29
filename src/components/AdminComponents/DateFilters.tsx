import React from "react";

interface DateFiltersProps {
  uniquePaymentDates: string[];
  selectedDate: string | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}

const DateFilters: React.FC<DateFiltersProps> = ({
  uniquePaymentDates,
  selectedDate,
  setSelectedDate,
}) => {

  // console.log(uniquePaymentDates);
  
  return (
    <div className="flex gap-2 overflow-x-auto mb-4 p-2 border-b">
      {uniquePaymentDates.map((date) => (
        <button
          key={date}
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedDate === date ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedDate(selectedDate === date ? null : date)} // Deselect on second click
        >
          {date}
        </button>
      ))}
    </div>
  );
};


export default DateFilters;
