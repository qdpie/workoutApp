from openai import OpenAI
from dotenv import load_dotenv
import os
import json
from app.schemas.exercise_schema import ExerciseGPTData

load_dotenv()

class AIService:
    @staticmethod
    async def create_workout_plan(data: ExerciseGPTData):
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={"type": "json_object"},
            messages=[
            {"role": "system", "content": "You are a fitness assistant, skilled in creating workout plans for users. Produce a json_object response"},
            # {"role": "user", "content": "Put together a workout plan for a 25 year old person.  They want a mix of cardio and strength exercises."}
            {"role": "user", "content":
                f"""
                    The following fields should be used to determine a workout plan:
                    workout_name: {data.workout_name},
                    age: {data.age},
                    gender: {data.gender},
                    weight: {data.weight},
                    height: {data.height} in inches,
                    goal: {data.goal},
                    experience: {data.experience},
                    time: {data.time} in minutes,
                    target_muscle: {data.target_muscle},
                    equipment: {data.equipment},
                    exercise_type: {data.exercise_type}
                    Use all of the above to create a plan, if a field is empty, use your best judgement to produce the plan.
                    return a json object in the following format:
                    "workout_name": "Workout Name",
                    "notes": "Any helpful notes on the workout plan",
                    "exercises": [
                        {{
                            "name": "Exercise Name",
                            "type": "type (enum: "strength", "cardio")",
                            "muscle": "muscle",
                            "equipment": "equipment",
                            "description": "A short description of the exercise, if applicable give suggestions on reps, sets, or interval times",
                        }}
                    ]
                """
            },
            ]
        )

        json_response = completion.choices[0].message.content
        data = json.loads(json_response)

        return data