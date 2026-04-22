import sys
import json
from datetime import datetime, timedelta


def generate_exam_timetable(courses, rooms, start_date_str, end_date_str):

    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    # Build exam days (skip Sunday)
    exam_days = []
    d = start_date

    while d <= end_date:
        if d.weekday() != 6:
            exam_days.append(d)
        d += timedelta(days=1)

    slots = ["Morning", "Afternoon"]

    timetable = []

    remaining_courses = list(courses)

    semester_last_exam = {}
    busy_rooms = {}

    for day in exam_days:

        date_str = day.strftime("%Y-%m-%d")
        semester_exam_today = set()

        for slot in slots:

            key = (date_str, slot)

            if key not in busy_rooms:
                busy_rooms[key] = set()

            for course in list(remaining_courses):

                semester = course["semester_id"]

                # Rule 1: Only one exam per semester per day
                if semester in semester_exam_today:
                    continue

                # Rule 2: Maintain 1 day gap
                if semester in semester_last_exam:
                    if (day - semester_last_exam[semester]).days < 2:
                        continue

                # Find free room
                free_room = None
                for room in rooms:
                    if room["id"] not in busy_rooms[key]:
                        free_room = room
                        break

                if free_room is None:
                    continue

                timetable.append({
                    "course_id": course["id"],
                    "course_name": course["name"],
                    "semester_id": semester,
                    "semester_num": course["semester_num"],
                    "date": date_str,
                    "slot": slot,
                    "room_id": free_room["id"],
                    "room_name": free_room["name"]
                })

                busy_rooms[key].add(free_room["id"])
                semester_exam_today.add(semester)
                semester_last_exam[semester] = day

                # Remove course permanently
                remaining_courses.remove(course)

                break

            if not remaining_courses:
                break

        if not remaining_courses:
            break

    return timetable


if __name__ == "__main__":

    try:

        data = json.loads(sys.stdin.read())

        timetable = generate_exam_timetable(
            data["courses"],
            data["rooms"],
            data["start_date"],
            data["end_date"]
        )

        # Remove duplicates just in case
        unique = []
        seen = set()

        for t in timetable:
            key = (t["course_id"], t["date"], t["slot"])
            if key not in seen:
                seen.add(key)
                unique.append(t)

        print(json.dumps(unique))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)