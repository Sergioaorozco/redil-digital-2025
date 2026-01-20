import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { Calendar, CalendarViewTrigger, CalendarCurrentDate, CalendarPrevTrigger, CalendarTodayTrigger, CalendarNextTrigger, CalendarDayView, CalendarWeekView, CalendarMonthView, CalendarYearView } from "../ui/EventsCalendar";

interface calendarProps {
  listOfEvents: CalendarEvent[];
}

export interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: "default" | "blue" | "green" | "pink" | "purple" | null;
  icon?: LucideIcon;
}

function FullCalendar({ listOfEvents }: calendarProps) {
  return (
    <Calendar
      events={listOfEvents}
    >
      <div className="h-dvh py-6 flex flex-col">
        <div className="flex px-6 items-center gap-2 mb-6">
          <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
            Day
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="week"
            className="aria-[current=true]:bg-accent"
          >
            Week
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="month"
            className="aria-[current=true]:bg-accent"
          >
            Month
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="year"
            className="aria-[current=true]:bg-accent"
          >
            Year
          </CalendarViewTrigger>

          <span className="flex-1" />

          <CalendarCurrentDate />

          <CalendarPrevTrigger>
            <ChevronLeft size={20} />
            <span className="sr-only">Previous</span>
          </CalendarPrevTrigger>

          <CalendarTodayTrigger>Today</CalendarTodayTrigger>

          <CalendarNextTrigger>
            <ChevronRight size={20} />
            <span className="sr-only">Next</span>
          </CalendarNextTrigger>
        </div>

        <div className="flex-1 overflow-auto px-6 relative">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </Calendar>
  )
}

export default FullCalendar
