import { Equipment } from '../../models/interfaces/equipment.interface';
import { Staff } from '../../models/interfaces/staff.interface';

export class PricingService {
  private readonly BASE_FARE = 500;
  private readonly PER_KM_RATE = 50;

  calculateRidePrice(
    distance: number,
    equipment: Equipment[],
    staff: Staff[]
  ) {
    const equipmentCost = this.calculateEquipmentCost(equipment);
    const staffCost = this.calculateStaffCost(staff);
    const distanceCost = distance * this.PER_KM_RATE;
    
    return {
      baseFare: this.BASE_FARE,
      equipmentCost,
      staffCost,
      distanceCost,
      total: this.BASE_FARE + equipmentCost + staffCost + distanceCost
    };
  }

  private calculateEquipmentCost(equipment: Equipment[]): number {
    return equipment.reduce((total, item) => total + item.additionalCost, 0);
  }

  private calculateStaffCost(staff: Staff[]): number {
    const staffRates = {
      driver: 200,
      paramedic: 500,
      nurse: 800,
      doctor: 1500
    };
    
    return staff.reduce((total, member) => total + staffRates[member.role], 0);
  }
}