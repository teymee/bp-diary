export type GoalType = {
  goal_name: string,
  systolic: number,
  diastolic: number,
  pulse: number,
  end_date: string
}

export type ReadingType = {

  created_at: string,
  diastolic: number,
  id: string,
  image_url: string | null,
  note: string | null,
  pulse: number,
  recorded_at: string,
  source: string,
  systolic: number,
  user_id: string
}

export type StreakType = {
  id: string,
  user_id: string,
  current_streak: number,
  longest_streak: number,
  last_recorded_at: string
}