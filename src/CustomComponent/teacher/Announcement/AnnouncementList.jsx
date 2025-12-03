import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import AnnouncementCard from "../Announcement/AnnouncementCard";

export default function AnnouncementList({ title, announcements, onDelete }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border rounded-lg overflow-hidden bg-white mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border-b">
          <CollapsibleTrigger
            className="flex items-center w-full p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
            aria-expanded={isOpen}
            aria-controls="announcements-content"
          >
            <ChevronDown
              className={`h-5 w-5 mr-2 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
            <h2 className="text-md font-semibold">
              {title} ({announcements.length})
            </h2>
            <span className="sr-only">
              {isOpen ? "Collapse" : "Expand"} announcements section
            </span>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent id="announcements-content">
          <div
            className="overflow-x-auto"
            role="region"
            aria-label="Announcements table"
          >
            {announcements.length === 0 ? (
              <div className="p-8 text-center text-gray-600" role="status">
                <p>No announcements available.</p>
              </div>
            ) : (
              <table
                className="w-full"
                role="table"
                aria-label="List of announcements"
              >
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th
                      scope="col"
                      className="p-4 text-left font-medium text-gray-700 w-1/6"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left font-medium text-gray-700 w-1/4"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left font-medium text-gray-700"
                    >
                      Message Summary
                    </th>
                    <th scope="col" className="p-4 w-24">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...announcements].reverse().map((announcement, index) => (
                    <AnnouncementCard
                      key={announcement._id}
                      announcement={announcement}
                      onDelete={onDelete}
                      rowIndex={announcements.length - index}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
