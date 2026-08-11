import { CategoryRepository } from "@/repositories/category.repository"
import type { Category } from "@/types/category"

export class CategoryService {
  constructor(
    private readonly categoryRepository: typeof CategoryRepository =
      CategoryRepository,
  ) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll()

    return categories
  }
}
