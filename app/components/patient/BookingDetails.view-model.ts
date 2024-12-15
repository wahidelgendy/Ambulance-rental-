import { Observable } from '@nativescript/core';
import { Staff, Equipment } from '../../models/database';
import { PricingService } from '../../services/pricing/pricing.service';

export class BookingDetailsViewModel extends Observable {
  private pricingService: PricingService;
  
  availableStaff: Staff[] = [];
  availableEquipment: Equipment[] = [];
  price = {
    baseFare: 0,
    equipmentCost: 0,
    staffCost: 0,
    total: 0
  };

  constructor() {
    super();
    this.pricingService = new PricingService();
    this.loadAvailableOptions();
  }

  private async loadAvailableOptions() {
    // Load staff and equipment from selected ambulance
    this.updatePricing();
  }

  onStaffSelectionChange(staffId: string, selected: boolean) {
    const staff = this.availableStaff.find(s => s.id === staffId);
    if (staff) {
      staff.selected = selected;
      this.updatePricing();
    }
  }

  onEquipmentSelectionChange(equipmentId: string, selected: boolean) {
    const equipment = this.availableEquipment.find(e => e.id === equipmentId);
    if (equipment) {
      equipment.selected = selected;
      this.updatePricing();
    }
  }

  private updatePricing() {
    const selectedStaff = this.availableStaff.filter(s => s.selected);
    const selectedEquipment = this.availableEquipment.filter(e => e.selected);
    
    const price = this.pricingService.calculateRidePrice(0, selectedEquipment, selectedStaff);
    this.set('price', price);
  }
}