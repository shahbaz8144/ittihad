export class SubcategoriesDTO {
    CategoryJson:string
    SubCategoryJson:string
    CreatedBy:number
    OrganizationId:number
    RoleId:number
    CategoryId:number
    CategoryName:string
    Description:string
    IsActive:boolean
    SubCategoryId:number
    SubCategoryName:string
    IsUnderSubCategory:boolean
    SubCategoryDescription:string
    SubId:number
    message:string
    Data:string;
  checked: boolean
  Subcategories?: SubcategoriesDTO[]; // Recursive for nested subcategories

}
