// Write an axios api that takes     method: 'GET',
//    url: 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle,
//    headers: { 'X-Api-Key': 'YOUR_API_KEY'},
//    contentType: 'application/json',

// Path: frontend/api/exerciseApi.ts
// Write an axios api that takes     method: 'GET',
//    url: 'https://api.api-ninjas.com/v1/exercises?equipment=' + equipment,

import axios from "axios";
import { ExerciseType, Muscle } from "../generated";

export const Difficulty = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Expert: "expert",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface ExerciseResponse {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  description: string;
}

class GeneratorApi {
  private API_KEY: string = "AyH7WCjBIi3aGmxAp4Ptwg==l58MGDbMyhKdAeLp";

  getExercisesByMuscle(muscle: Muscle | string) {
    const params = new URLSearchParams();
    params.append("muscle", muscle);

    return axios({
      method: "GET",
      url: `https://api.api-ninjas.com/v1/exercises`,
      params,
      headers: { "X-Api-Key": this.API_KEY },
    });
  }

  getExercisesByName(name: string) {
    return axios({
      method: "GET",
      url: `https://api.api-ninjas.com/v1/exercises?name=${name}`,
      headers: { "X-Api-Key": this.API_KEY },
    });
  }

  getExercisesByType(type: ExerciseType | string) {
    return axios({
      method: "GET",
      url: `https://api.api-ninjas.com/v1/exercises?type=${type}`,
      headers: { "X-Api-Key": this.API_KEY },
    });
  }

  getExercisesByDifficulty(difficulty: Difficulty) {
    return axios({
      method: "GET",
      url: `https://api.api-ninjas.com/v1/exercises?difficulty=${difficulty}`,
      headers: { "X-Api-Key": this.API_KEY },
    });
  }
}

export default GeneratorApi;
