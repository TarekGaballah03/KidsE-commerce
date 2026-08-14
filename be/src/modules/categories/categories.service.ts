import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async findAll(includeInactive = false) {
    const filter: any = {};
    if (!includeInactive) filter.isActive = true;

    const categories = await this.categoryModel
      .find(filter)
      .populate('parentCategory', 'name slug')
      .sort({ sortOrder: 1, name: 1 })
      .exec();

    return categories;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryModel
      .findOne({ slug: slug.toLowerCase() })
      .populate('parentCategory', 'name slug');
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: { name: string; slug?: string; image?: string; description?: string; sortOrder?: number; parentCategory?: string }) {
    const slug = (data.slug || data.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await this.categoryModel.findOne({ slug });
    if (existing) throw new BadRequestException('Category with this slug already exists');

    const category = new this.categoryModel({
      name: data.name,
      slug,
      image: data.image || '',
      description: data.description || '',
      sortOrder: data.sortOrder || 0,
      parentCategory: data.parentCategory || null,
      isActive: true,
    });

    await category.save();
    return category;
  }

  async update(id: string, data: { name?: string; slug?: string; image?: string; description?: string; sortOrder?: number; parentCategory?: string; isActive?: boolean }) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    if (data.name) category.name = data.name;
    if (data.slug || data.name) {
      const slugCandidate = (data.slug || category.slug)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      if (slugCandidate !== category.slug) {
        const existing = await this.categoryModel.findOne({ slug: slugCandidate });
        if (existing) throw new BadRequestException('Slug already in use by another category');
        category.slug = slugCandidate;
      }
    }
    if (data.image !== undefined) category.image = data.image;
    if (data.description !== undefined) category.description = data.description;
    if (data.sortOrder !== undefined) category.sortOrder = data.sortOrder;
    if (data.parentCategory !== undefined) category.parentCategory = (data.parentCategory as any) || null;
    if (data.isActive !== undefined) category.isActive = data.isActive;

    await category.save();
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    await this.categoryModel.findByIdAndDelete(id);
    return { message: 'Category deleted successfully' };
  }
}
