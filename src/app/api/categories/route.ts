import { internalError, ok } from "@/lib/api/response"
import { CategoryService } from "@/services/category.service"

const categoryService = new CategoryService()

export async function GET() {
  try {
    const categories = await categoryService.findAll()

    return ok(categories)
  } catch {
    return internalError("Não foi possível carregar as categorias.")
  }
}
