export class LeaveType {
  id?: number;
  desc1: string;

  constructor(dto: { id?: number; desc1: string }) {
    this.id = dto.id;
    this.desc1 = dto.desc1;
  }
}
