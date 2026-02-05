/**
 * Command for creating a training
 * Application layer command - simple type definition without validation
 */
export interface CreateTrainingCommand {
  employee_id?: number;
  training_date: Date;
  trainings_cert_id: number;
  training_title?: string;
  desc1?: string;
  image_path?: string;
}
