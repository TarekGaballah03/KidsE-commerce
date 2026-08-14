import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { parsePagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(query: any, includeUnpublished = false) {
    const { page, limit, skip } = parsePagination(query);
    const filter: any = { deletedAt: null };

    if (!includeUnpublished) {
      filter.isPublished = true;
    }

    if (query.category) {
      // Find category by slug or ID
      let categoryId = query.category;
      if (!Types.ObjectId.isValid(query.category)) {
        const cat = await this.categoryModel.findOne({ slug: query.category.toLowerCase() });
        if (cat) categoryId = cat._id;
      }
      filter.categories = categoryId;
    }

    if (query.ageRange) {
      filter.ageRange = query.ageRange;
    }

    if (query.isFeatured === 'true') {
      filter.isFeatured = true;
    }

    if (query.isNewArrival === 'true') {
      filter.isNewArrival = true;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { 'variants.sku': { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.size) {
      filter['variants.size'] = query.size;
    }

    if (query.color) {
      filter['variants.color.name'] = { $regex: query.color, $options: 'i' };
    }

    if (query.inStock === 'true') {
      filter['variants.stockQuantity'] = { $gt: 0 };
    }

    if (query.minPrice || query.maxPrice) {
      const priceFilter: any = {};
      if (query.minPrice) priceFilter.$gte = Number(query.minPrice);
      if (query.maxPrice) priceFilter.$lte = Number(query.maxPrice);
      filter['variants.price'] = priceFilter;
    }

    // Sort mapping
    let sort: any = { createdAt: -1 };
    if (query.sort === 'price_asc') {
      sort = { 'variants.price': 1 };
    } else if (query.sort === 'price_desc') {
      sort = { 'variants.price': -1 };
    } else if (query.sort === 'newest') {
      sort = { createdAt: -1 };
    }

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('categories', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return paginatedResponse(items, total, page, limit);
  }

  async getFeaturedProducts(limit = 8) {
    return this.productModel
      .find({ isPublished: true, isFeatured: true, deletedAt: null })
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getNewArrivals(limit = 8) {
    return this.productModel
      .find({ isPublished: true, isNewArrival: true, deletedAt: null })
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findBySlug(slug: string) {
    const product = await this.productModel
      .findOne({ slug: slug.toLowerCase(), deletedAt: null })
      .populate('categories', 'name slug');

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('categories', 'name slug');

    if (!product || product.deletedAt) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: any) {
    const slug = (data.slug || data.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await this.productModel.findOne({ slug, deletedAt: null });
    if (existing) throw new BadRequestException('Product with this slug already exists');

    // Ensure variants exist and SKUs are unique
    if (!data.variants || data.variants.length === 0) {
      throw new BadRequestException('Product must have at least one variant');
    }

    const skus = data.variants.map((v: any) => v.sku.toUpperCase());
    const uniqueSkus = new Set(skus);
    if (skus.length !== uniqueSkus.size) {
      throw new BadRequestException('Variant SKUs must be unique');
    }

    const product = new this.productModel({
      title: data.title,
      slug,
      description: data.description || '',
      categories: data.categories || [],
      ageRange: data.ageRange,
      images: data.images || [],
      variants: data.variants.map((v: any) => ({
        ...v,
        sku: v.sku.toUpperCase(),
      })),
      isFeatured: data.isFeatured || false,
      isNewArrival: data.isNewArrival || false,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      seo: data.seo || {},
    });

    await product.save();
    return this.findById(product._id.toString());
  }

  async update(id: string, data: any) {
    const product = await this.productModel.findById(id);
    if (!product || product.deletedAt) throw new NotFoundException('Product not found');

    if (data.title) product.title = data.title;
    if (data.slug || data.title) {
      const slugCandidate = (data.slug || product.slug)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      if (slugCandidate !== product.slug) {
        const existing = await this.productModel.findOne({ slug: slugCandidate, deletedAt: null });
        if (existing) throw new BadRequestException('Slug already in use by another product');
        product.slug = slugCandidate;
      }
    }

    if (data.description !== undefined) product.description = data.description;
    if (data.categories) product.categories = data.categories;
    if (data.ageRange) product.ageRange = data.ageRange;
    if (data.images) product.images = data.images;
    if (data.isFeatured !== undefined) product.isFeatured = data.isFeatured;
    if (data.isNewArrival !== undefined) product.isNewArrival = data.isNewArrival;
    if (data.isPublished !== undefined) product.isPublished = data.isPublished;
    if (data.seo) product.seo = data.seo;

    if (data.variants) {
      const skus = data.variants.map((v: any) => v.sku.toUpperCase());
      const uniqueSkus = new Set(skus);
      if (skus.length !== uniqueSkus.size) {
        throw new BadRequestException('Variant SKUs must be unique');
      }
      product.variants = data.variants.map((v: any) => ({
        ...v,
        sku: v.sku.toUpperCase(),
      }));
    }

    await product.save();
    return this.findById(id);
  }

  async archive(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    product.deletedAt = new Date();
    product.isPublished = false;
    await product.save();

    return { message: 'Product archived successfully' };
  }
}
