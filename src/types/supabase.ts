export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      exercise: {
        Row: {
          created_at: string | null;
          duration: number;
          exercise_name: string;
          id: string;
          order: number;
          reps: number;
          rest: number;
          sets: number;
          updated_at: string | null;
          workout_id: string;
        };
        Insert: {
          created_at?: string | null;
          duration: number;
          exercise_name: string;
          id?: string;
          order: number;
          reps: number;
          rest: number;
          sets: number;
          updated_at?: string | null;
          workout_id: string;
        };
        Update: {
          created_at?: string | null;
          duration?: number;
          exercise_name?: string;
          id?: string;
          order?: number;
          reps?: number;
          rest?: number;
          sets?: number;
          updated_at?: string | null;
          workout_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_exercise_workout_id_fkey";
            columns: ["workout_id"];
            isOneToOne: false;
            referencedRelation: "workout";
            referencedColumns: ["id"];
          },
        ];
      };
      profile: {
        Row: {
          avatar: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      workout: {
        Row: {
          average_completion_time: number | null;
          complete_duration_exercise_on_end: boolean;
          created_at: string | null;
          id: string;
          image: string | null;
          profile_id: string;
          sequential_sets: boolean;
          updated_at: string | null;
          workout_name: string;
        };
        Insert: {
          average_completion_time?: number | null;
          complete_duration_exercise_on_end?: boolean;
          created_at?: string | null;
          id: string;
          image?: string | null;
          profile_id: string;
          sequential_sets?: boolean;
          updated_at?: string | null;
          workout_name: string;
        };
        Update: {
          average_completion_time?: number | null;
          complete_duration_exercise_on_end?: boolean;
          created_at?: string | null;
          id?: string;
          image?: string | null;
          profile_id?: string;
          sequential_sets?: boolean;
          updated_at?: string | null;
          workout_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      workout_statistic: {
        Row: {
          completion_time: number | null;
          created_at: string;
          id: number;
          workout_id: string;
        };
        Insert: {
          completion_time?: number | null;
          created_at?: string;
          id?: number;
          workout_id: string;
        };
        Update: {
          completion_time?: number | null;
          created_at?: string;
          id?: number;
          workout_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_workout_statistic_workout_id_fkey";
            columns: ["workout_id"];
            isOneToOne: false;
            referencedRelation: "workout";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
