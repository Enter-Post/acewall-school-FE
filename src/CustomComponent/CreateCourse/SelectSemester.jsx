import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/AxiosInstance";
import { ChevronDown } from "lucide-react";

const SelectSemester = ({ register, errors, setSelectedSemester }) => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [tempSelectedSemesters, setTempSelectedSemesters] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await axiosInstance.get("semester/get");
        setSemesters(res.data.semesters);
      } catch (err) {
        console.error("Failed to fetch semesters:", err);
      }
    };
    fetchSemesters();
  }, []);

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      // When opening, copy current selection to temp
      setTempSelectedSemesters([...selectedSemesters]);
    } else {
      // When closing without confirmation, reset temp to current selection
      setTempSelectedSemesters([...selectedSemesters]);
    }
    setOpen(isOpen);
  };

  const toggleSemester = (id) => {
    setTempSelectedSemesters((prev) => {
      if (prev.includes(id)) {
        return prev.filter((semId) => semId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const confirmSelection = () => {
    setSelectedSemesters(tempSelectedSemesters);
    setSelectedSemester(tempSelectedSemesters);
    register("semester").onChange({ 
      target: { name: "semester", value: tempSelectedSemesters } 
    });
    setOpen(false);
  };

  const selectedTitles = semesters
    .filter((s) => selectedSemesters.includes(s._id))
    .map((s) => s.title)
    .join(", ");

  return (
    <div>
      <Label htmlFor="semester" className="block mb-2">
        Semester *
      </Label>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedSemesters.length > 0 ? selectedTitles : "Select semester(s)"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[500px] p-4 space-y-2">
          <ScrollArea className="h-48 pr-2 w-full">
            {semesters.map((semester) => (
              <div key={semester._id} className="flex items-center space-x-2 mb-2 w-full">
                <Checkbox
                  id={semester._id}
                  checked={tempSelectedSemesters.includes(semester._id)}
                  onCheckedChange={() => toggleSemester(semester._id)}
                />
                <label htmlFor={semester._id} className="text-sm cursor-pointer">
                  {semester.title}
                </label>
              </div>
            ))}
          </ScrollArea>

          <Button size="sm" className="w-full mt-2" onClick={confirmSelection}>
            Select
          </Button>
        </PopoverContent>
      </Popover>

      <input type="hidden" {...register("semester")} value={selectedSemesters} />

      {errors?.semester && (
        <p className="text-xs text-red-500 mt-1">{errors.semester.message}</p>
      )}
    </div>
  );
};

export default SelectSemester;