import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './schemas/settings.schema';
import { ShippingZone, ShippingZoneDocument } from './schemas/shipping-zone.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
    @InjectModel(ShippingZone.name) private shippingZoneModel: Model<ShippingZoneDocument>,
  ) {}

  async getSettings() {
    let settings = await this.settingsModel.findOne();
    if (!settings) {
      settings = new this.settingsModel();
      await settings.save();
    }
    return settings;
  }

  async updateSettings(data: any) {
    let settings = await this.settingsModel.findOne();
    if (!settings) {
      settings = new this.settingsModel(data);
    } else {
      if (data.storeName) settings.storeName = data.storeName;
      if (data.logoUrl !== undefined) settings.logoUrl = data.logoUrl;
      if (data.phone) settings.phone = data.phone;
      if (data.email) settings.email = data.email;
      if (data.address) settings.address = data.address;
      if (data.socialLinks) settings.socialLinks = data.socialLinks;
      if (data.freeShippingThreshold !== undefined) settings.freeShippingThreshold = data.freeShippingThreshold;
      if (data.seoDefaults) settings.seoDefaults = data.seoDefaults;
    }
    await settings.save();
    return settings;
  }

  async getShippingZones() {
    let zones = await this.shippingZoneModel.find().sort({ governorate: 1 }).exec();
    if (zones.length === 0) {
      // Seed default shipping zones for Egypt
      const defaults = [
        { governorate: 'Cairo', fee: 70, isActive: true },
        { governorate: 'Giza', fee: 70, isActive: true },
        { governorate: 'Alexandria', fee: 75, isActive: true },
        { governorate: 'Qalyubia', fee: 75, isActive: true },
        { governorate: 'Sharqia', fee: 80, isActive: true },
        { governorate: 'Dakahlia', fee: 80, isActive: true },
        { governorate: 'Beheira', fee: 80, isActive: true },
        { governorate: 'Gharbia', fee: 80, isActive: true },
        { governorate: 'Monufia', fee: 80, isActive: true },
        { governorate: 'Suez', fee: 85, isActive: true },
        { governorate: 'Ismailia', fee: 85, isActive: true },
        { governorate: 'Port Said', fee: 85, isActive: true },
        { governorate: 'Faiyum', fee: 90, isActive: true },
        { governorate: 'Beni Suef', fee: 90, isActive: true },
        { governorate: 'Minya', fee: 95, isActive: true },
        { governorate: 'Asyut', fee: 95, isActive: true },
        { governorate: 'Sohag', fee: 100, isActive: true },
        { governorate: 'Qena', fee: 105, isActive: true },
        { governorate: 'Luxor', fee: 110, isActive: true },
        { governorate: 'Aswan', fee: 115, isActive: true },
        { governorate: 'Red Sea', fee: 120, isActive: true },
        { governorate: 'South Sinai', fee: 120, isActive: true },
        { governorate: 'Other', fee: 100, isActive: true },
      ];
      await this.shippingZoneModel.insertMany(defaults);
      zones = await this.shippingZoneModel.find().sort({ governorate: 1 }).exec();
    }
    return zones;
  }

  async upsertShippingZone(data: { governorate: string; fee: number; isActive?: boolean }) {
    const zone = await this.shippingZoneModel.findOneAndUpdate(
      { governorate: data.governorate.trim() },
      { fee: data.fee, isActive: data.isActive !== undefined ? data.isActive : true },
      { upsert: true, new: true },
    );
    return zone;
  }
}
