import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/AxiosInstance";
import { ChevronDown } from "lucide-react";

const SelectQuarter = ({
  register,
  errors,
  selectedSemester,
  prevSelectedQuarters,
}) => {
  const [semesterData, setSemesterData] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState([]);
  const [tempSelectedQuarters, setTempSelectedQuarters] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch quarters based on selected semester
  useEffect(() => {
    if (!selectedSemester || selectedSemester.length === 0) {
      setSemesterData([]);
      setSelectedQuarters([]);
      setTempSelectedQuarters([]);
      return;
    }

    const fetchQuarters = async () => {
      try {
        const res = await axiosInstance.post(`quarter/getquarters_updated`, {
          semesters: selectedSemester,
        });
        console.log(res.data.data, "quarters data");
        setSemesterData(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch quarters:", err);
      }
    };

    fetchQuarters();
  }, [selectedSemester]);

  // Initialize from prevSelectedQuarters
  useEffect(() => {
    if (prevSelectedQuarters?.length) {
      setSelectedQuarters(prevSelectedQuarters);
      setTempSelectedQuarters(prevSelectedQuarters);
    }
  }, [prevSelectedQuarters]);

  // Handle popover open/close
  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      // When opening, copy current selection to temp
      setTempSelectedQuarters([...selectedQuarters]);
    } else {
      // When closing without confirmation, reset temp to current selection
      setTempSelectedQuarters([...selectedQuarters]);
    }
    setOpen(isOpen);
  };

  // Toggle quarter selection
  const toggleQuarter = (id) => {
    setTempSelectedQuarters((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Confirm selected quarters and update form state
  const confirmSelection = () => {
    setSelectedQuarters(tempSelectedQuarters);
    register("quarter").onChange({
      target: { name: "quarter", value: tempSelectedQuarters },
    });
    setOpen(false);
  };

  // Get selected quarter names for display
  const getSelectedTitles = () => {
    const titles = [];
    if (Array.isArray(semesterData)) {
      semesterData.forEach((sem) => {
        console.log(sem, "sem");
        if (sem.quarters && Array.isArray(sem.quarters)) {
          sem.quarters.forEach((q) => {
            if (selectedQuarters.includes(q._id)) {
              titles.push(q.title);
            }
          });
        }
      });
    }
    return titles.join(", ");
  };

  const selectedTitles = getSelectedTitles();

  return (
    <div>
      <Label htmlFor="quarter" className="block mb-2">
        Quarter *
      </Label>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={!selectedSemester || selectedSemester.length === 0}
          >
            {selectedQuarters.length > 0 ? selectedTitles : "Select Quarter(s)"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[500px] p-4 space-y-2">
          <ScrollArea className="h-64 pr-2">
            {Array.isArray(semesterData) && semesterData.length > 0 ? (
              semesterData.map((semData) => (
                <div key={semData._id} className="mb-4">
                  <div className="font-semibold text-sm mb-2 text-gray-700 border-b pb-1">
                    {semData.semester.title}
                  </div>
                  <div className="pl-2 space-y-2">
                    {Array.isArray(semData.quarters) &&
                      semData.quarters.map((q) => (
                        <div
                          key={q._id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={q._id}
                            checked={tempSelectedQuarters.includes(q._id)}
                            onCheckedChange={() => toggleQuarter(q._id)}
                          />
                          <label
                            htmlFor={q._id}
                            className="text-sm cursor-pointer"
                          >
                            {q.title}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No quarters available
              </div>
            )}
          </ScrollArea>

          <Button size="sm" className="w-full mt-2" onClick={confirmSelection}>
            Select
          </Button>
        </PopoverContent>
      </Popover>

      <input type="hidden" {...register("quarter")} value={selectedQuarters} />

      {errors?.quarter && (
        <p className="text-xs text-red-500 mt-1">{errors.quarter.message}</p>
      )}
    </div>
  );
};

export default SelectQuarter;