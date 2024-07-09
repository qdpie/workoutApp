from enum import Enum

class Gender(str, Enum):
    male = 'male'
    female = 'female'
    other = 'other'

class GoalType(str, Enum):
    weight = "weight"
    pr = "pr"
    completed = "completed"

class TrackType(str, Enum):
    reps = "reps"
    weight = "weight"
    distance = "distance"
    duration = "duration"

class ExerciseType(str, Enum):
    cardio = "cardio"
    strength = "strength"
    olympic_weightlifting = "olympic_weightlifting"
    plyometrics = "plyometrics"
    powerlifting = "powerlifting"
    stretching = "stretching"
    strongman = "strongman"

class Muscle(str, Enum):
    abdominals = "abdominals"
    abductors = "abductors"
    adductors = "adductors"
    biceps = "biceps"
    calves = "calves"
    chest = "chest"
    forearms = "forearms"
    glutes = "glutes"
    hamstrings = "hamstrings"
    lats = "lats"
    lower_back = "lower_back"
    middle_back = "middle_back"
    neck = "neck"
    quadriceps = "quadriceps"
    traps = "traps"
    triceps = "triceps"
    other = "other"