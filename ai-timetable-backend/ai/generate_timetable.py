import sys
import json
import random

data = json.loads(sys.stdin.read())

courses = data["courses"]
slots = data["slots"]
rooms = data["rooms"]

days = ["Monday","Tuesday","Wednesday","Thursday","Friday"]

LUNCH_SLOT = "Lunch Break"

POPULATION_SIZE = 60
GENERATIONS = 150
MUTATION_RATE = 0.15
ELITE_SIZE = 5


# -----------------------------
# BUILD COURSE POOL (Fix subject hours)
# -----------------------------
def build_course_pool():

    pool = []

    for c in courses:

        hours = c.get("hours",3)

        for _ in range(hours):

            pool.append(c)

    return pool


# -----------------------------
# CREATE RANDOM SCHEDULE
# -----------------------------
def random_schedule():

    pool = build_course_pool()
    random.shuffle(pool)

    schedule = []

    index = 0

    for day in days:

        i = 0

        while i < len(slots):

            slot_label = slots[i]["slot_label"]

            if slot_label == LUNCH_SLOT:

                schedule.append({
                    "day":day,
                    "slot":slot_label,
                    "course":"Lunch Break",
                    "teacher":"",
                    "room":""
                })

                i += 1
                continue

            if index < len(pool):

                course = pool[index]
                index += 1

            else:

                course = random.choice(courses)

            cname = course["course_name"]
            teacher = course["teacher"]
            ctype = course.get("type","THEORY")

            room = random.choice(rooms)["room_name"]

            # LAB DOUBLE SLOT
            if ctype == "LAB" and i < len(slots)-1:

                next_slot = slots[i+1]["slot_label"]

                if next_slot != LUNCH_SLOT:

                    schedule.append({
                        "day":day,
                        "slot":slot_label,
                        "course":cname,
                        "teacher":teacher,
                        "room":room
                    })

                    schedule.append({
                        "day":day,
                        "slot":next_slot,
                        "course":cname,
                        "teacher":teacher,
                        "room":room
                    })

                    i += 2
                    continue

            schedule.append({
                "day":day,
                "slot":slot_label,
                "course":cname,
                "teacher":teacher,
                "room":room
            })

            i += 1

    return schedule


# -----------------------------
# FITNESS FUNCTION
# -----------------------------
def fitness(schedule):

    score = 0

    teacher_slot = {}
    room_slot = {}
    teacher_day_load = {}
    subject_day_count = {}
    subject_total = {}

    for s in schedule:

        course = s["course"]

        if course == "Lunch Break":
            continue

        day = s["day"]
        slot = s["slot"]
        teacher = s["teacher"]
        room = s["room"]

        tkey = f"{day}-{slot}-{teacher}"
        rkey = f"{day}-{slot}-{room}"

        # Teacher conflict
        if tkey not in teacher_slot:
            teacher_slot[tkey] = True
            score += 5
        else:
            score -= 10

        # Room conflict
        if rkey not in room_slot:
            room_slot[rkey] = True
            score += 5
        else:
            score -= 10

        # Teacher workload
        tday = f"{day}-{teacher}"
        teacher_day_load[tday] = teacher_day_load.get(tday,0)+1

        if teacher_day_load[tday] <= 4:
            score += 3
        else:
            score -= 6

        # Subject distribution per day
        sday = f"{day}-{course}"
        subject_day_count[sday] = subject_day_count.get(sday,0)+1

        if subject_day_count[sday] <= 2:
            score += 2
        else:
            score -= 4

        subject_total[course] = subject_total.get(course,0)+1

    # Subject hour balancing
    for c in courses:

        cname = c["course_name"]
        required = c.get("hours",3)
        actual = subject_total.get(cname,0)

        score -= abs(required-actual)*5

    return score


# -----------------------------
# SELECTION (Tournament)
# -----------------------------
def selection(population):

    competitors = random.sample(population,5)

    competitors.sort(key=lambda x: fitness(x),reverse=True)

    return competitors[0]


# -----------------------------
# CROSSOVER
# -----------------------------
def crossover(p1,p2):

    cut = random.randint(0,len(p1)-1)

    child = p1[:cut] + p2[cut:]

    return child


# -----------------------------
# MUTATION
# -----------------------------
def mutate(schedule):

    for i in range(len(schedule)):

        if random.random() < MUTATION_RATE:

            if schedule[i]["course"] != "LUNCH BREAK":

                c = random.choice(courses)

                schedule[i]["course"] = c["course_name"]
                schedule[i]["teacher"] = c["teacher"]
                schedule[i]["room"] = random.choice(rooms)["room_name"]

    return schedule


# -----------------------------
# INITIAL POPULATION
# -----------------------------
population = [random_schedule() for _ in range(POPULATION_SIZE)]


# -----------------------------
# EVOLUTION LOOP
# -----------------------------
for g in range(GENERATIONS):

    population.sort(key=lambda x: fitness(x),reverse=True)

    new_population = population[:ELITE_SIZE]

    while len(new_population) < POPULATION_SIZE:

        p1 = selection(population)
        p2 = selection(population)

        child = crossover(p1,p2)

        child = mutate(child)

        new_population.append(child)

    population = new_population


# -----------------------------
# BEST SOLUTION
# -----------------------------
best = max(population,key=lambda x: fitness(x))

print(json.dumps(best))

sys.stdout.flush()